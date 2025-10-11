"use server";
import { IActionResult } from "@/types/ITypes";
import db from ".";
import { users, tenants, memberships } from "./schema";
import type { User, Tenant, Membership } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Create a new user
 * @param name - User name
 * @param email - User email
 * @param passwordHash - Hashed password
 * @returns IActionResult
 */
export const createUser = async (
	name: string,
	email: string,
	passwordHash: string
): Promise<IActionResult<User>> => {
	try {
		const [newUser] = await db
			.insert(users)
			.values({
				name: name,
				email: email,
				passwordHash: passwordHash,
			})
			.returning();

		return {
			success: true,
			message: "User created successfully",
			data: newUser,
		};
	} catch (error) {
		return {
			success: false,
			message: "Error creating user",
			error: error as Error,
		};
	}
};

/**
 * Get a user by email
 * @param email - User email
 * @returns IActionResult
 */
export const getUserByEmail = async (
	email: string
): Promise<IActionResult<User>> => {
	try {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		const user = result[0];

		return {
			success: !!user,
			message: user ? "User found" : "User not found",
			data: user ?? undefined,
		};
	} catch (error) {
		return {
			success: false,
			message: "User not found",
			error: error as Error,
		};
	}
};

export const getTenantBySubdomain = async (
	slug: string
): Promise<IActionResult<Tenant>> => {
	try {
		const result = await db
			.select()
			.from(tenants)
			.where(eq(tenants.slug, slug))
			.limit(1);
		const tenant = result[0];

		if (!tenant) {
			return {
				success: false,
				message: "Tenant not found",
				data: undefined,
			};
		}
		return {
			success: true,
			message: "Tenant found",
			data: tenant,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: "Error getting tenant",
			data: undefined,
		};
	}
};

/**
 * Create a new tenant with the authenticated user as primary owner
 * @param businessName - Business name
 * @param phoneNumber - Business phone number
 * @param address - Business address
 * @param tenantSlug - Custom tenant slug/subdomain
 * @param userId - User ID who will be the primary owner
 * @returns IActionResult
 */
export const createTenant = async (
	businessName: string,
	phoneNumber: string,
	address: string,
	tenantSlug: string,
	userId: string
): Promise<IActionResult<Tenant>> => {
	try {
		// Check if slug already exists
		const existingTenant = await db
			.select()
			.from(tenants)
			.where(eq(tenants.slug, tenantSlug))
			.limit(1);

		if (existingTenant.length > 0) {
			return {
				success: false,
				message:
					"This subdomain is already taken. Please choose a different one.",
			};
		}

		// Create tenant and membership in a transaction
		const result = await db.transaction(async (tx) => {
			// Create the tenant
			const [newTenant] = await tx
				.insert(tenants)
				.values({
					name: businessName,
					slug: tenantSlug,
					phoneNumber: phoneNumber,
					address: address,
				})
				.returning();

			// Create membership with OWNER role
			await tx.insert(memberships).values({
				tenantId: newTenant.id,
				userId: userId,
				role: "OWNER",
			});

			return newTenant;
		});

		return {
			success: true,
			message: "Tenant created successfully",
			data: result,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: "Error creating tenant",
			error: error as Error,
		};
	}
};

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
			return {
				success: true,
				message: "User has no memberships",
				data: [],
			};
		}
		return {
			success: true,
			message: `User memberships found: ${result.length}`,
			data: result,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: "Error getting user memberships",
			data: [],
		};
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
			return {
				success: true,
				message: "User has no memberships",
				data: [],
			};
		}

		return {
			success: true,
			message: `Found ${result.length} membership(s)`,
			data: result,
		};
	} catch (error) {
		console.error("Error fetching user memberships with tenants:", error);
		return {
			success: false,
			message: "Error fetching user memberships",
			data: [],
			error: error as Error,
		};
	}
};
