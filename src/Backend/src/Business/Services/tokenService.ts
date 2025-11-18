import { Token } from "../Models/token";

import { TokenRepositoryPostgres } from "../../Persistence/Repos/tokenRepository";
import { MarketRepositoryPostgres } from "../../Persistence/Repos/marketRepository";
import { WalletRepositoryPostgres } from "../../Persistence/Repos/walletRepository";

export class TokenService {

    tokenRepository = new TokenRepositoryPostgres();
    marketRepository = new MarketRepositoryPostgres();
    walletRepository = new WalletRepositoryPostgres();

    async createTokens(token: Token): Promise<string> {
        return await this.tokenRepository.createTokens(token);
    }

    buyTokens(buyer_id: string, token_name: string, amount: number): boolean {
        this.marketRepository.removeTokensFromMarket(token_name, amount);
        this.walletRepository.addTokensToWallet(buyer_id, token_name, amount);
        return true;
    }

    sellTokens(userId: string, amount: number): boolean {
        this.walletRepository.removeTokensFromWallet(userId, amount);
        this.marketRepository.addTokensToMarket(userId, amount);
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