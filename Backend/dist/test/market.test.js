"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Define mocks BEFORE imports
const mockGetAllTokensOnMarket = jest.fn();
// Mock del repositorio MarketRepositoryPostgres
jest.mock('../src/Persistence/Repos/marketRepository', () => ({
    MarketRepositoryPostgres: jest.fn().mockImplementation(() => ({
        getAllTokensOnMarket: mockGetAllTokensOnMarket
    }))
}));
// Importar después de mockear
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
describe('Market Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /market', () => {
        it('should return all tokens on market successfully', async () => {
            // Arrange
            const mockTokens = [
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
                }
            ];
            mockGetAllTokensOnMarket.mockResolvedValue(mockTokens);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/market')
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            // Verify response body matches mockTokens but without functions
            const expectedBody = mockTokens.map(token => {
                const { unidad, ...rest } = token;
                return rest;
            });
            expect(response.body).toEqual(expectedBody);
            expect(mockGetAllTokensOnMarket).toHaveBeenCalledTimes(1);
        });
        it('should return empty array when no tokens on market', async () => {
            // Arrange
            mockGetAllTokensOnMarket.mockResolvedValue([]);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/market')
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
            expect(mockGetAllTokensOnMarket).toHaveBeenCalledTimes(1);
        });
        it('should handle database errors gracefully', async () => {
            // Arrange
            mockGetAllTokensOnMarket.mockRejectedValue(new Error('Database connection failed'));
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/market')
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(500);
            expect(mockGetAllTokensOnMarket).toHaveBeenCalledTimes(1);
        });
    });
});
