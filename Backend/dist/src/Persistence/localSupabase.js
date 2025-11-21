"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const pg_1 = require("pg");
const db = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
async function connectDB() {
    try {
        const client = await db.connect();
        console.log("🔗 Connected to PostgreSQL container");
        client.release();
    }
    catch (err) {
        console.error("❌ Error connecting to PostgreSQL:", err);
    }
}
exports.default = db;
