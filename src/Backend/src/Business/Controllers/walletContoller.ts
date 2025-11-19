import { Request, Response } from 'express';

import { WalletService } from '../Services/walletService';

export class WalletController {

    walletService = new WalletService();
    
    async getTokensOnWallet(req: Request, res: Response) {
        const tokens = await this.walletService.getUserTokens(req.body.user_id);
        return res.status(200).json(tokens);
    }

}

export default new WalletController();