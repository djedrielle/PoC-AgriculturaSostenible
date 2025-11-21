"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryPostgres = void 0;
const localSupabase_1 = __importDefault(require("../localSupabase"));
class UserRepositoryPostgres {
    async createUser(user) {
        try {
            const result = await localSupabase_1.default.query(`INSERT INTO user
                (username, first_name, last_name, email, wallet_address, user_type, identification_number, active)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING user_id`, [
                user.username,
                user.first_name,
                user.last_name,
                user.email,
                user.wallet_address ?? null,
                user.user_type,
                user.identification_number ?? null,
                typeof user.active === "boolean" ? user.active : true,
            ]);
            if (!result?.rows?.length) {
                throw new Error("Failed to create user");
            }
            return result.rows[0].user_id;
        }
        catch (err) {
            throw err;
        }
    }
    async getUserInfo() {
        try {
            const result = await localSupabase_1.default.query(`SELECT user_id, username, first_name, last_name, email, wallet_address, user_type, identification_number, active
                 FROM user`);
            return result.rows;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteUser(userId) {
        try {
            await localSupabase_1.default.query(`DELETE FROM user WHERE user_id = $1`, [userId]);
        }
        catch (err) {
            throw err;
        }
    }
}
exports.UserRepositoryPostgres = UserRepositoryPostgres;
