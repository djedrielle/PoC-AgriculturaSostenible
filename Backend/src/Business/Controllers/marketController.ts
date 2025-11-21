import { Request, Response } from 'express';
import MarketService from '../Services/marketService';

export class MarketController {

    marketService = new MarketService();

    async getAllTokensOnMarket(req: Request, res: Response) {
        try {
            const marketTokens = await this.marketService.getAllTokensOnMarket();
            return res.status(200).json(marketTokens);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

export default new MarketController();