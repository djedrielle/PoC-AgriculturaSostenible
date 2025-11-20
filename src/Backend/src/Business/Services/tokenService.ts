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

    async buyTokens(transaction: Transaction): Promise<string> {
        await this.marketRepository.removeTokensFromMarket(transaction.token_name, transaction.token_amount_transferred);
        await this.walletRepository.addTokensToWallet(transaction.buyer_id, transaction.token_name, transaction.token_amount_transferred, transaction.token_unit_price);
        const transactionId = await this.transactionService.createTransaction(transaction);
        return "Transaction Success ID:" + transactionId;
    }

    async sellTokens(userId: string, token_name: string, amount: number, token_unit_price: number): Promise<boolean> {
        await this.walletRepository.removeTokensFromWallet(userId, token_name, amount);
        await this.marketRepository.addTokensToMarket(userId, token_name, amount, token_unit_price);
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