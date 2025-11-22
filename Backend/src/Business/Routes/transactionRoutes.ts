import { Router } from 'express';
import TransactionController from '../Controllers/transactionController';

const router = Router();

router.post('/recent', TransactionController.getRecentTransactions.bind(TransactionController));

export default router;
