import { Token } from "../Models/token";
import { TokenRepositoryPostgres } from "../../Persistence/Repos/tokenRepository";

export class TokenService {

    tokenRepository = new TokenRepositoryPostgres();

    async createTokens(token: Token): Promise<string> {
        return await this.tokenRepository.createTokens(token);
    }

    buyTokens(userId: string, amount: number): boolean {
        if (amount <= 0) return false;
        const current = this.balances.get(userId) || 0;
        this.balances.set(userId, current + amount);
        return true;
    }

    sellTokens(userId: string, amount: number): boolean {
        if (amount <= 0) return false;
        const current = this.balances.get(userId) || 0;
        if (current < amount) return false;
        this.balances.set(userId, current - amount);
        return true;
    }

    async getAmountTokensOffMarket(token_id: string): Promise<number> {
        return this.tokenRepository.getAmountTokensOffMarket(token_id);
    }
}

export default TokenService;