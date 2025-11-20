import request from 'supertest';
import express from 'express';
import { router as walletRouter } from '../src/Business/Routes/walletRoutes';

// Mock de los repositorios y servicios
jest.mock('../src/Persistence/Repos/walletRepository', () => ({
  WalletRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getUserTokens: jest.fn()
  }))
}));

jest.mock('../src/Business/Services/walletService', () => ({
  WalletService: jest.fn().mockImplementation(() => ({
    getUserTokens: jest.fn()
  }))
}));

// Mock del modelo Token
jest.mock('../src/Business/Models/token', () => {
  const mockTokenBase = {
    token_id: '',
    token_name: '',
    emition_date: '',
    token_price_USD: 0,
    amount_tokens: 0,
    owner_id: '',
    production_id: '',
    unidad: jest.fn()
  };

  return {
    Token: jest.fn().mockImplementation(() => mockTokenBase),
    CafeToken: jest.fn().mockImplementation(() => ({
      ...mockTokenBase,
      unidad: () => 'cajuelas'
    })),
    PinaToken: jest.fn().mockImplementation(() => ({
      ...mockTokenBase,
      unidad: () => 'kilos'
    })),
    BananoToken: jest.fn().mockImplementation(() => ({
      ...mockTokenBase,
      unidad: () => 'racimos'
    })),
    TokenFactory: {
      create: jest.fn()
    }
  };
});

// Importar después de mockear
import { WalletRepositoryPostgres } from '../src/Persistence/Repos/walletRepository';
import { WalletService } from '../src/Business/Services/walletService';
import { Token, CafeToken, PinaToken, BananoToken, TokenFactory } from '../src/Business/Models/token';

const app = express();
app.use(express.json());
app.use('/wallet', walletRouter);

describe('Wallet Endpoints', () => {
  let mockWalletRepo: any;
  let mockWalletService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockWalletRepo = new WalletRepositoryPostgres();
    mockWalletService = new WalletService();
  });

  describe('POST /wallet/walletTokens', () => {
    it('should return user tokens successfully', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123'
      };

      const mockTokens: Token[] = [
        {
          token_id: 'token-1',
          token_name: 'Café Premium',
          emition_date: '2023-01-01',
          token_price_USD: 10.5,
          amount_tokens: 100,
          owner_id: 'user-123',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        },
        {
          token_id: 'token-2',
          token_name: 'Piña Golden',
          emition_date: '2023-02-01',
          token_price_USD: 8.2,
          amount_tokens: 50,
          owner_id: 'user-123',
          production_id: 'prod-2',
          unidad: () => 'kilos'
        },
        {
          token_id: 'token-3',
          token_name: 'Banano Orgánico',
          emition_date: '2023-03-01',
          token_price_USD: 12.0,
          amount_tokens: 75,
          owner_id: 'user-123',
          production_id: 'prod-3',
          unidad: () => 'racimos'
        }
      ];

      mockWalletService.getUserTokens.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .post('/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTokens);
      expect(mockWalletService.getUserTokens).toHaveBeenCalledWith('user-123');
      expect(response.body).toHaveLength(3);

      // Verificar estructura de cada token
      response.body.forEach((token: any) => {
        expect(token).toHaveProperty('token_id');
        expect(token).toHaveProperty('token_name');
        expect(token).toHaveProperty('emition_date');
        expect(token).toHaveProperty('token_price_USD');
        expect(token).toHaveProperty('amount_tokens');
        expect(token).toHaveProperty('owner_id');
        expect(token).toHaveProperty('production_id');
        expect(token.owner_id).toBe('user-123');
      });
    });

    it('should return empty array when user has no tokens', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-no-tokens'
      };

      mockWalletService.getUserTokens.mockResolvedValue([]);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockWalletService.getUserTokens).toHaveBeenCalledWith('user-no-tokens');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-456'
      };

      mockWalletService.getUserTokens.mockRejectedValue(new Error('Database connection failed'));

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      expect(mockWalletService.getUserTokens).toHaveBeenCalledWith('user-456');
    });

    it('should return 400 when user_id is missing', async () => {
      // Arrange
      const invalidRequestBody = {
        // user_id faltante
      };

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
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
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle tokens with different types and units', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-mixed'
      };

      // Crear mocks específicos para cada tipo de token
      const mockCafeToken = new (CafeToken as jest.MockedClass<typeof CafeToken>)(
        'cafe-1',
        'Café Especial',
        '2023-04-01',
        15.0,
        80,
        'user-mixed',
        'prod-4'
      );

      const mockPinaToken = new (PinaToken as jest.MockedClass<typeof PinaToken>)(
        'pina-1',
        'Piña MD2',
        '2023-05-01',
        9.5,
        60,
        'user-mixed',
        'prod-5'
      );

      const mockBananoToken = new (BananoToken as jest.MockedClass<typeof BananoToken>)(
        'banano-1',
        'Banano Exportación',
        '2023-06-01',
        11.0,
        90,
        'user-mixed',
        'prod-6'
      );

      const mockTokens: Token[] = [mockCafeToken, mockPinaToken, mockBananoToken];

      mockWalletService.getUserTokens.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      
      // Verificar que cada token tiene su unidad correcta
      const cafeToken = response.body.find((t: any) => t.token_name === 'Café Especial');
      const pinaToken = response.body.find((t: any) => t.token_name === 'Piña MD2');
      const bananoToken = response.body.find((t: any) => t.token_name === 'Banano Exportación');

      expect(cafeToken.unidad()).toBe('cajuelas');
      expect(pinaToken.unidad()).toBe('kilos');
      expect(bananoToken.unidad()).toBe('racimos');
    });

    it('should handle large number of tokens efficiently', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-large-wallet'
      };

      // Crear un dataset grande simulado
      const largeTokenList: Token[] = Array.from({ length: 1000 }, (_, index) => ({
        token_id: `token-${index + 1}`,
        token_name: `Token ${index + 1}`,
        emition_date: '2023-01-01',
        token_price_USD: 10 + (index * 0.1),
        amount_tokens: 100 + index,
        owner_id: 'user-large-wallet',
        production_id: `prod-${(index % 100) + 1}`,
        unidad: () => 'cajuelas'
      }));

      mockWalletService.getUserTokens.mockResolvedValue(largeTokenList);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1000);
      expect(response.body[999].token_id).toBe('token-1000');
      expect(response.body[999].token_price_USD).toBeCloseTo(109.9);
      expect(response.body[999].amount_tokens).toBe(1099);
    });

    it('should handle tokens with zero amount and price', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-zero'
      };

      const mockTokens: Token[] = [
        {
          token_id: 'token-zero',
          token_name: 'Token Sin Valor',
          emition_date: '2023-01-01',
          token_price_USD: 0,
          amount_tokens: 0,
          owner_id: 'user-zero',
          production_id: 'prod-zero',
          unidad: () => 'cajuelas'
        }
      ];

      mockWalletService.getUserTokens.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].token_price_USD).toBe(0);
      expect(response.body[0].amount_tokens).toBe(0);
    });

    it('should handle tokens with decimal amounts and prices', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-decimal'
      };

      const mockTokens: Token[] = [
        {
          token_id: 'token-decimal-1',
          token_name: 'Token Decimal',
          emition_date: '2023-01-01',
          token_price_USD: 12.3456,
          amount_tokens: 123.456,
          owner_id: 'user-decimal',
          production_id: 'prod-decimal',
          unidad: () => 'kilos'
        },
        {
          token_id: 'token-decimal-2',
          token_name: 'Token Decimal 2',
          emition_date: '2023-01-01',
          token_price_USD: 7.8912,
          amount_tokens: 78.912,
          owner_id: 'user-decimal',
          production_id: 'prod-decimal-2',
          unidad: () => 'racimos'
        }
      ];

      mockWalletService.getUserTokens.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].token_price_USD).toBe(12.3456);
      expect(response.body[0].amount_tokens).toBe(123.456);
      expect(response.body[1].token_price_USD).toBe(7.8912);
      expect(response.body[1].amount_tokens).toBe(78.912);
    });
  });

  describe('POST /api/wallet/walletTokens - Edge Cases', () => { // ✅ Cambiado a POST
    beforeEach(() => {
      jest.clearAllMocks();
      mockWalletRepo = new (WalletRepositoryPostgres as jest.MockedClass<typeof WalletRepositoryPostgres>)();
      mockWalletService = new (WalletService as jest.MockedClass<typeof WalletService>)();
    });

    it('should handle tokens with very long names and IDs', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-long'
      };

      const longName = 'A'.repeat(255);
      const longId = 'B'.repeat(100);
      
      const mockTokens: Token[] = [
        {
          token_id: longId,
          token_name: longName,
          emition_date: '2023-01-01',
          token_price_USD: 10.5,
          amount_tokens: 100,
          owner_id: 'user-long',
          production_id: 'prod-long',
          unidad: () => 'cajuelas'
        }
      ];

      mockWalletService.getUserTokens.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body[0].token_id).toBe(longId);
      expect(response.body[0].token_name).toBe(longName);
    });

    it('should handle concurrent requests for different users', async () => {
      // Arrange
      const requestBody1 = { user_id: 'user-concurrent-1' };
      const requestBody2 = { user_id: 'user-concurrent-2' };
      const requestBody3 = { user_id: 'user-concurrent-3' };

      const mockTokens1: Token[] = [
        {
          token_id: 'token-1',
          token_name: 'Token User 1',
          emition_date: '2023-01-01',
          token_price_USD: 10.0,
          amount_tokens: 100,
          owner_id: 'user-concurrent-1',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        }
      ];

      const mockTokens2: Token[] = [
        {
          token_id: 'token-2',
          token_name: 'Token User 2',
          emition_date: '2023-01-01',
          token_price_USD: 20.0,
          amount_tokens: 200,
          owner_id: 'user-concurrent-2',
          production_id: 'prod-2',
          unidad: () => 'kilos'
        }
      ];

      const mockTokens3: Token[] = [
        {
          token_id: 'token-3',
          token_name: 'Token User 3',
          emition_date: '2023-01-01',
          token_price_USD: 30.0,
          amount_tokens: 300,
          owner_id: 'user-concurrent-3',
          production_id: 'prod-3',
          unidad: () => 'racimos'
        }
      ];

      // Configurar mocks para devolver diferentes respuestas según el usuario
      mockWalletService.getUserTokens.mockImplementation((userId: string) => {
        switch (userId) {
          case 'user-concurrent-1':
            return Promise.resolve(mockTokens1);
          case 'user-concurrent-2':
            return Promise.resolve(mockTokens2);
          case 'user-concurrent-3':
            return Promise.resolve(mockTokens3);
          default:
            return Promise.resolve([]);
        }
      });

      // Act - Hacer requests simultáneos
      const [response1, response2, response3] = await Promise.all([
        request(app)
          .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
          .send(requestBody1)
          .set('Accept', 'application/json'),
        request(app)
          .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
          .send(requestBody2)
          .set('Accept', 'application/json'),
        request(app)
          .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
          .send(requestBody3)
          .set('Accept', 'application/json')
      ]);

      // Assert
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);

      expect(response1.body[0].owner_id).toBe('user-concurrent-1');
      expect(response2.body[0].owner_id).toBe('user-concurrent-2');
      expect(response3.body[0].owner_id).toBe('user-concurrent-3');

      expect(response1.body[0].token_price_USD).toBe(10.0);
      expect(response2.body[0].token_price_USD).toBe(20.0);
      expect(response3.body[0].token_price_USD).toBe(30.0);
    });

    it('should handle special characters in user_id', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123_@special#$-test'
      };

      const mockTokens: Token[] = [
        {
          token_id: 'token-special',
          token_name: 'Token Especial',
          emition_date: '2023-01-01',
          token_price_USD: 15.5,
          amount_tokens: 150,
          owner_id: 'user-123_@special#$-test',
          production_id: 'prod-special',
          unidad: () => 'cajuelas'
        }
      ];

      mockWalletService.getUserTokens.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body[0].owner_id).toBe('user-123_@special#$-test');
      expect(mockWalletService.getUserTokens).toHaveBeenCalledWith('user-123_@special#$-test');
    });

    it('should handle tokens from multiple productions', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-multi-prod'
      };

      const mockTokens: Token[] = [
        {
          token_id: 'token-prod-1',
          token_name: 'Token Prod 1',
          emition_date: '2023-01-01',
          token_price_USD: 10.0,
          amount_tokens: 100,
          owner_id: 'user-multi-prod',
          production_id: 'prod-1',
          unidad: () => 'cajuelas'
        },
        {
          token_id: 'token-prod-2',
          token_name: 'Token Prod 2',
          emition_date: '2023-02-01',
          token_price_USD: 20.0,
          amount_tokens: 200,
          owner_id: 'user-multi-prod',
          production_id: 'prod-2',
          unidad: () => 'kilos'
        },
        {
          token_id: 'token-prod-3',
          token_name: 'Token Prod 3',
          emition_date: '2023-03-01',
          token_price_USD: 30.0,
          amount_tokens: 300,
          owner_id: 'user-multi-prod',
          production_id: 'prod-3',
          unidad: () => 'racimos'
        }
      ];

      mockWalletService.getUserTokens.mockResolvedValue(mockTokens);

      // Act
      const response = await request(app)
        .post('/api/wallet/walletTokens') // ✅ Cambiado a POST
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      
      // Verificar que todos los tokens tienen diferentes production_id
      const productionIds = response.body.map((token: any) => token.production_id);
      const uniqueProductionIds = [...new Set(productionIds)];
      expect(uniqueProductionIds).toHaveLength(3);
    });
  });
});