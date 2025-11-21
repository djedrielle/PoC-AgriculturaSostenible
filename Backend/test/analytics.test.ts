import request from 'supertest';
import express from 'express';
import { router as analyticsRouter } from '../src/Business/Routes/analyticsRoutes';

// Mock de todos los repositorios para analytics
jest.mock('../src/Persistence/Repos/transactionRepository', () => ({
  TransactionRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getTransactionPriceAndDateByTokenId: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/marketRepository', () => ({
  MarketRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getMarketTokensByTokenId: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/tokenRepository', () => ({
  TokenRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getAmountTokensOffMarket: jest.fn()
  }))
}));

// Mock de repositorios para production
jest.mock('../src/Persistence/Repos/productionRepository', () => ({
  ProductionRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getProductionHistory: jest.fn()
  }))
}));

// Importar después de mockear los repos
import { TransactionRepositoryPostgres } from '../src/Persistence/Repos/transactionRepository';
import { MarketRepositoryPostgres } from '../src/Persistence/Repos/marketRepository';
import { TokenRepositoryPostgres } from '../src/Persistence/Repos/tokenRepository';
import { ProductionRepositoryPostgres } from '../src/Persistence/Repos/productionRepository';
import { Production } from '../src/Business/Models/production';

const app = express();
app.use(express.json());
app.use('/api/analytics', analyticsRouter);

describe('Analytics Endpoints', () => {
  let mockTransactionRepo: any;
  let mockMarketRepo: any;
  let mockTokenRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTransactionRepo = new TransactionRepositoryPostgres();
    mockMarketRepo = new MarketRepositoryPostgres();
    mockTokenRepo = new TokenRepositoryPostgres();
  });

  describe('GET /api/analytics/tokenAnalytics', () => {
    it('should return token analytics with valid request body', async () => {
      // Arrange
      const requestBody = {
        token_id: 'token-123',
        lastTokenPrice: 100
      };

      // Mock responses para los repositorios
      mockTransactionRepo.getTransactionPriceAndDateByTokenId.mockResolvedValue({
        price: 105,
        date: '2023-01-03'
      });

      mockMarketRepo.getMarketTokensByTokenId.mockResolvedValue(500);
      mockTokenRepo.getAmountTokensOffMarket.mockResolvedValue(500);

      // Act
      const response = await request(app)
        .get('/api/analytics/tokenAnalytics')
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
            timestamp: expect.any(String),
            price: expect.any(Number)
          })
        ])
      });

      // Verificar que los repositorios fueron llamados correctamente
      expect(mockTransactionRepo.getTransactionPriceAndDateByTokenId).toHaveBeenCalledWith('token-123');
      expect(mockMarketRepo.getMarketTokensByTokenId).toHaveBeenCalledWith('token-123');
      expect(mockTokenRepo.getAmountTokensOffMarket).toHaveBeenCalledWith('token-123');
    });

    it('should handle case when no recent transactions found', async () => {
      // Arrange
      const requestBody = {
        token_id: 'token-456',
        lastTokenPrice: 150
      };

      mockTransactionRepo.getTransactionPriceAndDateByTokenId.mockResolvedValue(null);
      mockMarketRepo.getMarketTokensByTokenId.mockResolvedValue(300);
      mockTokenRepo.getAmountTokensOffMarket.mockResolvedValue(700);

      // Act
      const response = await request(app)
        .get('/api/analytics/tokenAnalytics')
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
      mockTransactionRepo.getTransactionPriceAndDateByTokenId.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      const response = await request(app)
        .get('/api/analytics/tokenAnalytics')
        .send(requestBody)
        .set('Accept', 'application/json');

      // El endpoint debería manejar el error y retornar un 500
      expect(response.status).toBe(500);
    });

    it('should return 400 for invalid request body', async () => {
      // Arrange - cuerpo inválido (falta token_id)
      const invalidRequestBody = {
        lastTokenPrice: 100
      };

      // Act
      const response = await request(app)
        .get('/api/analytics/tokenAnalytics')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle empty price history scenario', async () => {
      // Arrange
      const requestBody = {
        token_id: 'token-new',
        lastTokenPrice: 50
      };

      // Configurar mocks para token nuevo sin historial
      mockTransactionRepo.getTransactionPriceAndDateByTokenId.mockResolvedValue(null);
      mockMarketRepo.getMarketTokensByTokenId.mockResolvedValue(0);
      mockTokenRepo.getAmountTokensOffMarket.mockResolvedValue(1000);

      // Act
      const response = await request(app)
        .get('/api/analytics/tokenAnalytics')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.currentPrice).toBe(50);
      expect(response.body.marketSupply).toBe(0);
      expect(response.body.totalSupply).toBe(1000);
      expect(response.body.priceHistory).toEqual([]);
    });
  });
});

describe('Production Endpoints', () => {
  let mockProductionRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockProductionRepo = new ProductionRepositoryPostgres();
  });

  describe('GET /api/analytics/getProductionHistory', () => {
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

      mockProductionRepo.getProductionHistory.mockResolvedValue(mockProductionHistory);

      // Act
      const response = await request(app)
        .get('/api/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(mockProductionRepo.getProductionHistory).toHaveBeenCalledWith('user-123');
      
      // Verificar estructura de la respuesta
      expect(response.body[0]).toHaveProperty('production_id', 'prod-1');
      expect(response.body[0]).toHaveProperty('location', 'Farm Location 1');
      expect(response.body[0]).toHaveProperty('farmer_id', 'user-123');
      expect(response.body[0]).toHaveProperty('crop_type', 'Coffee');
      expect(response.body[0]).toHaveProperty('crop_variety', 'Winter Coffee');
      expect(response.body[0]).toHaveProperty('est_harvest_date', '2023-06-01');
      expect(response.body[0]).toHaveProperty('amount', 1000);
      expect(response.body[0]).toHaveProperty('measure_unit', 'kg');
      expect(response.body[0]).toHaveProperty('biologic_features', 'Non-GMO');
      expect(response.body[0]).toHaveProperty('agro_conditions', 'Moderate climate with adequate rainfall');
      expect(response.body[0]).toHaveProperty('agro_protocols', 'Organic farming practices');
      expect(response.body[0]).toHaveProperty('active', true);
      expect(response.body[0]).toHaveProperty('contract_id', 'contract-1');
    });

    it('should return empty array when user has no production history', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-no-history'
      };

      mockProductionRepo.getProductionHistory.mockResolvedValue([]);

      // Act
      const response = await request(app)
        .get('/api/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockProductionRepo.getProductionHistory).toHaveBeenCalledWith('user-no-history');
    });

    it('should handle database errors for production history', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123'
      };

      mockProductionRepo.getProductionHistory.mockRejectedValue(new Error('Production database error'));

      // Act
      const response = await request(app)
        .get('/api/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
    });

    it('should return 400 when user_id is missing', async () => {
      // Arrange
      const invalidRequestBody = {
        // user_id faltante
      };

      // Act
      const response = await request(app)
        .get('/api/analytics/getProductionHistory')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 400 when user_id is empty', async () => {
      // Arrange
      const invalidRequestBody = {
        user_id: ''
      };

      // Act
      const response = await request(app)
        .get('/api/analytics/getProductionHistory')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle large production history datasets', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-large-history'
      };

      // Crear un dataset grande simulado
      const largeProductionHistory: Production[] = Array.from({ length: 1000 }, (_, index) => {
        const production = new Production(
          `Farm Location ${index + 1}`,
          'user-large-history',
          `Crop-${index + 1}`,
          `Variety-${index + 1}`,
          `2023-01-${String((index % 30) + 1).padStart(2, '0')}`,
          100 + index,
          'kg',
          index % 2 === 0 ? 'GMO' : 'Non-GMO',
          'Standard farming conditions',
          'Standard farming protocols',
          index % 2 === 0,
          `contract-${index + 1}`
        );
        production.production_id = `prod-${index + 1}`;
        return production;
      });

      mockProductionRepo.getProductionHistory.mockResolvedValue(largeProductionHistory);

      // Act
      const response = await request(app)
        .get('/api/production/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1000);
      expect(response.body[999]).toHaveProperty('production_id', 'prod-1000');
      expect(response.body[999]).toHaveProperty('amount', 1099);
      expect(response.body[999]).toHaveProperty('crop_type', 'Crop-1000');
    });

    it('should handle productions without contract_id', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-no-contract'
      };

      const productionData = {
        location: 'Farm Location 4',
        user_id: 'user-no-contract',
        crop_type: 'Barley',
        crop_variety: 'Spring Barley',
        est_harvest_date: '2023-09-01',
        amount: 600,
        measure_unit: 'kg',
        biologic_features: 'Non-GMO',
        agro_conditions: 'Cool climate',
        agro_protocols: 'Organic practices',
        active: true
        // contract_id omitido deliberadamente
      };

      const production = new Production(
        productionData.location,
        productionData.user_id,
        productionData.crop_type,
        productionData.crop_variety,
        productionData.est_harvest_date,
        productionData.amount,
        productionData.measure_unit,
        productionData.biologic_features,
        productionData.agro_conditions,
        productionData.agro_protocols,
        productionData.active
      );
      production.production_id = 'prod-4';

      mockProductionRepo.getProductionHistory.mockResolvedValue([production]);

      // Act
      const response = await request(app)
        .get('/api/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('production_id', 'prod-4');
      expect(response.body[0]).toHaveProperty('contract_id', undefined);
    });

    it('should handle different measure units correctly', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-different-units'
      };

      const productionData1 = {
        location: 'Farm Location 5',
        user_id: 'user-different-units',
        crop_type: 'Coffee',
        crop_variety: 'Cherry Coffee',
        est_harvest_date: '2023-08-15',
        amount: 500,
        measure_unit: 'boxes',
        biologic_features: 'Heirloom',
        agro_conditions: 'Greenhouse controlled environment',
        agro_protocols: 'Hydroponic system',
        active: true,
        contract_id: 'contract-5'
      };

      const productionData2 = {
        location: 'Farm Location 6',
        user_id: 'user-different-units',
        crop_type: 'Coffee',
        crop_variety: 'Holstein Coffee',
        est_harvest_date: '2023-12-01',
        amount: 2000,
        measure_unit: 'liters',
        biologic_features: 'Conventional',
        agro_conditions: 'Dairy farm conditions',
        agro_protocols: 'Standard dairy protocols',
        active: true,
        contract_id: 'contract-6'
      };

      const production1 = new Production(
        productionData1.location,
        productionData1.user_id,
        productionData1.crop_type,
        productionData1.crop_variety,
        productionData1.est_harvest_date,
        productionData1.amount,
        productionData1.measure_unit,
        productionData1.biologic_features,
        productionData1.agro_conditions,
        productionData1.agro_protocols,
        productionData1.active,
        productionData1.contract_id
      );
      production1.production_id = 'prod-5';

      const production2 = new Production(
        productionData2.location,
        productionData2.user_id,
        productionData2.crop_type,
        productionData2.crop_variety,
        productionData2.est_harvest_date,
        productionData2.amount,
        productionData2.measure_unit,
        productionData2.biologic_features,
        productionData2.agro_conditions,
        productionData2.agro_protocols,
        productionData2.active,
        productionData2.contract_id
      );
      production2.production_id = 'prod-6';

      mockProductionRepo.getProductionHistory.mockResolvedValue([production1, production2]);

      // Act
      const response = await request(app)
        .get('/api/analytics/getProductionHistory')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('measure_unit', 'boxes');
      expect(response.body[1]).toHaveProperty('measure_unit', 'liters');
    });
  });
});

describe('Cross-Endpoint Scenarios', () => {
  let mockTransactionRepo: any;
  let mockProductionRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransactionRepo = new TransactionRepositoryPostgres();
    mockProductionRepo = new ProductionRepositoryPostgres();
  });

  it('should handle multiple simultaneous requests to both endpoints', async () => {
    // Arrange
    const analyticsRequestBody = {
      token_id: 'token-123',
      lastTokenPrice: 100
    };

    const productionRequestBody = {
      user_id: 'user-123'
    };

    // Mock para production history
    const productionData = {
      location: 'Main Farm',
      user_id: 'user-123',
      crop_type: 'Coffee',
      crop_variety: 'Winter Coffee',
      est_harvest_date: '2023-06-01',
      amount: 1000,
      measure_unit: 'kg',
      biologic_features: 'Non-GMO',
      agro_conditions: 'Moderate climate',
      agro_protocols: 'Organic protocol',
      active: true,
      contract_id: 'contract-1'
    };

    const production = new Production(
      productionData.location,
      productionData.user_id,
      productionData.crop_type,
      productionData.crop_variety,
      productionData.est_harvest_date,
      productionData.amount,
      productionData.measure_unit,
      productionData.biologic_features,
      productionData.agro_conditions,
      productionData.agro_protocols,
      productionData.active,
      productionData.contract_id
    );
    production.production_id = 'prod-1';

    mockTransactionRepo.getTransactionPriceAndDateByTokenId.mockResolvedValue({
      price: 105,
      date: '2023-01-01'
    });
    mockProductionRepo.getProductionHistory.mockResolvedValue([production]);

    // Act - Hacer requests simultáneos
    const [analyticsResponse, productionResponse] = await Promise.all([
      request(app)
        .get('/api/analytics/tokenAnalytics')
        .send(analyticsRequestBody)
        .set('Accept', 'application/json'),
      request(app)
        .get('/api/analytics/getProductionHistory')
        .send(productionRequestBody)
        .set('Accept', 'application/json')
    ]);

    // Assert
    expect(analyticsResponse.status).toBe(200);
    expect(productionResponse.status).toBe(200);
    expect(analyticsResponse.body).toHaveProperty('currentPrice');
    expect(productionResponse.body).toHaveLength(1);
    expect(productionResponse.body[0]).toHaveProperty('crop_type', 'Wheat');
    expect(productionResponse.body[0]).toHaveProperty('measure_unit', 'kg');
  });

  it('should maintain isolation between analytics and production endpoints', async () => {
    // Arrange
    const analyticsRequestBody = {
      token_id: 'token-123',
      lastTokenPrice: 100
    };

    const productionRequestBody = {
      user_id: 'user-123'
    };

    // Configurar mocks para que fallen individualmente
    mockTransactionRepo.getTransactionPriceAndDateByTokenId.mockRejectedValue(new Error('Analytics DB error'));
    mockProductionRepo.getProductionHistory.mockResolvedValue([]);

    // Act
    const analyticsResponse = await request(app)
      .get('/api/analytics/tokenAnalytics')
      .send(analyticsRequestBody)
      .set('Accept', 'application/json');

    const productionResponse = await request(app)
      .get('/api/analytics/getProductionHistory')
      .send(productionRequestBody)
      .set('Accept', 'application/json');

    // Assert - Un endpoint falla, el otro funciona
    expect(analyticsResponse.status).toBe(500);
    expect(productionResponse.status).toBe(200);
    expect(productionResponse.body).toEqual([]);
  });
});