import { Router } from 'express';

import AnalyticsController from '../Controllers/analyticsController';
import ProductionController from '../Controllers/productionController';

export const router = Router();

router.get('/tokenAnalytics', AnalyticsController.getTokenAnalytics.bind(AnalyticsController));
// Receive body = { token_id: string, lastTokenPrice: number }

router.get('/getProductionHistory', ProductionController.getProductionHistory.bind(ProductionController));
// Receive body = { user_id: string }