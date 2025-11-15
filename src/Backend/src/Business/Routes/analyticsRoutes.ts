import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/tokenMetricsInfo', gettokenMetricsInfo);