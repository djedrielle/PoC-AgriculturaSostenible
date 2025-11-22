import { TransactionRepositoryPostgres } from '../../Persistence/Repos/transactionRepository';
import { Transaction } from '../Models/transaction';

class TransactionService {

    transactionRepo = new TransactionRepositoryPostgres();

    async getLastTransactionPriceAndDate(token_id: string): Promise<{ price: number; date: string } | null> {
        return this.transactionRepo.getTransactionPriceAndDateByTokenId(token_id);
    }

    async createTransaction(transaction: Transaction): Promise<string> {
        return this.transactionRepo.createTransaction(transaction);
    }

    async getRecentTransactions(userId: number): Promise<Transaction[]> {
        return this.transactionRepo.getRecentTransactions(userId);
    }
}

export default TransactionService;