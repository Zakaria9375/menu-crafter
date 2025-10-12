"use server";

import { signIn } from "../index";
import { getUserByEmail } from "@/lib/db/actions";
import type { User } from "@/lib/db/schema";
import { IActionResult } from "@/types/ITypes";
import { ILoginSchema, loginSchema } from "@/lib/validation/login-schema";
import { success, failure, validationError } from "@/utils/actionResult";

/**
 * Sign in a user
 * @param data - Login credentials
 * @returns IActionResult
 */
export const signInAction = async (
	data: ILoginSchema
): Promise<IActionResult<User>> => {
	try {
		const validatedData = loginSchema.safeParse(data);
		if (!validatedData.success) {
			return validationError(validatedData.error);
		}

		const existedUser = await getUserByEmail(validatedData.data.email);
		if (!existedUser.succeeded) {
			return failure("User not found");
		}

		const result = await signIn("credentials", {
			email: validatedData.data.email,
			password: validatedData.data.password,
			redirect: false,
		});

		return result
			? success("Sign in successful", result)
			: failure("Sign in failed");
	} catch (error) {
		return failure("Sign in failed", error as Error);
	}
};

