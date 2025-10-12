"use server";

import { signOut } from "../index";

/**
 * Sign out a user
 * @returns NextAuth signOut result
 */
export const signOutAction = async () => {
	const result = await signOut();
	return result;
};

