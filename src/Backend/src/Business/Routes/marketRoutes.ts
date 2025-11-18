import { Router, Request, Response } from 'express';

import MarketController from '../Controllers/marketController';

export const router = Router();

router.get('/market', MarketController.getAllTokensOnMarket.bind(MarketController));