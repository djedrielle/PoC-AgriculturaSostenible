import TransactionRepositoryPostgres from '../../Persistence/Repos/transactionRepository';

class TransactionService {
    
    transactionRepo = new TransactionRepositoryPostgres();
    
    async getLastTransactionPriceAndDate(token_id: string): Promise<{ price: number; date: string } | null> {
        return this.transactionRepo.getTransactionPriceAndDateByTokenId(token_id);
    }
}

export default TransactionService;