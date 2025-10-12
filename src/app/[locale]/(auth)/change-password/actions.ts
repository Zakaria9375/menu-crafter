"use server";
import { getPasswordResetToken } from "@/lib/db/actions";
import { IActionResult } from "@/types/ITypes";
import { PasswordResetToken } from "@/lib/db/schema";
import { failure, success } from "@/utils/actionResult";

export const isTokenValid = async (
	token: string
): Promise<IActionResult<PasswordResetToken>> => {
	try {
		if (!token) return failure("Token is required");
		const result = await getPasswordResetToken(token);
		if (result?.succeeded) {
			const { data } = result;
			if (!data) return failure("Password reset token not found");
			const isValid = data.expires.getTime() > Date.now();
			return isValid
				? success("Password reset token is valid", data)
				: failure("Password reset token is invalid");
		}
		return failure("Password reset token not found");
	} catch (error) {
		console.error(error);
		return failure("Error checking password reset token", error as Error);
	}
};
