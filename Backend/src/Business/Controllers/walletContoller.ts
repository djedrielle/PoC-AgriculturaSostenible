import { Request, Response } from 'express';
import { WalletService } from '../Services/walletService';

export class WalletController {

    walletService = new WalletService();

    async getTokensOnWallet(req: Request, res: Response) {
        try {
            console.log('WalletController:', req.body);
            const tokens = await this.walletService.getUserTokens(req.body.user_id);
            return res.status(200).json(tokens);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

export default new WalletController();