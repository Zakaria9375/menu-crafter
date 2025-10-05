"use server";

import { IRegisterSchema, registerSchema } from "@/lib/validation/register-schema";
import { signIn, signOut } from "./index";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { IActionResult } from "@/types/ITypes";
import { User } from "../db/generated/prisma";

/**
 * Get a user by email
 * @param email - User email
 * @returns IActionResult
 */
export const getUserByEmail = async (
	email: string
): Promise<IActionResult<User>> => {
	try {
		const result = await prisma.user.findUnique({
			where: { email },
		});
		return {
			success: !!result,
			message: result ? "User found" : "User not found",
			data: result ?? undefined,
		};
	} catch (error) {
		return {
			success: false,
			message: "User not found",
			error: error as Error,
		};
	}
};

/**
 * Register a new user
 * @param data - User data
 * @returns IActionResult
 */
export const registerAction = async (
	data: IRegisterSchema
): Promise<IActionResult<User>> => {
	try {
    const validatedData = registerSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: validatedData.error.message,
      };
    }
		const { name, email, password } = validatedData.data;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				name: name,
				email: email,
				passwordHash: hashedPassword,
			},
		});
		return {
			success: true,
			message: "User registered successfully",
			data: newUser,
		};
	} catch (error) {
		return {
			success: false,
			message: "User registration failed",
			error: error as Error,
		};
	}
};

/**
 * Sign in a user
 * @param email - User email
 * @param password - User password
 * @returns IActionResult
 */
export const signInAction = async (
	email: string,
	password: string
): Promise<IActionResult<User>> => {
	try {
		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});
		return {
			success: !!result,
			message: result ? "Sign in successful" : "Sign in failed",
			data: result ?? undefined,
		};
	} catch (error) {
		return {
			success: false,
			message: "Sign in failed",
			error: error as Error,
		};
	}
};

/**
 * Sign out a user
 * @returns IActionResult
 */
export const signOutAction = async () => {
	const result = await signOut();
	return result;
};



/**
 * Get a user by id
 * @param id - User id
 * @returns IActionResult
 */
export const getUserById = async (
	id: string
): Promise<IActionResult<User>> => {
	try {
		const result = await prisma.user.findUnique({
			where: { id },
		});
		return {
			success: !!result,
			message: result ? "User found" : "User not found",
			data: result ?? undefined,
		};
	} catch (error) {
		return {
			success: false,
			message: "User not found",
			error: error as Error,
		};
	}
};