"use server";

import { IActionResult } from "@/types/ITypes";
import db from "..";
import { tenants, memberships } from "../schema";
import type { Tenant } from "../schema";
import { eq } from "drizzle-orm";
import { success, failure } from "@/utils/actionResult";
import { IOnboardingSchema, onboardingSchema } from "@/lib/validation/onboarding-schema";
import { auth } from "@/lib/auth";

/**
 * Get tenant by subdomain/slug
 * @param slug - Tenant slug
 * @returns IActionResult
 */
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

		return tenant
			? success("Tenant found", tenant)
			: failure("Tenant not found");
	} catch (error) {
		return failure("Error getting tenant", error as Error);
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
	onBoardingData: IOnboardingSchema,
	): Promise<IActionResult<Tenant>> => {
	try {
		const validatedData = onboardingSchema.safeParse(onBoardingData);
		if (!validatedData.success) {
			return failure(validatedData.error.message);
		}
		const session = await auth();
		if (!session?.user?.id) {
			return failure("User not authenticated");
		}
		const { businessName, phoneNumber, address, tenantSlug } = validatedData.data;
		// Check if slug already exists
		const existingTenant = await db
			.select()
			.from(tenants)
			.where(eq(tenants.slug, tenantSlug))
			.limit(1);

		if (existingTenant.length > 0) {
			return failure(
				"This subdomain is already taken. Please choose a different one."
			);
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
				userId: session?.user?.id as string,
				role: "OWNER",
			});

			return newTenant;
		});

		return success("Tenant created successfully", result);
	} catch (error) {
		return failure("Error creating tenant", error as Error);
	}
};

