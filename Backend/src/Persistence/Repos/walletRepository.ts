import { Token } from '../../Business/Models/token';
import db from '../localSupabase';

export interface WalletRepository {
    getUserTokens(user_id: string): Promise<Token[]>;
    addTokensToWallet(user_id: string, token_name: string, amount: number, token_unit_price: number): Promise<boolean>;
    removeTokensFromWallet(user_id: string, token_name: string, amount: number): Promise<boolean>;
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

    async addTokensToWallet(buyer_id: string, token_name: string, amount: number, token_unit_price: number): Promise<boolean> {
        try {
            // 1. Verificar si el usuario ya tiene ese token en la wallet
            const exists = await db.query(
                `SELECT 1 
                FROM wallet 
                WHERE wallet_owner_id = $1 AND token_name = $2`,
                [buyer_id, token_name]
            );

            console.log("Checked if token exists in wallet:", exists.rowCount);

            if ((exists.rowCount || 0) > 0) {
                // 2. Si existe, sumar la cantidad de tokens
                await db.query(
                    `UPDATE wallet 
                    SET amount_tokens_on_wallet = amount_tokens_on_wallet + $1,
                        token_price_usd = $4
                    WHERE wallet_owner_id = $2 AND token_name = $3`,
                    [amount, buyer_id, token_name, token_unit_price]
                );

                return true;
            }

            // 3. Si no existe, insertar un nuevo registro tomando production_id desde Token
            const insertResult = await db.query(
                `INSERT INTO wallet (
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
                RETURNING token_name`,
                [amount, buyer_id, token_name, token_unit_price]
            );

            if ((insertResult.rowCount || 0) === 0) {
                throw new Error('Token no encontrado en la tabla token');
            }
            console.log("Inserted new token into wallet:", insertResult.rows[0].token_name);
            return true;

        } catch (err) {
            throw err;
        }
    }


    async removeTokensFromWallet(user_id: string, token_name: string, amount: number): Promise<boolean> {
        try {
            const result = await db.query(
                `UPDATE wallet SET amount_tokens_on_wallet = amount_tokens_on_wallet - $1 WHERE wallet_owner_id = $2 AND token_name = $3`,
                [amount, user_id, token_name]
            );
            console.log("Tokens removed from wallet:", result.rowCount);
            return true;
        } catch (err) {
            throw err;
        }
    }
}
