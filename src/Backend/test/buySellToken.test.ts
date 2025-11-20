// Este archivo testea los endpoints relacionados a la compra y venta de tokens
import request from 'supertest';
import express from 'express';
import { router as tokenRouter } from '../src/Business/Routes/tokenRoutes';

// Mock de todos los repositorios y servicios
jest.mock('../src/Persistence/Repos/marketRepository', () => ({
  MarketRepositoryPostgres: jest.fn().mockImplementation(() => ({
    removeTokensFromMarket: jest.fn(),
    addTokensToMarket: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/walletRepository', () => ({
  WalletRepositoryPostgres: jest.fn().mockImplementation(() => ({
    addTokensToWallet: jest.fn(),
    removeTokensFromWallet: jest.fn()
  }))
}));

jest.mock('../src/Persistence/Repos/transactionRepository', () => ({
  TransactionRepositoryPostgres: jest.fn().mockImplementation(() => ({
    createTransaction: jest.fn()
  }))
}));

jest.mock('../src/Business/Services/transactionService', () => ({
  TransactionService: jest.fn().mockImplementation(() => ({
    createTransaction: jest.fn()
  }))
}));

// Mock del modelo Transaction
jest.mock('../src/Models/transaction', () => ({
  Transaction: jest.fn().mockImplementation((
    token_name: string,
    token_amount_transferred: number,
    token_unit_price: number,
    platform_comition: number,
    buyer_id: string,
    seller_id: string,
    transaction_id?: string,
    transaction_hash?: string,
    transaction_date?: string
  ) => ({
    token_name,
    token_amount_transferred,
    token_unit_price,
    platform_comition,
    buyer_id,
    seller_id,
    transaction_id,
    transaction_hash,
    transaction_date
  }))
}));

// Importar después de mockear
import { MarketRepositoryPostgres } from '../src/Persistence/Repos/marketRepository';
import { WalletRepositoryPostgres } from '../src/Persistence/Repos/walletRepository';
import { TransactionRepositoryPostgres } from '../src/Persistence/Repos/transactionRepository';
import TransactionService from '../src/Business/Services/transactionService';
import { Transaction } from '../src/Business/Models/transaction';

const app = express();
app.use(express.json());
app.use('/api/token', tokenRouter);

describe('Token Transaction Endpoints', () => {
  let mockMarketRepo: any;
  let mockWalletRepo: any;
  let mockTransactionRepo: any;
  let mockTransactionService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockMarketRepo = new MarketRepositoryPostgres();
    mockWalletRepo = new WalletRepositoryPostgres();
    mockTransactionRepo = new TransactionRepositoryPostgres();
    mockTransactionService = new TransactionService();
  });

  describe('POST /api/token/buyTokens', () => {
    it('should successfully process token purchase', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Café Premium',
        token_amount_transferred: 100,
        token_unit_price: 10.5,
        platform_comition: 1.5,
        buyer_id: 'buyer-123',
        seller_id: 'seller-456'
      };

      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockResolvedValue(true);
      mockTransactionService.createTransaction.mockResolvedValue('transaction-789');

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);

      // Verificar que se creó la transacción con los datos correctos
      expect(Transaction).toHaveBeenCalledWith(
        'Café Premium',
        100,
        10.5,
        1.5,
        'buyer-123',
        'seller-456'
      );

      // Verificar que se llamaron todos los repositorios
      expect(mockMarketRepo.removeTokensFromMarket).toHaveBeenCalledWith('Café Premium', 100);
      expect(mockWalletRepo.addTokensToWallet).toHaveBeenCalledWith('buyer-123', 'Café Premium', 100);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledTimes(1);
    });

    it('should handle purchase with zero platform commission', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Piña Golden',
        token_amount_transferred: 50,
        token_unit_price: 8.2,
        platform_comition: 0,
        buyer_id: 'buyer-456',
        seller_id: 'seller-789'
      };

      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockResolvedValue(true);
      mockTransactionService.createTransaction.mockResolvedValue('transaction-999');

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
      expect(Transaction).toHaveBeenCalledWith(
        'Piña Golden',
        50,
        8.2,
        0,
        'buyer-456',
        'seller-789'
      );
    });

    it('should handle database error when removing tokens from market', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Banano Orgánico',
        token_amount_transferred: 75,
        token_unit_price: 12.0,
        platform_comition: 2.0,
        buyer_id: 'buyer-111',
        seller_id: 'seller-222'
      };

      mockMarketRepo.removeTokensFromMarket.mockRejectedValue(new Error('Market database error'));

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      expect(mockWalletRepo.addTokensToWallet).not.toHaveBeenCalled();
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should handle database error when adding tokens to wallet', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Café Especial',
        token_amount_transferred: 200,
        token_unit_price: 15.0,
        platform_comition: 3.0,
        buyer_id: 'buyer-333',
        seller_id: 'seller-444'
      };

      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockRejectedValue(new Error('Wallet database error'));

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      expect(mockMarketRepo.removeTokensFromMarket).toHaveBeenCalled();
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should handle database error when creating transaction', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Piña MD2',
        token_amount_transferred: 150,
        token_unit_price: 9.5,
        platform_comition: 1.0,
        buyer_id: 'buyer-555',
        seller_id: 'seller-666'
      };

      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockResolvedValue(true);
      mockTransactionService.createTransaction.mockRejectedValue(new Error('Transaction database error'));

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      expect(mockMarketRepo.removeTokensFromMarket).toHaveBeenCalled();
      expect(mockWalletRepo.addTokensToWallet).toHaveBeenCalled();
    });

    it('should return 400 for invalid buy request body', async () => {
      // Arrange - cuerpo inválido (falta token_name)
      const invalidRequest = {
        token_amount_transferred: 100,
        token_unit_price: 10.5,
        platform_comition: 1.5,
        buyer_id: 'buyer-123',
        seller_id: 'seller-456'
      };

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(invalidRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle large token amount transfers', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Café Bulk',
        token_amount_transferred: 1000000,
        token_unit_price: 0.5,
        platform_comition: 0.1,
        buyer_id: 'buyer-bulk',
        seller_id: 'seller-bulk'
      };

      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockResolvedValue(true);
      mockTransactionService.createTransaction.mockResolvedValue('transaction-bulk');

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
      expect(mockMarketRepo.removeTokensFromMarket).toHaveBeenCalledWith('Café Bulk', 1000000);
      expect(mockWalletRepo.addTokensToWallet).toHaveBeenCalledWith('buyer-bulk', 'Café Bulk', 1000000);
    });
  });

  describe('POST /api/token/sellTokens', () => {
    it('should successfully process token sale', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-123',
        token_name: 'Café Premium',
        amount: 50
      };

      mockWalletRepo.removeTokensFromWallet.mockResolvedValue(true);
      mockMarketRepo.addTokensToMarket.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post('/api/token/sellTokens')
        .send(sellRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);

      // Verificar que se llamaron los repositorios correctamente
      expect(mockWalletRepo.removeTokensFromWallet).toHaveBeenCalledWith('seller-123', 'Café Premium', 50);
      expect(mockMarketRepo.addTokensToMarket).toHaveBeenCalledWith('seller-123', 'Café Premium', 50);
    });

    it('should handle sale with fractional amount', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-456',
        token_name: 'Piña Golden',
        amount: 25.5
      };

      mockWalletRepo.removeTokensFromWallet.mockResolvedValue(true);
      mockMarketRepo.addTokensToMarket.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post('/api/token/sellTokens')
        .send(sellRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
      expect(mockWalletRepo.removeTokensFromWallet).toHaveBeenCalledWith('seller-456', 'Piña Golden', 25.5);
      expect(mockMarketRepo.addTokensToMarket).toHaveBeenCalledWith('seller-456', 'Piña Golden', 25.5);
    });

    it('should handle database error when removing tokens from wallet', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-789',
        token_name: 'Banano Orgánico',
        amount: 30
      };

      mockWalletRepo.removeTokensFromWallet.mockRejectedValue(new Error('Wallet database error'));

      // Act
      const response = await request(app)
        .post('/api/token/sellTokens')
        .send(sellRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      expect(mockMarketRepo.addTokensToMarket).not.toHaveBeenCalled();
    });

    it('should handle database error when adding tokens to market', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-999',
        token_name: 'Café Especial',
        amount: 40
      };

      mockWalletRepo.removeTokensFromWallet.mockResolvedValue(true);
      mockMarketRepo.addTokensToMarket.mockRejectedValue(new Error('Market database error'));

      // Act
      const response = await request(app)
        .post('/api/token/sellTokens')
        .send(sellRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      expect(mockWalletRepo.removeTokensFromWallet).toHaveBeenCalled();
    });

    it('should return 400 for invalid sell request body', async () => {
      // Arrange - cuerpo inválido (falta amount)
      const invalidRequest = {
        seller_id: 'seller-123',
        token_name: 'Café Premium'
      };

      // Act
      const response = await request(app)
        .post('/api/token/sellTokens')
        .send(invalidRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle sale of zero tokens', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-zero',
        token_name: 'Piña Golden',
        amount: 0
      };

      mockWalletRepo.removeTokensFromWallet.mockResolvedValue(true);
      mockMarketRepo.addTokensToMarket.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post('/api/token/sellTokens')
        .send(sellRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
      expect(mockWalletRepo.removeTokensFromWallet).toHaveBeenCalledWith('seller-zero', 'Piña Golden', 0);
      expect(mockMarketRepo.addTokensToMarket).toHaveBeenCalledWith('seller-zero', 'Piña Golden', 0);
    });

    it('should handle very small token amounts', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-small',
        token_name: 'Banano Orgánico',
        amount: 0.001
      };

      mockWalletRepo.removeTokensFromWallet.mockResolvedValue(true);
      mockMarketRepo.addTokensToMarket.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post('/api/token/sellTokens')
        .send(sellRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
      expect(mockWalletRepo.removeTokensFromWallet).toHaveBeenCalledWith('seller-small', 'Banano Orgánico', 0.001);
    });
  });

  describe('Cross-Endpoint Scenarios', () => {
    it('should handle buy and sell operations for the same user', async () => {
      // Arrange - Datos para compra y venta
      const buyRequest = {
        token_name: 'Café Premium',
        token_amount_transferred: 100,
        token_unit_price: 10.5,
        platform_comition: 1.5,
        buyer_id: 'user-123',
        seller_id: 'seller-456'
      };

      const sellRequest = {
        seller_id: 'user-123', // El mismo usuario que compró ahora vende
        token_name: 'Café Premium',
        amount: 50
      };

      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockResolvedValue(true);
      mockWalletRepo.removeTokensFromWallet.mockResolvedValue(true);
      mockMarketRepo.addTokensToMarket.mockResolvedValue(true);
      mockTransactionService.createTransaction.mockResolvedValue('transaction-123');

      // Act - Ejecutar compra y luego venta
      const buyResponse = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      const sellResponse = await request(app)
        .post('/api/token/sellTokens')
        .send(sellRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(buyResponse.status).toBe(200);
      expect(sellResponse.status).toBe(200);
      
      // Verificar operaciones de compra
      expect(mockMarketRepo.removeTokensFromMarket).toHaveBeenCalledWith('Café Premium', 100);
      expect(mockWalletRepo.addTokensToWallet).toHaveBeenCalledWith('user-123', 'Café Premium', 100);
      
      // Verificar operaciones de venta
      expect(mockWalletRepo.removeTokensFromWallet).toHaveBeenCalledWith('user-123', 'Café Premium', 50);
      expect(mockMarketRepo.addTokensToMarket).toHaveBeenCalledWith('user-123', 'Café Premium', 50);
    });

    it('should handle concurrent buy and sell requests', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Piña Golden',
        token_amount_transferred: 200,
        token_unit_price: 8.2,
        platform_comition: 1.0,
        buyer_id: 'buyer-concurrent',
        seller_id: 'seller-concurrent'
      };

      const sellRequest = {
        seller_id: 'seller-concurrent',
        token_name: 'Café Premium',
        amount: 100
      };

      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockResolvedValue(true);
      mockWalletRepo.removeTokensFromWallet.mockResolvedValue(true);
      mockMarketRepo.addTokensToMarket.mockResolvedValue(true);
      mockTransactionService.createTransaction.mockResolvedValue('transaction-concurrent');

      // Act - Ejecutar requests simultáneos
      const [buyResponse, sellResponse] = await Promise.all([
        request(app)
          .post('/api/token/buyTokens')
          .send(buyRequest)
          .set('Accept', 'application/json'),
        request(app)
          .post('/api/token/sellTokens')
          .send(sellRequest)
          .set('Accept', 'application/json')
      ]);

      // Assert
      expect(buyResponse.status).toBe(200);
      expect(sellResponse.status).toBe(200);
      expect(buyResponse.body).toBe(true);
      expect(sellResponse.body).toBe(true);
    });

    it('should maintain data consistency when operations fail', async () => {
      // Arrange - Compra que falla al agregar tokens al wallet
      const buyRequest = {
        token_name: 'Banano Orgánico',
        token_amount_transferred: 75,
        token_unit_price: 12.0,
        platform_comition: 2.0,
        buyer_id: 'buyer-fail',
        seller_id: 'seller-fail'
      };

      // Simular que la remoción del mercado funciona pero la adición al wallet falla
      mockMarketRepo.removeTokensFromMarket.mockResolvedValue(true);
      mockWalletRepo.addTokensToWallet.mockRejectedValue(new Error('Wallet service unavailable'));

      // Act
      const response = await request(app)
        .post('/api/token/buyTokens')
        .send(buyRequest)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
      
      // Verificar que no se creó la transacción
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
      
      // En un sistema real, aquí verificaríamos que se hizo rollback de la operación de mercado
      // Pero para este test, solo verificamos el flujo de error
    });
  });
});