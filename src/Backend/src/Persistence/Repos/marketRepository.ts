import { Market } from '../../Business/Models/market';
import { Token } from '../../Business/Models/token';

export interface MarketRepository {
    publishOnMarket(token: Token): Promise<string>;
}

export class MarketRepositoryPostgres implements MarketRepository {
    async publishOnMarket(token: Token): Promise<string> {
        try {
            const result = await db.query(
                `INSERT INTO market (token_name, current_token_price_USD, amount_tokens_on_market, initial_token_price, owner_id)
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    token.token_name,
                    token.token_price_USD,
                    token.amount_tokens,
                    token.owner_id
                ]
            );

            if (!result?.rows?.length) {
                throw new Error("Failed to create market record");
            }
            // Hay que analizar que hay que devovler. Me parece que nada
            return result.rows[0].market_id as string;
        } catch (err) {
            throw err;
        }
    }

    async getMarketTokensByTokenId(token_id: string): Promise<number> {
        try {
            const result = await db.query(
                `SELECT amount_tokens_on_market FROM market WHERE token_id = $1`,
                [token_id]
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

}
