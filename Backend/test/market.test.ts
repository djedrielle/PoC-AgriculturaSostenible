import request from 'supertest';
import express from 'express';
import { router as marketRouter } from '../src/Business/Routes/marketRoutes';

// Mock del repositorio MarketRepositoryPostgres
jest.mock('../src/Persistence/Repos/marketRepository', () => ({
  MarketRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getAllTokensOnMarket: jest.fn()
  }))
}));

// Mock del modelo Token y sus dependencias
jest.mock('../src/Business/Models/token', () => {
  return {
    Token: jest.fn().mockImplementation((token_id, token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id) => ({
      token_id,
      token_name,
      emition_date,
      token_price_USD,
      amount_tokens,
      owner_id,
      production_id,
      unidad: jest.fn()
    })),
    CafeToken: jest.fn().mockImplementation((token_id, token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id) => ({
      token_id,
      token_name,
      emition_date,
      token_price_USD,
      amount_tokens,
      owner_id,
      production_id,
      unidad: () => 'cajuelas'
    })),
    PinaToken: jest.fn().mockImplementation((token_id, token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id) => ({
      token_id,
      token_name,
      emition_date,
      token_price_USD,
      amount_tokens,
      owner_id,
      production_id,
      unidad: () => 'kilos'
    })),
    BananoToken: jest.fn().mockImplementation((token_id, token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id) => ({
      token_id,
      token_name,
      emition_date,
      token_price_USD,
      amount_tokens,
      owner_id,
      production_id,
      unidad: () => 'racimos'
    })),
    TokenFactory: {
      create: jest.fn()
    }
  };
});

// Importar después de mockear
import { MarketRepositoryPostgres } from '../src/Persistence/Repos/marketRepository';
import { Token, CafeToken, PinaToken, BananoToken, TokenFactory } from '../src/Business/Models/token';

const app = express();
app.use(express.json());
app.use('/api/market', marketRouter);

describe('Market Endpoints', () => {
  let mockMarketRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMarketRepo = new MarketRepositoryPostgres();
  });

  describe('GET /api/market', () => {
    it('should return all tokens on market successfully', async () => {
      // Arrange
      const mockTokens: Token[] = [
        {
          token_id: 'token-1',
          token_name: 'Café Premium',
          emition_date: '2023-01-01',
          token_price_USD: 10.5,
          amount_tokens: 1000,
          owner_id: 'owner-1',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        },
        {
          token_id: 'token-2',
          token_name: 'Piña Golden',
          emition_date: '2023-02-01',
          token_price_USD: 8.2,
          amount_tokens: 500,
          owner_id: 'owner-2',
          production_id: 'prod-2',
          unidad: () => 'kilos'
        },
        {
          token_id: 'token-3',
          token_name: 'Banano Orgánico',
          emition_date: '2023-03-01',
          token_price_USD: 12.0,
          amount_tokens: 750,
          owner_id: 'owner-3',
          production_id: 'prod-3',
          unidad: () => 'racimos'
        }
      ];

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(mockTokens);
      expect(mockMarketRepo.getAllTokensOnMarket).toHaveBeenCalledTimes(1);

      // Verificar estructura de cada token
      response.body.forEach((token: any) => {
        expect(token).toHaveProperty('token_id');
        expect(token).toHaveProperty('token_name');
        expect(token).toHaveProperty('emition_date');
        expect(token).toHaveProperty('token_price_USD');
        expect(token).toHaveProperty('amount_tokens');
        expect(token).toHaveProperty('owner_id');
        expect(token).toHaveProperty('production_id');
      });
    });

    it('should return empty array when no tokens on market', async () => {
      // Arrange
      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue([]);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockMarketRepo.getAllTokensOnMarket).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockMarketRepo.getAllTokensOnMarket.mockRejectedValue(new Error('Database connection failed'));

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      expect(mockMarketRepo.getAllTokensOnMarket).toHaveBeenCalledTimes(1);
    });

    it('should return tokens with different types using TokenFactory', async () => {
      // Arrange
      const mockCafeToken = new (CafeToken as jest.MockedClass<typeof CafeToken>)(
        'cafe-1',
        'Café Especial',
        '2023-04-01',
        15.0,
        800,
        'owner-4',
        'prod-4'
      );

      const mockPinaToken = new (PinaToken as jest.MockedClass<typeof PinaToken>)(
        'pina-1',
        'Piña MD2',
        '2023-05-01',
        9.5,
        600,
        'owner-5',
        'prod-5'
      );

      const mockTokens: Token[] = [mockCafeToken, mockPinaToken];

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].token_name).toBe('Café Especial');
      expect(response.body[1].token_name).toBe('Piña MD2');
    });

    it('should handle large number of tokens efficiently', async () => {
      // Arrange
      const largeTokenList: Token[] = Array.from({ length: 1000 }, (_, index) => ({
        token_id: `token-${index + 1}`,
        token_name: `Token ${index + 1}`,
        emition_date: '2023-01-01',
        token_price_USD: 10 + (index * 0.1),
        amount_tokens: 100 + index,
        owner_id: `owner-${(index % 10) + 1}`,
        production_id: `prod-${(index % 100) + 1}`,
        unidad: () => 'cajuelas'
      }));

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(largeTokenList);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1000);
      expect(response.body[999].token_id).toBe('token-1000');
      expect(response.body[999].token_price_USD).toBeCloseTo(109.9);
    });

    it('should return tokens with correct price ranges', async () => {
      // Arrange
      const mockTokens: Token[] = [
        {
          token_id: 'token-cheap',
          token_name: 'Token Económico',
          emition_date: '2023-01-01',
          token_price_USD: 1.5,
          amount_tokens: 2000,
          owner_id: 'owner-1',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        },
        {
          token_id: 'token-expensive',
          token_name: 'Token Premium',
          emition_date: '2023-01-01',
          token_price_USD: 150.75,
          amount_tokens: 100,
          owner_id: 'owner-2',
          production_id: 'prod-2',
          unidad: () => 'kilos'
        }
      ];

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      
      const cheapToken = response.body.find((t: any) => t.token_id === 'token-cheap');
      const expensiveToken = response.body.find((t: any) => t.token_id === 'token-expensive');
      
      expect(cheapToken.token_price_USD).toBe(1.5);
      expect(expensiveToken.token_price_USD).toBe(150.75);
      expect(cheapToken.amount_tokens).toBe(2000);
      expect(expensiveToken.amount_tokens).toBe(100);
    });

    it('should handle tokens with zero price and amount', async () => {
      // Arrange
      const mockTokens: Token[] = [
        {
          token_id: 'token-zero',
          token_name: 'Token Sin Valor',
          emition_date: '2023-01-01',
          token_price_USD: 0,
          amount_tokens: 0,
          owner_id: 'owner-1',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        }
      ];

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].token_price_USD).toBe(0);
      expect(response.body[0].amount_tokens).toBe(0);
    });
  });

  describe('GET /api/market - Edge Cases', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockMarketRepo = new (MarketRepositoryPostgres as jest.MockedClass<typeof MarketRepositoryPostgres>)();
    });

    it('should handle tokens with very long names and IDs', async () => {
      // Arrange
      const longName = 'A'.repeat(255);
      const longId = 'B'.repeat(100);
      
      const mockTokens: Token[] = [
        {
          token_id: longId,
          token_name: longName,
          emition_date: '2023-01-01',
          token_price_USD: 10.5,
          amount_tokens: 100,
          owner_id: 'owner-1',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        }
      ];

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body[0].token_id).toBe(longId);
      expect(response.body[0].token_name).toBe(longName);
    });

    it('should handle tokens with decimal prices and amounts', async () => {
      // Arrange
      const mockTokens: Token[] = [
        {
          token_id: 'token-decimal',
          token_name: 'Token Decimal',
          emition_date: '2023-01-01',
          token_price_USD: 12.3456,
          amount_tokens: 123.456,
          owner_id: 'owner-1',
          production_id: 'prod-1',
          unidad: () => 'kilos'
        }
      ];

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .get('/api/market')
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body[0].token_price_USD).toBe(12.3456);
      expect(response.body[0].amount_tokens).toBe(123.456);
    });

    it('should handle concurrent requests correctly', async () => {
      // Arrange
      const mockTokens: Token[] = [
        {
          token_id: 'token-1',
          token_name: 'Test Token',
          emition_date: '2023-01-01',
          token_price_USD: 10,
          amount_tokens: 100,
          owner_id: 'owner-1',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        }
      ];

      mockMarketRepo.getAllTokensOnMarket.mockResolvedValue(mockTokens);

      // Act - Hacer múltiples requests simultáneos
      const requests = Array.from({ length: 5 }, () =>
        request(app)
          .get('/api/market')
          .set('Accept', 'application/json')
      );

      const responses = await Promise.all(requests);

      // Assert
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
      });
      expect(mockMarketRepo.getAllTokensOnMarket).toHaveBeenCalledTimes(5);
    });
  });
});