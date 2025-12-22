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
		if (!existedUser.succeeded || !existedUser.data) {
			return failure("User not found");
		}

		const result = await signIn("credentials", {
			email: validatedData.data.email,
			password: validatedData.data.password,
			redirect: false,
		});

		if (result?.error) {
			return failure(result.code === "credentials" ? "Invalid credentials" : result.error);
		}

		return success("Sign in successful", existedUser.data);
	} catch (error) {
		// NextAuth throws on some errors even with redirect: false
		if (error instanceof Error && error.message.includes("Read more at")) {
             // This is likely a NextAuth error that we can't easily parse, or it's a redirect (but redirect: false should prevent that)
             // Actually, for credentials provider, it might throw.
             // Let's just return failure.
             return failure("Sign in failed", error);
        }
		return failure("Sign in failed", error as Error);
	}
};

