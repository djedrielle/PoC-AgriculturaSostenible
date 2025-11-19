import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function connectDB() {
  try {
    const client = await db.connect();
    console.log("🔗 Connected to PostgreSQL container");
    client.release();
  } catch (err) {
    console.error("❌ Error connecting to PostgreSQL:", err);
  }
}

export default db;
