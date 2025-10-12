"use server";

import bcrypt from "bcryptjs";
import {
	changePasswordSchema,
	IChangePasswordSchema,
} from "@/lib/validation/change-password-schema";
import { auth } from "../index";
import { success, failure, validationError } from "@/utils/actionResult";
import {
	updateUserPassword,
	deletePasswordResetToken,
} from "@/lib/db/actions";
import type { User } from "@/lib/db/schema";
import { IActionResult } from "@/types/ITypes";
import { isTokenValid } from "@/app/[locale]/(auth)/change-password/actions";

/**
 * Change user password using reset token
 * @param formData - New password data
 * @param token - Password reset token
 * @returns IActionResult
 */
export const changePasswordAction = async (
	formData: IChangePasswordSchema,
	token: string
): Promise<IActionResult<User>> => {
	try {
		const validatedData = changePasswordSchema.safeParse(formData);
		if (!validatedData.success) {
			return validationError(validatedData.error);
		}

		const session = await auth();
		if (session?.user?.id) {
			return failure("User already logged in");
		}

		const { data, succeeded, error } = await isTokenValid(token);
		if (data?.userId && succeeded) {
			const hashedPassword = await bcrypt.hash(
				validatedData.data.password,
				10
			);
			const result = await updateUserPassword(data.userId, hashedPassword);

			if (result.succeeded) {
				await deletePasswordResetToken(token);
				return success("Password changed successfully", result.data);
			}
		}

		return failure("Invalid password reset token", error);
	} catch (error) {
		return failure("Password change failed", error as Error);
	}
};

