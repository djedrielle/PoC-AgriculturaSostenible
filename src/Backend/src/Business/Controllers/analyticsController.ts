import { Request, Response } from 'express';

import AnalyticsService from '../Services/analyticsService';

export class AnalyticsController {

    analyticsService = new AnalyticsService();
    
    async getTokenAnalytics(req: Request, res: Response) {
        return this.analyticsService.getFullAnalytics(req.body.token_id, req.body.lastTokenPrice);
    }

}

export default new AnalyticsController();