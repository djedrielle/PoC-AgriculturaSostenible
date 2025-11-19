import { Request, Response } from 'express';

import AnalyticsService from '../Services/analyticsService';

export class AnalyticsController {

    analyticsService = new AnalyticsService();
    
    async getTokenAnalytics(req: Request, res: Response) {
        const token_analytics = await this.analyticsService.getFullAnalytics(req.body.token_id, req.body.lastTokenPrice);
        return res.status(200).json(token_analytics);
    }

}

export default new AnalyticsController();