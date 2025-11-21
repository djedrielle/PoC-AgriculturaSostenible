
// Define mocks before imports - must start with 'mock'
const mockBuyTokens = jest.fn();
const mockSellTokens = jest.fn();

jest.mock('../../src/Business/Services/tokenService', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => ({
            buyTokens: mockBuyTokens,
            sellTokens: mockSellTokens,
        })),
        TokenService: jest.fn()
    };
});

import request from 'supertest';
import { app } from '../../src/index';
import TokenService from '../../src/Business/Services/tokenService';

describe('Token Routes', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('POST /token/buyTokens', () => {
        it('should successfully buy tokens and return transaction ID', async () => {
            const mockTransactionId = '12345';
            mockBuyTokens.mockResolvedValue(`Transaction Success ID:${mockTransactionId}`);

            const payload = {
                token_name: 'AgroToken',
                token_amount_transferred: 100,
                token_unit_price: 10,
                platform_comition: 1,
                buyer_id: 'buyer-uuid',
                seller_id: 'seller-uuid'
            };

            const response = await request(app)
                .post('/token/buyTokens')
                .send(payload);

            expect(response.status).toBe(200);
            expect(response.body).toBe(`Transaction Success ID:${mockTransactionId}`);
            expect(mockBuyTokens).toHaveBeenCalledTimes(1);
        });

        it('should handle errors during buy tokens', async () => {
            mockBuyTokens.mockRejectedValue(new Error('Transaction failed'));

            const payload = {
                token_name: 'AgroToken',
                token_amount_transferred: 100,
                token_unit_price: 10,
                platform_comition: 1,
                buyer_id: 'buyer-uuid',
                seller_id: 'seller-uuid'
            };

            const response = await request(app)
                .post('/token/buyTokens')
                .send(payload);

            // Expect 500 because the controller doesn't catch errors
            expect(response.status).toBe(500);
        });
    });

    describe('POST /token/sellTokens', () => {
        it('should successfully sell tokens', async () => {
            mockSellTokens.mockResolvedValue(true);

            const payload = {
                seller_id: 'seller-uuid',
                token_name: 'AgroToken',
                amount: 50,
                token_unit_price: 12
            };

            const response = await request(app)
                .post('/token/sellTokens')
                .send(payload);

            expect(response.status).toBe(200);
            expect(response.body).toBe(true);
            expect(mockSellTokens).toHaveBeenCalledWith(
                payload.seller_id,
                payload.token_name,
                payload.amount,
                payload.token_unit_price
            );
        });
    });
});
