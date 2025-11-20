import request from 'supertest';
import express from 'express';
import { router as validationRouter } from '../src/Business/Routes/processValidationRoutes';

// Mock de los repositorios y servicios
jest.mock('../src/Persistence/Repos/validationRepository', () => ({
  ValidationCertificateRepositoryPostgres: jest.fn().mockImplementation(() => ({
    getValidationInfoById: jest.fn(),
    affiliateToInstitution: jest.fn()
  }))
}));

jest.mock('../src/Business/Services/validationService', () => ({
  ValidationService: jest.fn().mockImplementation(() => ({
    getCertificateInfo: jest.fn(),
    affiliateToInstitution: jest.fn(),
    requestValidationCertificate: jest.fn()
  }))
}));

// Importar después de mockear
import { ValidationCertificateRepositoryPostgres } from '../src/Persistence/Repos/validationRepository';
import { ValidationService } from '../src/Business/Services/validationService';

const app = express();
app.use(express.json());
app.use('/api/validation', validationRouter);

describe('Validation Endpoints', () => {
  let mockValidationRepo: any;
  let mockValidationService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockValidationRepo = new ValidationCertificateRepositoryPostgres();
    mockValidationService = new ValidationService();
  });

  describe('POST /api/validation/certificateInfo', () => {
    it('should return certificate info for valid user_id', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123'
      };

      const mockCertificateInfo = 'Certificate ID: cert-123, State: active, Emition Date: 2023-01-01, Expiration Date: 2024-01-01, Document URL: https://example.com/cert.pdf';

      mockValidationService.getCertificateInfo.mockResolvedValue(mockCertificateInfo);

      // Act
      const response = await request(app)
        .post('/api/validation/certificateInfo')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(mockCertificateInfo);
      expect(mockValidationService.getCertificateInfo).toHaveBeenCalledWith('user-123');
    });

    it('should return message when no certificate found for user', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-no-certificate'
      };

      const noCertificateMessage = 'No validation certificate found for this user.';
      mockValidationService.getCertificateInfo.mockResolvedValue(noCertificateMessage);

      // Act
      const response = await request(app)
        .post('/api/validation/certificateInfo')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(noCertificateMessage);
      expect(mockValidationService.getCertificateInfo).toHaveBeenCalledWith('user-no-certificate');
    });

    it('should handle database errors when fetching certificate info', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-456'
      };

      mockValidationService.getCertificateInfo.mockRejectedValue(new Error('Database connection failed'));

      // Act
      const response = await request(app)
        .post('/api/validation/certificateInfo')
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
        .post('/api/validation/certificateInfo')
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
        .post('/api/validation/certificateInfo')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/validation/affiliate', () => {
    it('should successfully affiliate user to institution', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123',
        institution_id: 'institution-456'
      };

      const successMessage = 'Usuario afiliado a la institución con éxito';
      mockValidationService.affiliateToInstitution.mockResolvedValue(successMessage);

      // Act
      const response = await request(app)
        .post('/api/validation/affiliate')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(successMessage);
      expect(mockValidationService.affiliateToInstitution).toHaveBeenCalledWith('user-123', 'institution-456');
    });

    it('should handle database errors during affiliation', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-789',
        institution_id: 'institution-999'
      };

      mockValidationService.affiliateToInstitution.mockRejectedValue(new Error('Database insertion failed'));

      // Act
      const response = await request(app)
        .post('/api/validation/affiliate')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
    });

    it('should return 400 when user_id is missing', async () => {
      // Arrange
      const invalidRequestBody = {
        institution_id: 'institution-456'
        // user_id faltante
      };

      // Act
      const response = await request(app)
        .post('/api/validation/affiliate')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 400 when institution_id is missing', async () => {
      // Arrange
      const invalidRequestBody = {
        user_id: 'user-123'
        // institution_id faltante
      };

      // Act
      const response = await request(app)
        .post('/api/validation/affiliate')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle affiliation with long user and institution IDs', async () => {
      // Arrange
      const longUserId = 'u'.repeat(100);
      const longInstitutionId = 'i'.repeat(100);
      
      const requestBody = {
        user_id: longUserId,
        institution_id: longInstitutionId
      };

      const successMessage = 'Usuario afiliado a la institución con éxito';
      mockValidationService.affiliateToInstitution.mockResolvedValue(successMessage);

      // Act
      const response = await request(app)
        .post('/api/validation/affiliate')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(successMessage);
      expect(mockValidationService.affiliateToInstitution).toHaveBeenCalledWith(longUserId, longInstitutionId);
    });
  });

  describe('POST /api/validation/requestCertificate', () => {
    it('should successfully request validation certificate', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123',
        institution_id: 'institution-456'
      };

      const successMessage = 'Cita de validación solicitada con éxito';
      mockValidationService.requestValidationCertificate.mockResolvedValue(successMessage);

      // Act
      const response = await request(app)
        .post('/api/validation/requestCertificate')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(successMessage);
      expect(mockValidationService.requestValidationCertificate).toHaveBeenCalledWith('user-123', 'institution-456');
    });

    it('should handle service errors during certificate request', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-789',
        institution_id: 'institution-999'
      };

      mockValidationService.requestValidationCertificate.mockRejectedValue(new Error('Service unavailable'));

      // Act
      const response = await request(app)
        .post('/api/validation/requestCertificate')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(500);
    });

    it('should return 400 when user_id is missing', async () => {
      // Arrange
      const invalidRequestBody = {
        institution_id: 'institution-456'
        // user_id faltante
      };

      // Act
      const response = await request(app)
        .post('/api/validation/requestCertificate')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 400 when institution_id is missing', async () => {
      // Arrange
      const invalidRequestBody = {
        user_id: 'user-123'
        // institution_id faltante
      };

      // Act
      const response = await request(app)
        .post('/api/validation/requestCertificate')
        .send(invalidRequestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle multiple certificate requests for same user', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-repeated',
        institution_id: 'institution-456'
      };

      const successMessage = 'Cita de validación solicitada con éxito';
      mockValidationService.requestValidationCertificate.mockResolvedValue(successMessage);

      // Act - Hacer múltiples requests
      const response1 = await request(app)
        .post('/api/validation/requestCertificate')
        .send(requestBody)
        .set('Accept', 'application/json');

      const response2 = await request(app)
        .post('/api/validation/requestCertificate')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body).toBe(successMessage);
      expect(response2.body).toBe(successMessage);
      expect(mockValidationService.requestValidationCertificate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cross-Endpoint Scenarios', () => {
    it('should handle complete validation workflow', async () => {
      // Arrange - Datos para el flujo completo
      const user_id = 'user-workflow';
      const institution_id = 'institution-workflow';

      // Mock responses para cada paso del flujo
      mockValidationService.affiliateToInstitution.mockResolvedValue('Usuario afiliado a la institución con éxito');
      mockValidationService.requestValidationCertificate.mockResolvedValue('Cita de validación solicitada con éxito');
      mockValidationService.getCertificateInfo.mockResolvedValue('Certificate ID: cert-workflow, State: pending, Emition Date: 2023-01-01, Expiration Date: 2024-01-01, Document URL: https://example.com/cert.pdf');

      // Act - Ejecutar flujo completo
      const affiliateResponse = await request(app)
        .post('/api/validation/affiliate')
        .send({ user_id, institution_id })
        .set('Accept', 'application/json');

      const requestCertResponse = await request(app)
        .post('/api/validation/requestCertificate')
        .send({ user_id, institution_id })
        .set('Accept', 'application/json');

      const certificateInfoResponse = await request(app)
        .post('/api/validation/certificateInfo')
        .send({ user_id })
        .set('Accept', 'application/json');

      // Assert
      expect(affiliateResponse.status).toBe(200);
      expect(requestCertResponse.status).toBe(200);
      expect(certificateInfoResponse.status).toBe(200);
      
      expect(affiliateResponse.body).toBe('Usuario afiliado a la institución con éxito');
      expect(requestCertResponse.body).toBe('Cita de validación solicitada con éxito');
      expect(certificateInfoResponse.body).toContain('Certificate ID: cert-workflow');
    });

    it('should handle concurrent requests to different endpoints', async () => {
      // Arrange
      const certificateInfoBody = { user_id: 'user-concurrent-1' };
      const affiliateBody = { user_id: 'user-concurrent-2', institution_id: 'institution-1' };
      const requestCertBody = { user_id: 'user-concurrent-3', institution_id: 'institution-2' };

      mockValidationService.getCertificateInfo.mockResolvedValue('Certificate info');
      mockValidationService.affiliateToInstitution.mockResolvedValue('Affiliation success');
      mockValidationService.requestValidationCertificate.mockResolvedValue('Certificate request success');

      // Act - Ejecutar requests simultáneos
      const [certResponse, affiliateResponse, requestCertResponse] = await Promise.all([
        request(app)
          .post('/api/validation/certificateInfo')
          .send(certificateInfoBody)
          .set('Accept', 'application/json'),
        request(app)
          .post('/api/validation/affiliate')
          .send(affiliateBody)
          .set('Accept', 'application/json'),
        request(app)
          .post('/api/validation/requestCertificate')
          .send(requestCertBody)
          .set('Accept', 'application/json')
      ]);

      // Assert
      expect(certResponse.status).toBe(200);
      expect(affiliateResponse.status).toBe(200);
      expect(requestCertResponse.status).toBe(200);
    });

    it('should maintain isolation when one endpoint fails', async () => {
      // Arrange
      const certificateInfoBody = { user_id: 'user-fail' };
      const affiliateBody = { user_id: 'user-fail', institution_id: 'institution-fail' };

      // Un endpoint funciona, el otro falla
      mockValidationService.getCertificateInfo.mockRejectedValue(new Error('Certificate service down'));
      mockValidationService.affiliateToInstitution.mockResolvedValue('Usuario afiliado a la institución con éxito');

      // Act
      const certResponse = await request(app)
        .post('/api/validation/certificateInfo')
        .send(certificateInfoBody)
        .set('Accept', 'application/json');

      const affiliateResponse = await request(app)
        .post('/api/validation/affiliate')
        .send(affiliateBody)
        .set('Accept', 'application/json');

      // Assert
      expect(certResponse.status).toBe(500);
      expect(affiliateResponse.status).toBe(200);
      expect(affiliateResponse.body).toBe('Usuario afiliado a la institución con éxito');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in user_id and institution_id', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-123_@special#',
        institution_id: 'institution-456_@special#'
      };

      mockValidationService.affiliateToInstitution.mockResolvedValue('Usuario afiliado a la institución con éxito');

      // Act
      const response = await request(app)
        .post('/api/validation/affiliate')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(mockValidationService.affiliateToInstitution).toHaveBeenCalledWith('user-123_@special#', 'institution-456_@special#');
    });

    it('should handle very long certificate info response', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-long-response'
      };

      const longCertificateInfo = 'A'.repeat(1000) + 'Certificate ID: ' + 'B'.repeat(100) + ', State: ' + 'C'.repeat(50);
      mockValidationService.getCertificateInfo.mockResolvedValue(longCertificateInfo);

      // Act
      const response = await request(app)
        .post('/api/validation/certificateInfo')
        .send(requestBody)
        .set('Accept', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBe(longCertificateInfo);
    });

    it('should handle rapid consecutive requests', async () => {
      // Arrange
      const requestBody = {
        user_id: 'user-rapid',
        institution_id: 'institution-rapid'
      };

      mockValidationService.requestValidationCertificate.mockResolvedValue('Cita de validación solicitada con éxito');

      // Act - Hacer 10 requests rápidos consecutivos
      const requests = Array.from({ length: 10 }, () =>
        request(app)
          .post('/api/validation/requestCertificate')
          .send(requestBody)
          .set('Accept', 'application/json')
      );

      const responses = await Promise.all(requests);

      // Assert
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBe('Cita de validación solicitada con éxito');
      });
      expect(mockValidationService.requestValidationCertificate).toHaveBeenCalledTimes(10);
    });
  });
});