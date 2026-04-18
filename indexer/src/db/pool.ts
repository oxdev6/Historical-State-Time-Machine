import "dotenv/config";
import pg from "pg";

export function createPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }
  return new pg.Pool({ connectionString });
}

