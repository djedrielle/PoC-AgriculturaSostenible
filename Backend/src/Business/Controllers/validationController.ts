import { Request, Response } from 'express';
import { ValidationService } from '../Services/validationService';

export class ValidationController {

    validationService = new ValidationService();

    async getCertificateInfo(req: Request, res: Response) {
        try {
            const certificateInfo = await this.validationService.getCertificateInfo(req.body.user_id);
            return res.status(200).json(certificateInfo);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async affiliateToInstitution(req: Request, res: Response) {
        try {
            const result = await this.validationService.affiliateToInstitution(req.body.user_id, req.body.institution_id);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async requestValidationCertificate(req: Request, res: Response) {
        try {
            const result = await this.validationService.requestValidationCertificate(req.body.user_id, req.body.institution_id);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

export default new ValidationController();