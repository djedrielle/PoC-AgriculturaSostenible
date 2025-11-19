import { Token } from '../../Business/Models/token';
import db from '../localSupabase';

export interface MarketRepository {
    publishOnMarket(token: Token): Promise<string>;
    getMarketTokensByTokenId(token_id: string): Promise<number>;
    getAllTokensOnMarket(): Promise<Token[]>;
    removeTokensFromMarket(token_name: string, amount: number): Promise<boolean>;
    addTokensToMarket(user_id: string, token_name: string, amount: number): Promise<boolean>;
    removeTokensOnMarketBySellerId(seller_id: string, amount: number): Promise<boolean>;
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

    async getAllTokensOnMarket(): Promise<Token[]> {
        try {
            const result = await db.query(
                `SELECT * FROM market`
            );
            return result.rows as Token[];
        } catch (err) {
            throw err;
        }
    }

    async removeTokensFromMarket(token_name: string, amount: number): Promise<boolean> {
        try {
            const result = await db.query(
                `UPDATE market SET amount_tokens_on_market = amount_tokens_on_market - $1 WHERE token_name = $2`,
                [amount, token_name]
            );
            return result.rowCount > 0;
        } catch (err) {
            throw err;
        }
    }

    async addTokensToMarket(user_id: string, token_name: string, amount: number): Promise<boolean> {
        try {
            const result = await db.query(
                `UPDATE market SET amount_tokens_on_market = amount_tokens_on_market + $1 WHERE owner_id = $2 AND token_name = $3`,
                [amount, user_id, token_name]
            );
            return result.rowCount > 0;
        } catch (err) {
            throw err;
        }
    }

    async removeTokensOnMarketBySellerId(seller_id: string, amount: number): Promise<boolean> {
        try {
            const result = await db.query(
                `UPDATE market SET amount_tokens_on_market = amount_tokens_on_market - $1 WHERE owner_id = $2`,
                [amount, seller_id]
            );
            return result.rowCount > 0;
        } catch (err) {
            throw err;
        }
    }
}
