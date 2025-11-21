// Define mocks BEFORE imports - buySellToken uses TokenService
const mockBuyTokens = jest.fn();
const mockSellTokens = jest.fn();

jest.mock('../src/Business/Services/tokenService', () => {
  const mockImpl = jest.fn().mockImplementation(() => ({
    buyTokens: mockBuyTokens,
    sellTokens: mockSellTokens
  }));
  return {
    __esModule: true,
    default: mockImpl,
    TokenService: mockImpl
  };
});

// Importar después de mockear
import request from 'supertest';
import { app } from '../src/index';

describe('Token Buy/Sell Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /token/buyTokens', () => {
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

      const mockTransactionId = 'transaction-789';
      mockBuyTokens.mockResolvedValue(`Transaction Success ID:${mockTransactionId}`);

      // Act
      const response = await request(app)
        .post('/token/buyTokens')
        .send(buyRequest);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(`Transaction Success ID:${mockTransactionId}`);
      expect(mockBuyTokens).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors when buying tokens', async () => {
      // Arrange
      const buyRequest = {
        token_name: 'Banano Orgánico',
        token_amount_transferred: 75,
        token_unit_price: 12.0,
        platform_comition: 2.0,
        buyer_id: 'buyer-111',
        seller_id: 'seller-222'
      };

      mockBuyTokens.mockRejectedValue(new Error('Transaction failed'));

      // Act
      const response = await request(app)
        .post('/token/buyTokens')
        .send(buyRequest);

      // Assert
      expect(response.status).toBe(500);
    });
  });

  describe('POST /token/sellTokens', () => {
    it('should successfully process token sale', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-123',
        token_name: 'Café Premium',
        amount: 50,
        token_unit_price: 10
      };

      mockSellTokens.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .post('/token/sellTokens')
        .send(sellRequest);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
      expect(mockSellTokens).toHaveBeenCalledWith(
        sellRequest.seller_id,
        sellRequest.token_name,
        sellRequest.amount,
        sellRequest.token_unit_price
      );
    });

    it('should handle database errors when selling tokens', async () => {
      // Arrange
      const sellRequest = {
        seller_id: 'seller-789',
        token_name: 'Banano Orgánico',
        amount: 30,
        token_unit_price: 12
      };

      mockSellTokens.mockRejectedValue(new Error('Sale failed'));

      // Act
      const response = await request(app)
        .post('/token/sellTokens')
        .send(sellRequest);

      // Assert
      expect(response.status).toBe(500);
    });
  });
});
