import { Router } from 'express';

import ValidationController from '../Controllers/validationController';

export const router = Router();

router.post('/certificateInfo', ValidationController.getCertificateInfo.bind(ValidationController));
// Receive body: { user_id: string }

router.post('/affiliate', ValidationController.affiliateToInstitution.bind(ValidationController));
// Receive body: { user_id: string, institution_id: string }

router.post('/requestCertificate', ValidationController.requestValidationCertificate.bind(ValidationController));
// Receive body: { user_id: string, institution_id: string }