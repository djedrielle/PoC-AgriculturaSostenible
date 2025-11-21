"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketRepositoryPostgres = void 0;
const localSupabase_1 = __importDefault(require("../localSupabase"));
class MarketRepositoryPostgres {
    async publishOnMarket(token) {
        try {
            const result = await localSupabase_1.default.query(`INSERT INTO market (token_name, current_token_price_usd, amount_tokens_on_market, token_owner_id)
                VALUES ($1, $2, $3, $4) RETURNING market_id`, [
                token.token_name,
                token.token_price_USD,
                token.amount_tokens,
                token.owner_id
            ]);
            if (!result?.rows?.length) {
                throw new Error("Failed to create market record");
            }
            console.log("Market record created:", result.rows[0]);
            return result.rows[0].market_id;
        }
        catch (err) {
            throw err;
        }
    }
    async getMarketTokensByTokenId(token_id) {
        try {
            const result = await localSupabase_1.default.query(`SELECT amount_tokens_on_market FROM market WHERE token_id = $1`, [token_id]);
            return result.rows[0]?.amount_tokens_on_market || 0;
        }
        catch (err) {
            throw err;
        }
    }
    async getAllTokensOnMarket() {
        try {
            const result = await localSupabase_1.default.query(`SELECT * FROM market`);
            return result.rows;
        }
        catch (err) {
            throw err;
        }
    }
    async removeTokensFromMarket(token_name, amount) {
        try {
            const result = await localSupabase_1.default.query(`UPDATE market SET amount_tokens_on_market = amount_tokens_on_market - $1 WHERE token_name = $2`, [amount, token_name]);
            console.log("Tokens removed from market:", result.rowCount);
            return true;
        }
        catch (err) {
            throw err;
        }
    }
    async addTokensToMarket(user_id, token_name, amount, token_unit_price) {
        try {
            const checkResult = await localSupabase_1.default.query(`SELECT * FROM market WHERE token_owner_id = $1 AND token_name = $2`, [user_id, token_name]);
            if (checkResult.rows.length > 0) {
                await localSupabase_1.default.query(`UPDATE market SET amount_tokens_on_market = amount_tokens_on_market + $1, current_token_price_usd = $2 WHERE token_owner_id = $3 AND token_name = $4`, [amount, token_unit_price, user_id, token_name]);
                console.log("Existing tokens updated on market:", token_name, token_unit_price);
            }
            else {
                await localSupabase_1.default.query(`INSERT INTO market (token_name, amount_tokens_on_market, token_owner_id, current_token_price_usd) VALUES ($1, $2, $3, $4)`, [token_name, amount, user_id, token_unit_price]);
                console.log("New tokens added to market:", token_name, token_unit_price);
            }
            return true;
        }
        catch (err) {
            throw err;
        }
    }
    async removeTokensOnMarketBySellerId(seller_id, amount) {
        try {
            const result = await localSupabase_1.default.query(`UPDATE market SET amount_tokens_on_market = amount_tokens_on_market - $1 WHERE owner_id = $2`, [amount, seller_id]);
            return true;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.MarketRepositoryPostgres = MarketRepositoryPostgres;
