"use server";

import { IActionResult } from "@/types/ITypes";
import db from "..";
import { users } from "../schema";
import type { User } from "../schema";
import { eq } from "drizzle-orm";
import { success, failure } from "@/utils/actionResult";

/**
 * Create a new user
 * @param name - User name
 * @param email - User email
 * @param passwordHash - Hashed password
 * @returns IActionResult
 */
export const createUser = async (
	name: string,
	email: string,
	passwordHash: string
): Promise<IActionResult<User>> => {
	try {
		const [newUser] = await db
			.insert(users)
			.values({
				name: name,
				email: email,
				passwordHash: passwordHash,
			})
			.returning();

		return success("User created successfully", newUser);
	} catch (error) {
		return failure("Error creating user", error as Error);
	}
};

/**
 * Get a user by email
 * @param email - User email
 * @returns IActionResult
 */
export const getUserByEmail = async (
	email: string
): Promise<IActionResult<User>> => {
	try {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		const user = result[0];

		return user ? success("User found", user) : failure("User not found");
	} catch (error) {
		return failure("User not found", error as Error);
	}
};

/**
 * Update user password
 * @param userId - User ID
 * @param passwordHash - New hashed password
 * @returns IActionResult
 */
export const updateUserPassword = async (
	userId: string,
	passwordHash: string
): Promise<IActionResult<User>> => {
	try {
		const result = await db
			.update(users)
			.set({ passwordHash: passwordHash })
			.where(eq(users.id, userId))
			.returning();

		return success("Password updated successfully", result[0]);
	} catch (error) {
		return failure("Error updating password", error as Error);
	}
};

