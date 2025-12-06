import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";

if (!process.env.DATABASE_URI) {
  throw new Error("DATABASE_URI environment variable is not set");
}

const db = drizzle(process.env.DATABASE_URI!);

export const connectDB = async (): Promise<typeof db> => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

export { db };
