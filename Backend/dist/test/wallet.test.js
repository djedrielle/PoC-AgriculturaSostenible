"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Define mocks BEFORE imports
const mockGetUserTokens = jest.fn();
// Mock de los servicios
jest.mock('../src/Business/Services/walletService', () => ({
    WalletService: jest.fn().mockImplementation(() => ({
        getUserTokens: mockGetUserTokens
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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
describe('Wallet Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /wallet/walletTokens', () => {
        it('should return user tokens successfully', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-123'
            };
            const mockTokens = [
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
                }
            ];
            mockGetUserTokens.mockResolvedValue(mockTokens);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/wallet/walletTokens')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(200);
            // Verify response body matches mockTokens but without functions (JSON serialization)
            const expectedBody = mockTokens.map(token => {
                const { unidad, ...rest } = token;
                return rest;
            });
            expect(response.body).toEqual(expectedBody);
            expect(mockGetUserTokens).toHaveBeenCalledWith('user-123');
            expect(response.body).toHaveLength(2);
        });
        it('should return empty array when user has no tokens', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-no-tokens'
            };
            mockGetUserTokens.mockResolvedValue([]);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/wallet/walletTokens')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
            expect(mockGetUserTokens).toHaveBeenCalledWith('user-no-tokens');
        });
        it('should handle database errors gracefully', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-456'
            };
            mockGetUserTokens.mockRejectedValue(new Error('Database connection failed'));
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/wallet/walletTokens')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(500);
            expect(mockGetUserTokens).toHaveBeenCalledWith('user-456');
        });
    });
});
