import { User } from '../../Business/Models/user';
import db from '../localSupabase';

export interface UserRepository {
    createUser(user: User): Promise<string>;
    getUserInfo(): Promise<any>;
    deleteUser(userId: string): Promise<void>;
}

export class UserRepositoryPostgres implements UserRepository {

  async createUser(user: User): Promise<string> {
    try {
        const result = await db.query(
            `INSERT INTO user
                (username, first_name, last_name, email, wallet_address, user_type, identification_number, active)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING user_id`,
            [
                user.username,
                user.first_name,
                user.last_name,
                user.email,
                user.wallet_address ?? null,
                user.user_type,
                user.identification_number ?? null,
                typeof user.active === "boolean" ? user.active : true,
            ]
        );

        if (!result?.rows?.length) {
            throw new Error("Failed to create user");
        }

        return result.rows[0].user_id as string;
    } catch (err) {
        throw err;
    }
  }

    async getUserInfo(): Promise<any> {
        try {
            const result = await db.query(
                `SELECT user_id, username, first_name, last_name, email, wallet_address, user_type, identification_number, active
                 FROM user`
            );
            return result.rows;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            await db.query(
                `DELETE FROM user WHERE user_id = $1`,
                [userId]
            );
        } catch (err) {
            throw err;
        }
    }

}
