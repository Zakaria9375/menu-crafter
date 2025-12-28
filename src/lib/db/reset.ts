import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);

async function reset() {
	console.log("🗑️ Dropping public schema...");
	await sql`DROP SCHEMA public CASCADE`;
	console.log("✨ Creating public schema...");
	await sql`CREATE SCHEMA public`;
	console.log("✅ Database reset complete.");
}

reset().catch((e) => {
	console.error(e);
	process.exit(1);
});
