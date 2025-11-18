import { Request, Response } from 'express';

import MarketService from '../Services/marketService';

export class MarketController {

    marketService = new MarketService();
    
    async getAllTokensOnMarket(req: Request, res: Response) {
        return this.marketService.getAllTokensOnMarket();
    }

}

export default new MarketController();