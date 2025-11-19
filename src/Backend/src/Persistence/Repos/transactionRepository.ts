import { Transaction } from '../../Business/Models/transaction';

export interface TransactionRepository {
    createTransaction(transaction: Transaction): Promise<string>;
    getTransactionPriceAndDateByTokenId(tokenId: string): Promise<{ price: number; date: string } | null>;
}

export class TransactionRepositoryPostgres implements TransactionRepository {

    async createTransaction(transaction: Transaction): Promise<string> {
        try {
            const result = await db.query(
                `INSERT INTO transaction (transaction_id, transaction_hash, token_name, token_amount_transferred, token_unit_price, platform_comition, transaction_date, buyer_id, seller_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING transaction_id`,
                [
                    transaction.transaction_id,
                    transaction.transaction_hash,
                    transaction.token_name,
                    transaction.token_amount_transferred,
                    transaction.token_unit_price,
                    transaction.platform_comition,
                    transaction.transaction_date,
                    transaction.buyer_id,
                    transaction.seller_id
                ]
            );

            if (!result?.rows?.length) {
                throw new Error("Failed to create transaction");
            }
            // Hay que definir que queremos devolver
            return result.rows[0].transaction_id as string;
        } catch (err) {
            throw err;
        }
    }

    async getTransactionPriceAndDateByTokenId(tokenId: string): Promise<{ price: number; date: string } | null> {
        try {
            const result = await db.query(
                `SELECT token_unit_price, transaction_date 
                FROM transaction 
                WHERE token_id = $1 
                ORDER BY transaction_date DESC 
                LIMIT 1`,
                [tokenId]
            );
            if (result.rows.length === 0) {
                return null;
            }
            return {
                price: result.rows[0].token_unit_price,
                date: result.rows[0].transaction_date
            };
        } catch (err) {
            throw err;
        }
    }

}
