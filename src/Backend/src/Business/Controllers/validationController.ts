import { Request, Response } from 'express';

import { ValidationService } from '../Services/validationService';

export class ValidationController {

    validationService = new ValidationService();
    
    async requestValidationCertificate(req: Request, res: Response) {
        const result = await this.validationService.requestValidationCertificate(req.body.user_id, req.body.institution_id);
        return res.status(200).json(result);
    }
 
    async affiliateToInstitution(req: Request, res: Response) {
        const result = await this.validationService.affiliateToInstitution(req.body.user_id, req.body.institution_id);
        return res.status(200).json(result);
    }

    async getCertificateInfo(req: Request, res: Response) {
        const certificateInfo = await this.validationService.getCertificateInfo(req.body.user_id);
        return res.status(200).json(certificateInfo);
    }

}

export default new ValidationController();