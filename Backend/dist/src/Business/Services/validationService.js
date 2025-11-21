"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const validationRepository_1 = require("../../Persistence/Repos/validationRepository");
class ValidationService {
    constructor() {
        this.validationCertificateRepo = new validationRepository_1.ValidationCertificateRepositoryPostgres();
    }
    async getCertificateInfo(user_id) {
        // Este metodo puede ser modificado para que devuelva unicamente la informacion relevante
        return this.validationCertificateRepo.getValidationInfoById(user_id);
    }
    async affiliateToInstitution(user_id, institution_id) {
        await this.validationCertificateRepo.affiliateToInstitution(user_id, institution_id);
        return "Usuario afiliado a la institución con éxito";
    }
    async requestValidationCertificate(user_id, institution_id) {
        // La institucion se pone en contacto con el usuario para acordar una cita de validacion
        return 'Cita de validación solicitada con éxito';
    }
}
exports.ValidationService = ValidationService;
