import { Router, Request, Response } from 'express';

export const router = Router();

router.post('/affiliate', affiliateToInstitution);

router.get('/getCertificateHistory', getCertificateHistory);

router.post('/requestCertificate', requestCertificate);

