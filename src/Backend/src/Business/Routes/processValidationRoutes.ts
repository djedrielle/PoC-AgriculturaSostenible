import { Router } from 'express';

import ValidationController from '../Controllers/validationController';

export const router = Router();

router.get('/certificateInfo', ValidationController.getCertificateInfo.bind(ValidationController));

router.post('/affiliate', ValidationController.affiliateToInstitution.bind(ValidationController));

router.post('/requestCertificate', ValidationController.requestValidationCertificate.bind(ValidationController));
