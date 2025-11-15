// Estos endpoints se encargan de la tokenizacion de activos agricolas
import { Router, Request, Response } from 'express';

export const router = Router();

router.post('/tokenizeAsset', tokenizeProductionAsset);

router.post('/buyTokens', buyTokens);

router.post('/sellTokens', sellTokens);

router.get('/agroAssetsInfo', getAssetInfo);