"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactionRepository_1 = require("../../Persistence/Repos/transactionRepository");
class TransactionService {
    constructor() {
        this.transactionRepo = new transactionRepository_1.TransactionRepositoryPostgres();
    }
    async getLastTransactionPriceAndDate(token_id) {
        return this.transactionRepo.getTransactionPriceAndDateByTokenId(token_id);
    }
    async createTransaction(transaction) {
        return this.transactionRepo.createTransaction(transaction);
    }
}
exports.default = TransactionService;
