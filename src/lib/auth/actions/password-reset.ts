"use server";

import {
	IPasswordResetSchema,
	passwordResetSchema,
} from "@/lib/validation/password-reset-schema";
import { auth } from "../index";
import { randomBytes } from "crypto";
import { success, failure, validationError } from "@/utils/actionResult";
import {
	createPasswordResetToken,
	getUserByEmail,
} from "@/lib/db/actions";
import { IActionResult } from "@/types/ITypes";
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail";
import { Locale } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

/**
 * Request password reset - sends email with reset link
 * @param data - Password reset request data
 * @returns IActionResult
 */
export const passwordResetAction = async (
	data: IPasswordResetSchema
): Promise<IActionResult<undefined>> => {
	try {
		const validatedData = passwordResetSchema.safeParse(data);
		if (!validatedData.success) {
			return validationError(validatedData.error);
		}

		const existedUser = await getUserByEmail(validatedData.data.email);
		if (!existedUser.succeeded) {
			return failure("User not found", existedUser.error);
		}

		const session = await auth();
		if (!!session?.user?.id) {
			return failure("User already logged in");
		}

		const result = await createPasswordResetToken({
			email: validatedData.data.email,
			token: randomBytes(32).toString("hex"),
			userId: existedUser.data?.id ?? "",
			expires: new Date(Date.now() + 1000 * 60 * 60),
		});

		if (result.succeeded && result.data?.token) {
			const locale = await getLocale();
			const mailResult = await sendPasswordResetEmail(
				existedUser.data?.email ?? "",
				existedUser.data?.name ?? "",
				result.data?.token,
				locale as Locale
			);

			return mailResult.succeeded
				? success("Please check your email for a password reset link")
				: failure("Error sending password reset email", mailResult.error);
		} else {
			return failure("Password reset token creation failed", result.error);
		}
	} catch (error) {
		return failure("Password reset failed", error as Error);
	}
};

