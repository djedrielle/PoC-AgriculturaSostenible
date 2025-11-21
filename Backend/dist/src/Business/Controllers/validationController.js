"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationController = void 0;
const validationService_1 = require("../Services/validationService");
class ValidationController {
    constructor() {
        this.validationService = new validationService_1.ValidationService();
    }
    async getCertificateInfo(req, res) {
        try {
            const certificateInfo = await this.validationService.getCertificateInfo(req.body.user_id);
            return res.status(200).json(certificateInfo);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async affiliateToInstitution(req, res) {
        try {
            const result = await this.validationService.affiliateToInstitution(req.body.user_id, req.body.institution_id);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async requestValidationCertificate(req, res) {
        try {
            const result = await this.validationService.requestValidationCertificate(req.body.user_id, req.body.institution_id);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.ValidationController = ValidationController;
exports.default = new ValidationController();
