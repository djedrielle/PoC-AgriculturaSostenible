import { Router, Request, Response } from 'express';

import ProductionController from '../Controllers/productionController';
import TokenController from '../Controllers/tokenController';
import { Token } from '../Models/token';

export const router = Router();

router.post('/tokenizeAsset', ProductionController.tokenizeProductionAsset.bind(ProductionController));

router.post('/buyTokens', TokenController.buyTokens.bind(TokenController));

router.post('/sellTokens', TokenController.sellTokens.bind(TokenController));