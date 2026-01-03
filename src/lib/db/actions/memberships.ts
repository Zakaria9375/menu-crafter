"use server";

import { IActionResult } from "@/types/ITypes";
import { IUserTenants } from "@/types/IUserTenants";
import db from "..";
import { memberships, tenants, users } from "../schema";
import type { Membership } from "../schema";
import { eq, and } from "drizzle-orm";
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

/**
 * Get all members of a tenant
 * @param tenantId - Tenant ID
 * @returns IActionResult with array of members (joined with user info)
 */
export const getTenantMembers = async (
	tenantId: string
): Promise<
	IActionResult<
		{
			userId: string;
			name: string | null;
			email: string;
			image: string | null;
			role: "OWNER" | "ADMIN" | "STAFF" | "MEMBER";
			joinedAt: Date;
		}[]
	>
> => {
	try {
		const result = await db
			.select({
				userId: users.id,
				name: users.name,
				email: users.email,
				image: users.image,
				role: memberships.role,
				joinedAt: memberships.createdAt,
			})
			.from(memberships)
			.innerJoin(users, eq(memberships.userId, users.id))
			.where(eq(memberships.tenantId, tenantId));

		return success("Tenant members fetched", result);
	} catch (error) {
		return failure("Error fetching tenant members", error as Error);
	}
};

/**
 * Add a member to a tenant by email
 * @param tenantId - Tenant ID
 * @param email - User email
 * @param role - Role (ADMIN, STAFF, etc.)
 */
export const addTenantMember = async (
	tenantId: string,
	email: string,
	role: "OWNER" | "ADMIN" | "STAFF" | "MEMBER"
): Promise<IActionResult<void>> => {
	try {
		// 1. Find user by email
		const userResult = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		const user = userResult[0];

		if (!user) {
			return failure("User with this email does not exist");
		}

		// 2. Check if already a member
		const existingMembership = await db
			.select()
			.from(memberships)
			.where(
				and(eq(memberships.tenantId, tenantId), eq(memberships.userId, user.id))
			)
			.limit(1);

		if (existingMembership.length > 0) {
			return failure("User is already a member of this tenant");
		}

		// 3. Add membership
		await db.insert(memberships).values({
			tenantId,
			userId: user.id,
			role,
		});

		return success("Member added successfully");
	} catch (error) {
		return failure("Error adding member", error as Error);
	}
};

/**
 * Update a member's role
 * @param tenantId - Tenant ID
 * @param userId - User ID
 * @param role - New role
 */
export const updateTenantMemberRole = async (
	tenantId: string,
	userId: string,
	role: "OWNER" | "ADMIN" | "STAFF" | "MEMBER"
): Promise<IActionResult<void>> => {
	try {
		await db
			.update(memberships)
			.set({ role, updatedAt: new Date() })
			.where(
				and(eq(memberships.tenantId, tenantId), eq(memberships.userId, userId))
			);

		return success("Member role updated successfully");
	} catch (error) {
		return failure("Error updating member role", error as Error);
	}
};

/**
 * Remove a member from a tenant
 * @param tenantId - Tenant ID
 * @param userId - User ID
 */
export const removeTenantMember = async (
	tenantId: string,
	userId: string
): Promise<IActionResult<void>> => {
	try {
		await db
			.delete(memberships)
			.where(
				and(eq(memberships.tenantId, tenantId), eq(memberships.userId, userId))
			);

		return success("Member removed successfully");
	} catch (error) {
		return failure("Error removing member", error as Error);
	}
};
