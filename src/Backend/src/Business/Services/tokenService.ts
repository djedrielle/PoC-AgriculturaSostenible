import { Token } from "../Models/token";
import { Transaction } from "../Models/transaction";

import { TokenRepositoryPostgres } from "../../Persistence/Repos/tokenRepository";
import { MarketRepositoryPostgres } from "../../Persistence/Repos/marketRepository";
import { WalletRepositoryPostgres } from "../../Persistence/Repos/walletRepository";

import TransactionService from "./transactionService";

export class TokenService {

    tokenRepository = new TokenRepositoryPostgres();
    marketRepository = new MarketRepositoryPostgres();
    walletRepository = new WalletRepositoryPostgres();

    transactionService = new TransactionService();

    async createTokens(token: Token): Promise<string> {
        return await this.tokenRepository.createTokens(token);
    }

    buyTokens(transaction: Transaction): boolean {
        this.marketRepository.removeTokensFromMarket(transaction.token_name, transaction.token_amount_transferred);
        this.walletRepository.addTokensToWallet(transaction.buyer_id, transaction.token_name, transaction.token_amount_transferred);
        this.transactionService.createTransaction(transaction);
        return true;
    }

    sellTokens(userId: string, token_name: string, amount: number): boolean {
        this.walletRepository.removeTokensFromWallet(userId, token_name, amount);
        this.marketRepository.addTokensToMarket(userId, token_name, amount);
        return true;
    }

    async removeSellerTokensFromMarket(seller_id: string, amount: number): Promise<boolean> {
        return this.marketRepository.removeTokensFromMarket(seller_id, amount);
    }

    async getAmountTokensOffMarket(token_id: string): Promise<number> {
        return this.tokenRepository.getAmountTokensOffMarket(token_id);
    }
}

export default TokenService;