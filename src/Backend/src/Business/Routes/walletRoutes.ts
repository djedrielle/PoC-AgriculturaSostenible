import { Router, Request, Response } from 'express';
import walletController from '../Controllers/walletContoller';

export const router = Router();

router.post('/walletTokens', walletController.getTokensOnWallet.bind(walletController));
// Receives body { user_id: string }