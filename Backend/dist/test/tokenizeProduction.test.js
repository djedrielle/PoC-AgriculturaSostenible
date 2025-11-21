"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Define mocks BEFORE imports
const mockAddSmartContract = jest.fn();
const mockAddProduction = jest.fn();
const mockCreateTokens = jest.fn();
const mockPublishOnMarket = jest.fn();
jest.mock('../src/Business/Services/smartContractService', () => ({
    SmartContractService: jest.fn().mockImplementation(() => ({
        addSmartContract: mockAddSmartContract,
        publishOnMarket: mockPublishOnMarket
    }))
}));
jest.mock('../src/Business/Services/productionService', () => ({
    ProductionService: jest.fn().mockImplementation(() => ({
        addProduction: mockAddProduction
    }))
}));
jest.mock('../src/Business/Services/tokenService', () => {
    const mockImpl = jest.fn().mockImplementation(() => ({
        createTokens: mockCreateTokens
    }));
    return {
        __esModule: true,
        default: mockImpl,
        TokenService: mockImpl
    };
});
// Importar después de mockear
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
describe('Production Tokenization Endpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /token/tokenizeAsset', () => {
        it('should successfully tokenize production asset', async () => {
            // Arrange
            const tokenizeRequest = {
                smart_contract_data: {
                    contract_id: 'contract-123',
                    contract_address: '0x742d35Cc6634C0532925a3b8Doe456f7eF20d6',
                    standard_implemented: 'ERC-1155',
                    initial_token_price: 10.5,
                    total_tokens: 1000,
                    emition_date: '2023-01-01',
                    active: true,
                    contract_state: 'deployed'
                },
                production_data: {
                    location: 'Farm Location 1',
                    farmer_id: 'farmer-123',
                    crop_type: 'Coffee',
                    crop_variety: 'Arabica',
                    est_harvest_date: '2023-06-01',
                    amount: 5000,
                    measure_unit: 'kg',
                    biologic_features: 'Organic',
                    agro_conditions: 'High altitude',
                    agro_protocols: 'Sustainable farming',
                    active: true
                },
                token_data: {
                    type: 'cafe',
                    token_id: 'token-123',
                    token_name: 'Premium Coffee Tokens',
                    emition_date: '2023-01-01',
                    token_price_USD: 10.5,
                    amount_tokens: 1000,
                    on_market: true,
                    owner_id: 'farmer-123'
                }
            };
            // Mock responses
            mockAddSmartContract.mockResolvedValue('contract-123');
            mockAddProduction.mockResolvedValue('production-456');
            mockCreateTokens.mockResolvedValue('token-789');
            mockPublishOnMarket.mockResolvedValue(undefined);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/token/tokenizeAsset')
                .send(tokenizeRequest)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(201);
            expect(mockAddSmartContract).toHaveBeenCalled();
            expect(mockAddProduction).toHaveBeenCalled();
            expect(mockCreateTokens).toHaveBeenCalled();
        });
        it('should handle error in smart contract creation', async () => {
            // Arrange
            const tokenizeRequest = {
                smart_contract_data: {
                    contract_id: 'contract-err',
                    contract_address: '0x942d35Cc6634C0532925a3b8Doe456f7eF20d8',
                    standard_implemented: 'ERC-1155',
                    initial_token_price: 12.0,
                    total_tokens: 500,
                    emition_date: '2023-03-01',
                    active: true,
                    contract_state: 'deployed'
                },
                production_data: {
                    location: 'Farm Location 3',
                    farmer_id: 'farmer-789',
                    crop_type: 'Banana',
                    crop_variety: 'Cavendish',
                    est_harvest_date: '2023-08-01',
                    amount: 4000,
                    measure_unit: 'kg',
                    biologic_features: 'Conventional',
                    agro_conditions: 'Humid tropical',
                    agro_protocols: 'Standard protocols',
                    active: true
                },
                token_data: {
                    type: 'banano',
                    token_id: 'token-err',
                    token_name: 'Banana Export Tokens',
                    emition_date: '2023-03-01',
                    token_price_USD: 12.0,
                    amount_tokens: 500,
                    on_market: true,
                    owner_id: 'farmer-789'
                }
            };
            mockAddSmartContract.mockRejectedValue(new Error('Smart contract creation failed'));
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/token/tokenizeAsset')
                .send(tokenizeRequest)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(500);
            expect(mockAddProduction).not.toHaveBeenCalled();
            expect(mockCreateTokens).not.toHaveBeenCalled();
        });
    });
});
