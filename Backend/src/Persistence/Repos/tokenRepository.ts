import { Token } from '../../Business/Models/token';
import db from '../localSupabase';

export interface TokenRepository {
    createTokens(token: Token): Promise<string>;
    getAmountTokensOffMarket(token_id: string): Promise<number>;
}

export class TokenRepositoryPostgres implements TokenRepository {

    async createTokens(token: Token): Promise<string> {
        try {
            const result = await db.query(
                `INSERT INTO token
                    (token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id)
                    VALUES ($1,$2,$3,$4,$5,$6) RETURNING token_id`,
                [
                    token.token_name,
                    token.emition_date,
                    token.token_price_USD,
                    token.amount_tokens,
                    token.owner_id,
                    token.production_id
                ]
            );

            if (!result?.rows?.length) {
                throw new Error("Failed to create token");
            }
            console.log("Token created with ID:", result.rows[0].token_id);
            return result.rows[0].token_id as string;
        } catch (err) {
            throw err;
        }
    }

    async getAmountTokensOffMarket(token_id: string): Promise<number> {
        try {
            const result = await db.query(
                `SELECT amount_tokens FROM token WHERE token_id = $1`,
                [token_id]
            );
            return result.rows[0].amount_tokens as number;
        } catch (err) {
            throw err;
        }
    }

}
