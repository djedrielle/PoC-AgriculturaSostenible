import { randomBytes } from "crypto";
import { Token } from "../Models/Token";

export class TokenService {
    private store: Map<string, Token> = new Map();
    private balances: Map<string, number> = new Map(); // userId -> token balance

    createToken(userId: string, ttlSeconds?: number): string {
        const raw = randomBytes(32);
        const token = raw.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        const now = Date.now();
        const expiresAt = ttlSeconds && ttlSeconds > 0 ? now + ttlSeconds * 1000 : null;

        const record: Token = {
            token,
            userId,
            createdAt: now,
            expiresAt,
            revoked: false,
        };

        this.store.set(token, record);
        return token;
    }

    getTokenInfo(token: string): Token | null {
        return this.store.get(token) || null;
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

    getBalance(userId: string): number {
        return this.balances.get(userId) || 0;
    }
}
