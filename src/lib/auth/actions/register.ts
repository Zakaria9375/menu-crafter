"use server";

import {
	IRegisterSchema,
	registerSchema,
} from "@/lib/validation/register-schema";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/db/actions";
import type { User } from "@/lib/db/schema";
import { IActionResult } from "@/types/ITypes";
import { success, failure, validationError } from "@/utils/actionResult";

/**
 * Register a new user
 * @param data - User registration data
 * @returns IActionResult
 */
export const registerAction = async (
	data: IRegisterSchema
): Promise<IActionResult<User>> => {
	try {
		const validatedData = registerSchema.safeParse(data);
		if (!validatedData.success) {
			return validationError(validatedData.error);
		}

		const existedUser = await getUserByEmail(validatedData.data.email);
		if (existedUser.succeeded) {
			return failure("Email already registered");
		}

		const { name, email, password } = validatedData.data;
		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await createUser(name, email, hashedPassword);

		if (!result.succeeded) {
			return failure("User registration failed", result.error);
		}

		return success("User registered successfully", result.data);
	} catch (error) {
		return failure("User registration failed", error as Error);
	}
};

