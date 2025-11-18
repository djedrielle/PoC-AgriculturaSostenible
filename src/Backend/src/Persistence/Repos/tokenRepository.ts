import { Token } from '../../Business/Models/token';

export interface TokenRepository {
    createTokens(token: Token): Promise<string>;
}

export class TokenRepositoryPostgres implements TokenRepository {

    async createTokens(token: Token): Promise<string> {
        try {
            const result = await db.query(
                `INSERT INTO token
                    (token_name, emition_date, token_price_USD, amount_tokens, on_market, owner_id, production_id)
                    VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                [
                    token.token_name,
                    token.emition_date,
                    token.token_price_USD,
                    token.amount_tokens,
                    token.on_market,
                    token.owner_id,
                    token.production_id
                ]
            );

            if (!result?.rows?.length) {
                throw new Error("Failed to create token");
            }
            // Hay que definir que queremos devolver
            return result.rows[0].user_id as string;
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
            return result;
        } catch (err) {
            throw err;
        }
    }

}
