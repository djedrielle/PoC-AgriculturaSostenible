import { Request, Response } from 'express';
import AnalyticsService from '../Services/analyticsService';

export class AnalyticsController {

    analyticsService = new AnalyticsService();

    async getTokenAnalytics(req: Request, res: Response) {
        try {
            const token_analytics = await this.analyticsService.getFullAnalytics(req.body.token_id, req.body.lastTokenPrice);
            return res.status(200).json(token_analytics);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

export default new AnalyticsController();