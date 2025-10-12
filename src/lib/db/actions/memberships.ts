"use server";

import { IActionResult } from "@/types/ITypes";
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
 * Get user memberships with tenant information (for JWT token)
 * @param userId - User ID
 * @returns IActionResult with array of memberships with tenant slug
 */
export const getUserMembershipsWithTenants = async (
	userId: string
): Promise<
	IActionResult<{ tenantId: string; role: string; slug: string | null }[]>
> => {
	try {
		const result = await db
			.select({
				tenantId: memberships.tenantId,
				role: memberships.role,
				slug: tenants.slug,
			})
			.from(memberships)
			.leftJoin(tenants, eq(memberships.tenantId, tenants.id))
			.where(eq(memberships.userId, userId));

		if (result.length === 0) {
			return success("User has no memberships", []);
		}

		return success(`Found ${result.length} membership(s)`, result);
	} catch (error) {
		return failure("Error fetching user memberships", error as Error);
	}
};

