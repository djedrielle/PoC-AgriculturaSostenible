import { Request, Response } from 'express';

import { ValidationService } from '../Services/validationService';

export class ValidationController {

    validationService = new ValidationService();
    
    async requestValidationCertificate(req: Request, res: Response) {
        return this.validationService.requestValidationCertificate(req.body.user_id, req.body.institution_id)
    }

    async affiliateToInstitution(req: Request, res: Response) {
        return this.validationService.affiliateToInstitution(req.body.user_id, req.body.institution_id);
    }

    async getCertificateInfo(req: Request, res: Response) {
        return this.validationService.getValidationInfo(req.body.user_id);
    }

}

export default new ValidationController();