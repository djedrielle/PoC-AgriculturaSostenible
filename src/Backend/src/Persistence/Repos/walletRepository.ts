import { Token } from '../../Business/Models/token';

export interface WalletRepository {
    getUserTokens(user_id: string): Promise<Token[]>;
    addTokensToWallet(user_id: string, token_name: string, amount: number): Promise<boolean>;
    removeTokensFromWallet(user_id: string, amount: number): Promise<boolean>;
}

export class WalletRepositoryPostgres implements WalletRepository {

    async getUserTokens(user_id: string): Promise<Token[]> {
        try {
            const result = await db.query(
                `SELECT * FROM wallet WHERE user_id = $1`,
                [user_id]
            );
            return result.rows as Token[];
        } catch (err) {
            throw err;
        }
    }

    async addTokensToWallet(user_id: string, token_name: string, amount: number): Promise<boolean> {
        try {
            const result = await db.query(
                `UPDATE wallet SET amount_tokens = amount_tokens + $1 WHERE user_id = $2 AND token_name = $3`,
                [amount, user_id, token_name]
            );
            return result.rowCount > 0;
        } catch (err) {
            throw err;
        }
    }

    async removeTokensFromWallet(user_id: string, amount: number): Promise<boolean> {
        try {
            const result = await db.query(
                `UPDATE wallet SET amount_tokens = amount_tokens - $1 WHERE user_id = $2`,
                [amount, user_id]
            );
            return result.rowCount > 0;
        } catch (err) {
            throw err;
        }
    }
}
