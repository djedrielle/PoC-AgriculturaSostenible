import { Request, Response } from 'express';
import TransactionService from '../Services/transactionService';

class TransactionController {
    private transactionService = new TransactionService();

    async getRecentTransactions(req: Request, res: Response) {
        try {
            const userId = parseInt(req.body.user_id);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user_id' });
            }
            const transactions = await this.transactionService.getRecentTransactions(userId);
            return res.status(200).json(transactions);
        } catch (error) {
            console.error("Error fetching recent transactions:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new TransactionController();
