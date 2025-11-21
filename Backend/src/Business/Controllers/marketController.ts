import { Request, Response } from 'express';

import MarketService from '../Services/marketService';

export class MarketController {

    marketService = new MarketService();
    
    async getAllTokensOnMarket(req: Request, res: Response) {
        const marketTokens = await this.marketService.getAllTokensOnMarket();
        return res.status(200).json(marketTokens);
    }

}

export default new MarketController();