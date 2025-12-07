"use server";

import { IActionResult } from "@/types/ITypes";
import { IUserTenants } from "@/types/IUserTenants";
import db from "..";
import { memberships, tenants } from "../schema";
import type { Membership } from "../schema";
import { eq } from "drizzle-orm";
import { success, failure } from "@/utils/actionResult";

/**
 * Get user memberships
 * @param userId - User ID
 * @returns IActionResult with array of memberships
 */
export const getUserMemberships = async (
	userId: string
): Promise<IActionResult<Membership[]>> => {
	try {
		const result = await db
			.select()
			.from(memberships)
			.where(eq(memberships.userId, userId));

		if (result.length === 0) {
			return success("User has no memberships", []);
		}

		return success(`User memberships found: ${result.length}`, result);
	} catch (error) {
		return failure("Error getting user memberships", error as Error);
	}
};

/**
 * Get user tenants with role information
 * @param userId - User ID
 * @returns IActionResult with array of tenants including user's role
 */
export const getUserTenants = async (
	userId: string
): Promise<IActionResult<IUserTenants[]>> => {
	try {
		const result = await db
			.select({
				id: tenants.id,
				name: tenants.name,
				slug: tenants.slug,
				phoneNumber: tenants.phoneNumber,
				address: tenants.address,
				createdAt: tenants.createdAt,
				role: memberships.role,
			})
			.from(memberships)
			.innerJoin(tenants, eq(memberships.tenantId, tenants.id))
			.where(eq(memberships.userId, userId));

		if (result.length === 0) {
			return success("User has no tenants", []);
		}

		return success(`Found ${result.length} tenant(s)`, result);
	} catch (error) {
		return failure("Error fetching user tenants", error as Error);
	}
};

