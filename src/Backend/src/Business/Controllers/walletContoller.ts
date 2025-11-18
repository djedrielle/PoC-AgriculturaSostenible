import { Request, Response } from 'express';

import { WalletService } from '../Services/walletService';

export class WalletController {

    walletService = new WalletService();
    
    async getTokensOnWallet(req: Request, res: Response) {
        return this.walletService.getUserTokens(req.body.user_id);
    }

}

export default new WalletController();