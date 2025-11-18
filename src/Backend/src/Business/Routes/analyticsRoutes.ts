import { Router } from 'express';

import ProductionController from '../Controllers/productionController';
import AnalyticsController from '../Controllers/analyticsController';

export const router = Router();

router.get('/tokenAnalytics', AnalyticsController.getTokenAnalytics.bind(AnalyticsController));

router.get('/getProductionHistory', ProductionController.getProductionHistory.bind(ProductionController));