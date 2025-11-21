// Define mocks BEFORE any imports - must be at module level
const mockGetTransactionPrice = jest.fn();
const mockGetMarketTokens = jest.fn();
const mockGetAmountTokens = jest.fn();
const mockGetProductionHistory = jest.fn();

// Mock de todos los repositorios para analytics
jest.mock('../src/Persistence/Repos/transactionRepository', () => ({
  TransactionRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getTransactionPriceAndDateByTokenId: mockGetTransactionPrice
  }))
}));

jest.mock('../src/Persistence/Repos/marketRepository', () => ({
  MarketRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getMarketTokensByTokenId: mockGetMarketTokens
  }))
}));

jest.mock('../src/Persistence/Repos/tokenRepository', () => ({
  TokenRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getAmountTokensOffMarket: mockGetAmountTokens
  }))
}));

// Mock de repositorios para production
jest.mock('../src/Persistence/Repos/productionRepository', () => ({
  ProductionRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getProductionHistory: mockGetProductionHistory
  }))
}));

// Importar después de mockear los repos
import request from 'supertest';
import { app } from '../src/index';
import { Production } from '../src/Business/Models/production';

describe('Analytics Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /analytics/tokenAnalytics', () => {
    it('should return token analytics with valid request body', async () => {
      // Arrange
      const requestBody = {
        token_id: 'token-123',
        lastTokenPrice: 100
      };

      // Mock responses para los repositorios
      mockGetTransactionPrice.mockResolvedValue({
        price: 105,
        date: '2023-01-03'
      });

      mockGetMarketTokens.mockResolvedValue(500);
      mockGetAmountTokens.mockResolvedValue(500);

      // Act
      const response = await request(app)
        .get('/analytics/tokenAnalytics')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        currentPrice: 105,
        marketSupply: 500,
        totalSupply: 1000,
        priceHistory: expect.arrayContaining([
          expect.objectContaining({
            timestamp: expect.any(Date),
            price: expect.any(Number)
          })
        ])
      });

      // Verificar que los repositorios fueron llamados correctamente
      expect(mockGetTransactionPrice).toHaveBeenCalledWith('token-123');
      expect(mockGetMarketTokens).toHaveBeenCalledWith('token-123');
      expect(mockGetAmountTokens).toHaveBeenCalledWith('token-123');
    });

    it('should handle case when no recent transactions found', async () => {
      // Arrange
      const requestBody = {
        token_id: 'token-456',
        lastTokenPrice: 150
      };

      mockGetTransactionPrice.mockResolvedValue(null);
      mockGetMarketTokens.mockResolvedValue(300);
      mockGetAmountTokens.mockResolvedValue(700);

      // Act
      const response = await request(app)
        .get('/analytics/tokenAnalytics')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.currentPrice).toBe(150); // Debería mantener el lastTokenPrice
      expect(response.body.marketSupply).toBe(300);
      expect(response.body.totalSupply).toBe(1000); // 300 + 700
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const requestBody = {
        token_id: 'token-789',
        lastTokenPrice: 200
      };

      // Simular error en la base de datos
      mockGetTransactionPrice.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      const response = await request(app)
        .get('/analytics/tokenAnalytics')
        .send(requestBody)
        .set('Accept', 'application/json');

      // El endpoint debería manejar el error y retornar un 500
      expect(response.status).toBe(500);
    });
  });
});

describe('Production Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /analytics/getProductionHistory', () => {
    it('should return production history for valid user_id', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123'
      };

      // Mock de datos de producción según el modelo Production
      const mockProductionData = [
        {
          location: 'Farm Location 1',
          user_id: 'user-123',
          crop_type: 'Coffee',
          crop_variety: 'Winter Coffee',
          est_harvest_date: '2023-06-01',
          amount: 1000,
          measure_unit: 'kg',
          biologic_features: 'Non-GMO',
          agro_conditions: 'Moderate climate with adequate rainfall',
          agro_protocols: 'Organic farming practices',
          active: true,
          contract_id: 'contract-1'
        },
        {
          location: 'Farm Location 2',
          user_id: 'user-123',
          crop_type: 'Coffee',
          crop_variety: 'Yellow Coffee',
          est_harvest_date: '2023-07-15',
          amount: 800,
          measure_unit: 'kg',
          biologic_features: 'Hybrid',
          agro_conditions: 'Warm climate with irrigation',
          agro_protocols: 'Integrated pest management',
          active: true,
          contract_id: 'contract-2'
        }
      ];

      // Crear instancias de Production a partir de los datos mock
      const mockProductionHistory: Production[] = mockProductionData.map(data =>
        new Production(
          data.location,
          data.user_id,
          data.crop_type,
          data.crop_variety,
          data.est_harvest_date,
          data.amount,
          data.measure_unit,
          data.biologic_features,
          data.agro_conditions,
          data.agro_protocols,
          data.active,
          data.contract_id
        )
      );

      // Asignar production_id a las instancias (como lo haría el constructor o la BD)
      mockProductionHistory[0].production_id = 'prod-1';
      mockProductionHistory[1].production_id = 'prod-2';

      mockGetProductionHistory.mockResolvedValue(mockProductionHistory);

      // Act
      const response = await request(app)
        .get('/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(mockGetProductionHistory).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array when user has no production history', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-no-history'
      };

      mockGetProductionHistory.mockResolvedValue([]);

      // Act
      const response = await request(app)
        .get('/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockGetProductionHistory).toHaveBeenCalledWith('user-no-history');
    });

    it('should handle database errors for production history', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123'
      };

      mockGetProductionHistory.mockRejectedValue(new Error('Production database error'));

      // Act
      const response = await request(app)
        .get('/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
    });
  });
});
