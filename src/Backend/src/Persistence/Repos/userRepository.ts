import { Farmer, Investor, User } from '../../Business/Models/user';

export interface UserRepository {
    createUser(user: User): Promise<string>;
    createFarmer(farmer: Farmer): Promise<void>;
    createInvestor(investor: Investor): Promise<void>;
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

  async createFarmer(farmer: Farmer): Promise<void> {
    try {
        const result = await db.query(
            `INSERT INTO farmer
                (user_id, location)
                VALUES ($1,$2)`,
            [
                farmer.user_id,
                farmer.location,
            ]
        );
    } catch (err) {
        throw err;
    }
  }

  async createInvestor(investor: Investor): Promise<void> {
    try {
        const result = await db.query(
            `INSERT INTO investor
                (user_id)
                VALUES ($1)`,
            [
                investor.user_id,
            ]
        );
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
