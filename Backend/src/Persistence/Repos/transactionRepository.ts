import { Transaction } from '../../Business/Models/transaction';
import db from '../localSupabase';

export interface TransactionRepository {
    createTransaction(transaction: Transaction): Promise<string>;
    getTransactionPriceAndDateByTokenId(tokenId: string): Promise<{ price: number; date: string } | null>;
    getRecentTransactions(userId: number): Promise<Transaction[]>;
}

export class TransactionRepositoryPostgres implements TransactionRepository {

    async createTransaction(transaction: Transaction): Promise<string> {
        try {
            const result = await db.query(
                `INSERT INTO transaction (transaction_hash, token_amount_transfered, token_unit_price, platform_commission_percentage, transaction_date, token_name, buyer_id, seller_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING transaction_id`,
                [
                    transaction.transaction_hash,
                    transaction.token_amount_transferred,
                    transaction.token_unit_price,
                    transaction.platform_comition,
                    transaction.transaction_date,
                    transaction.token_name,
                    transaction.buyer_id,
                    transaction.seller_id
                ]
            );

            if (!result?.rows?.length) {
                throw new Error("Failed to create transaction");
            }
            // Hay que definir que queremos devolver
            console.log("Transaction created with ID:", result.rows[0].transaction_id);
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

    async getRecentTransactions(userId: number): Promise<Transaction[]> {
        try {
            const result = await db.query(
                `SELECT * FROM transaction 
                WHERE buyer_id = $1 OR seller_id = $1 
                ORDER BY transaction_date DESC 
                LIMIT 2`,
                [userId]
            );
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

}
