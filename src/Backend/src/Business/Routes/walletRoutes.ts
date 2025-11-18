import { Router, Request, Response } from 'express';
import walletController from '../Controllers/walletContoller';

export const router = Router();

router.get('/walletTokens', walletController.getTokensOnWallet.bind(walletController));