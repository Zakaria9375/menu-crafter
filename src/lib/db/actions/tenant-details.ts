"use server";

import { IActionResult } from "@/types/ITypes";
import db from "..";
import { tenants, tenantDetails } from "../schema";
import type { NewTenantDetails } from "../schema";
import { eq } from "drizzle-orm";
import { success, failure } from "@/utils/actionResult";

/**
 * Get tenant details by tenant ID
 * @param tenantId - Tenant ID
 * @returns IActionResult
 */
export const getTenantDetails = async (
	tenantId: string
): Promise<IActionResult<any>> => {
	try {
		console.log("tenantid", tenantId);
		const result = await db
			.select()
			.from(tenantDetails)
			.where(eq(tenantDetails.tenantId, tenantId))
			.limit(1);

		// If no details found, return basic object or null
		const details = result[0] || null;

		// Also fetch the tenant base info to merge basic details like name/slug
		const tenantBase = await db
			.select()
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		return success("Tenant details found", {
			...details,
			base: tenantBase[0],
		});
	} catch (error) {
		return failure("Error getting tenant details", error as Error);
	}
};

/**
 * Update tenant details
 * @param tenantId - Tenant ID
 * @param data - Partial data to update
 * @returns IActionResult
 */
export const updateTenantDetails = async (
	tenantId: string,
	data: Partial<NewTenantDetails> & {
		name?: string;
		slug?: string;
		phoneNumber?: string;
		address?: string;
		email?: string;
	}
): Promise<IActionResult<any>> => {
	try {
		// Extract base tenant fields that might be updated
		const { name, slug, phoneNumber, address, email, ...detailsData } = data;

		// Update base tenant table if needed
		if (name || slug || phoneNumber || address || email) {
			const baseUpdate: any = {};
			if (name) baseUpdate.name = name;
			if (slug) baseUpdate.slug = slug;
			if (phoneNumber) baseUpdate.phoneNumber = phoneNumber;
			if (address) baseUpdate.address = address;
			if (email) baseUpdate.email = email;

			await db
				.update(tenants)
				.set({ ...baseUpdate })
				.where(eq(tenants.id, tenantId));
		}

		// Update details table
		// Check if details record exists
		const existing = await db
			.select()
			.from(tenantDetails)
			.where(eq(tenantDetails.tenantId, tenantId))
			.limit(1);

		if (existing.length > 0) {
			if (Object.keys(detailsData).length > 0) {
				await db
					.update(tenantDetails)
					.set({ ...detailsData, updatedAt: new Date() })
					.where(eq(tenantDetails.tenantId, tenantId));
			}
		} else {
			// Create if not exists
			await db.insert(tenantDetails).values({
				tenantId,
				...detailsData,
			} as NewTenantDetails);
		}

		return success("Tenant updated successfully");
	} catch (error) {
		return failure("Error updating tenant details", error as Error);
	}
};
