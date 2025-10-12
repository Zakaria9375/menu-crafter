"use server";

import { IActionResult } from "@/types/ITypes";
import db from "..";
import { passwordResetTokens } from "../schema";
import type { PasswordResetToken, NewPasswordResetToken } from "../schema";
import { eq } from "drizzle-orm";
import { success, failure } from "@/utils/actionResult";

/**
 * Create a new password reset token
 * @param values - New password reset token values
 * @returns IActionResult
 */
export const createPasswordResetToken = async (
	values: NewPasswordResetToken
): Promise<IActionResult<PasswordResetToken>> => {
	try {
		const [newPasswordResetToken] = await db
			.insert(passwordResetTokens)
			.values({
				email: values.email,
				token: values.token,
				userId: values.userId,
				expires: values.expires,
			})
			.returning();

		return success(
			"Password reset token created successfully",
			newPasswordResetToken
		);
	} catch (error) {
		return failure("Error creating password reset token", error as Error);
	}
};

/**
 * Get password reset token by token string
 * @param token - Reset token
 * @returns IActionResult
 */
export const getPasswordResetToken = async (
	token: string
): Promise<IActionResult<PasswordResetToken>> => {
	try {
		const result = await db
			.select()
			.from(passwordResetTokens)
			.where(eq(passwordResetTokens.token, token))
			.limit(1);

		const passwordResetToken = result[0];

		return passwordResetToken
			? success("Password reset token found", passwordResetToken)
			: failure("Password reset token not found");
	} catch (error) {
		return failure("Error getting password reset token", error as Error);
	}
};

/**
 * Delete password reset token
 * @param token - Reset token to delete
 * @returns IActionResult
 */
export const deletePasswordResetToken = async (
	token: string
): Promise<IActionResult<void>> => {
	try {
		await db
			.delete(passwordResetTokens)
			.where(eq(passwordResetTokens.token, token));

		return success("Password reset token deleted successfully");
	} catch (error) {
		return failure("Error deleting password reset token", error as Error);
	}
};

