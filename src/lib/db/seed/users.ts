import db from "../index";
import { users } from "../schema";
import * as bcrypt from "bcryptjs";
import { usersData } from "./data/users.data";

/**
 * Seeds users into the database
 * @returns Array of created users
 */
export async function seedUsers() {
	console.log("👥 Creating users...");

	const hashedPassword = await bcrypt.hash("password123", 10);

	const createdUsers = await db
		.insert(users)
		.values(usersData.map((user) => ({ ...user, passwordHash: hashedPassword })))
		.returning();

	console.log(`✅ Created ${createdUsers.length} users`);

	return createdUsers;
}
