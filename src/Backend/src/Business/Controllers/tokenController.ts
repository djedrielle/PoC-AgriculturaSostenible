import { Request, Response } from 'express';
import TokenService from '../Services/tokenService';

export class TokenController {
    tokenService = new TokenService();

    async buyTokens(req: Request, res: Response): Promise<void> {
        const { buyer_id, token_name, amount } = req.body;
        const result = await this.tokenService.buyTokens(buyer_id, token_name, amount);
        res.status(200).json(result);
    }
}

export default new TokenController();