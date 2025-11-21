"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Define mocks BEFORE imports
const mockGetCertificateInfo = jest.fn();
const mockAffiliateToInstitution = jest.fn();
const mockRequestValidationCertificate = jest.fn();
// Mock de los servicios
jest.mock('../src/Business/Services/validationService', () => ({
    ValidationService: jest.fn().mockImplementation(() => ({
        getCertificateInfo: mockGetCertificateInfo,
        affiliateToInstitution: mockAffiliateToInstitution,
        requestValidationCertificate: mockRequestValidationCertificate
    }))
}));
// Importar después de mockear
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
describe('Validation Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /validation/certificateInfo', () => {
        it('should return certificate info for valid user_id', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-123'
            };
            const mockCertificateInfo = 'Certificate ID: cert-123, State: active';
            mockGetCertificateInfo.mockResolvedValue(mockCertificateInfo);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/validation/certificateInfo')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toBe(mockCertificateInfo);
            expect(mockGetCertificateInfo).toHaveBeenCalledWith('user-123');
        });
        it('should handle database errors when fetching certificate info', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-456'
            };
            mockGetCertificateInfo.mockRejectedValue(new Error('Database connection failed'));
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/validation/certificateInfo')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(500);
        });
    });
    describe('POST /validation/affiliate', () => {
        it('should successfully affiliate user to institution', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-123',
                institution_id: 'institution-456'
            };
            const successMessage = 'Usuario afiliado a la institución con éxito';
            mockAffiliateToInstitution.mockResolvedValue(successMessage);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/validation/affiliate')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toBe(successMessage);
            expect(mockAffiliateToInstitution).toHaveBeenCalledWith('user-123', 'institution-456');
        });
        it('should handle database errors during affiliation', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-789',
                institution_id: 'institution-999'
            };
            mockAffiliateToInstitution.mockRejectedValue(new Error('Database insertion failed'));
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/validation/affiliate')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(500);
        });
    });
    describe('POST /validation/requestCertificate', () => {
        it('should successfully request validation certificate', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-123',
                institution_id: 'institution-456'
            };
            const successMessage = 'Cita de validación solicitada con éxito';
            mockRequestValidationCertificate.mockResolvedValue(successMessage);
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/validation/requestCertificate')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toBe(successMessage);
            expect(mockRequestValidationCertificate).toHaveBeenCalledWith('user-123', 'institution-456');
        });
        it('should handle service errors during certificate request', async () => {
            // Arrange
            const requestBody = {
                user_id: 'user-789',
                institution_id: 'institution-999'
            };
            mockRequestValidationCertificate.mockRejectedValue(new Error('Service unavailable'));
            // Act
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/validation/requestCertificate')
                .send(requestBody)
                .set('Accept', 'application/json');
            // Assert
            expect(response.status).toBe(500);
        });
    });
});
