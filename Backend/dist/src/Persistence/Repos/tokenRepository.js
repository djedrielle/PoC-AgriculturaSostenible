"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepositoryPostgres = void 0;
const localSupabase_1 = __importDefault(require("../localSupabase"));
class TokenRepositoryPostgres {
    async createTokens(token) {
        try {
            const result = await localSupabase_1.default.query(`INSERT INTO token
                    (token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id)
                    VALUES ($1,$2,$3,$4,$5,$6) RETURNING token_id`, [
                token.token_name,
                token.emition_date,
                token.token_price_USD,
                token.amount_tokens,
                token.owner_id,
                token.production_id
            ]);
            if (!result?.rows?.length) {
                throw new Error("Failed to create token");
            }
            console.log("Token created with ID:", result.rows[0].token_id);
            return result.rows[0].token_id;
        }
        catch (err) {
            throw err;
        }
    }
    async getAmountTokensOffMarket(token_id) {
        try {
            const result = await localSupabase_1.default.query(`SELECT amount_tokens FROM token WHERE token_id = $1`, [token_id]);
            return result.rows[0].amount_tokens;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.TokenRepositoryPostgres = TokenRepositoryPostgres;
