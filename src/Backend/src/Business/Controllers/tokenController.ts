import { Request, Response } from 'express';
import TokenService from '../Services/tokenService';
import { Transaction } from '../Models/transaction';

export class TokenController {
    tokenService = new TokenService();

    async buyTokens(req: Request, res: Response): Promise<void> {
        const transaction = new Transaction(
            req.body.token_name,
            req.body.token_amount_transferred,
            req.body.token_unit_price,
            req.body.platform_comition,
            req.body.buyer_id,
            req.body.seller_id
        );
        const result = await this.tokenService.buyTokens(transaction);
        res.status(200).json(result);
    }

    async sellTokens(req: Request, res: Response): Promise<void> {
        const { seller_id, token_name, amount } = req.body;
        const result = await this.tokenService.sellTokens(seller_id, token_name, amount);
        res.status(200).json(result);
    }
}

export default new TokenController();