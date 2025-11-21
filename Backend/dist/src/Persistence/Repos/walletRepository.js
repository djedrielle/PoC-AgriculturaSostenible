"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepositoryPostgres = void 0;
const localSupabase_1 = __importDefault(require("../localSupabase"));
class WalletRepositoryPostgres {
    async getUserTokens(user_id) {
        try {
            const result = await localSupabase_1.default.query(`SELECT * FROM wallet WHERE user_id = $1`, [user_id]);
            return result.rows;
        }
        catch (err) {
            throw err;
        }
    }
    async addTokensToWallet(buyer_id, token_name, amount, token_unit_price) {
        try {
            // 1. Verificar si el usuario ya tiene ese token en la wallet
            const exists = await localSupabase_1.default.query(`SELECT 1 
                FROM wallet 
                WHERE wallet_owner_id = $1 AND token_name = $2`, [buyer_id, token_name]);
            console.log("Checked if token exists in wallet:", exists.rowCount);
            if ((exists.rowCount || 0) > 0) {
                // 2. Si existe, sumar la cantidad de tokens
                await localSupabase_1.default.query(`UPDATE wallet 
                    SET amount_tokens_on_wallet = amount_tokens_on_wallet + $1,
                        token_price_usd = $4
                    WHERE wallet_owner_id = $2 AND token_name = $3`, [amount, buyer_id, token_name, token_unit_price]);
                return true;
            }
            // 3. Si no existe, insertar un nuevo registro tomando production_id desde Token
            const insertResult = await localSupabase_1.default.query(`INSERT INTO wallet (
                    token_name, 
                    token_price_usd, 
                    amount_tokens_on_wallet, 
                    production_id, 
                    wallet_owner_id
                )
                SELECT 
                    $3::VARCHAR, 
                    $4, 
                    $1, 
                    t.production_id, 
                    $2::INTEGER
                FROM token t
                WHERE t.token_name = $3::VARCHAR
                RETURNING token_name`, [amount, buyer_id, token_name, token_unit_price]);
            if ((insertResult.rowCount || 0) === 0) {
                throw new Error('Token no encontrado en la tabla token');
            }
            console.log("Inserted new token into wallet:", insertResult.rows[0].token_name);
            return true;
        }
        catch (err) {
            throw err;
        }
    }
    async removeTokensFromWallet(user_id, token_name, amount) {
        try {
            const result = await localSupabase_1.default.query(`UPDATE wallet SET amount_tokens_on_wallet = amount_tokens_on_wallet - $1 WHERE wallet_owner_id = $2 AND token_name = $3`, [amount, user_id, token_name]);
            console.log("Tokens removed from wallet:", result.rowCount);
            return true;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.WalletRepositoryPostgres = WalletRepositoryPostgres;
