"use server";

import { IActionResult } from "@/types/ITypes";
import prisma from ".";
import { Tenant, User } from "./generated/prisma/client";

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



export const getTenantBySubdomain = async (slug: string) : Promise<IActionResult<Tenant>> => {
	try {
		const tenant = await prisma.tenant.findUnique({
			where: {
				slug,
			},
		});
		if(!tenant) {
			return {
				success: false,
				message: "Tenant not found",
				data: undefined,
			};
		}
		return {
			success: true,
			message: "Tenant found",
			data: tenant ?? undefined,
		};
	}
	catch (error) {
		console.error(error);
		return {
			success: false,
			message: "Error getting tenant",
			data: undefined,
		};
	}
}

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
		const existingTenant = await prisma.tenant.findUnique({
			where: { slug: tenantSlug },
		});

		if (existingTenant) {
			return {
				success: false,
				message: "This subdomain is already taken. Please choose a different one.",
			};
		}

		// Create tenant and membership in a transaction
		const tenant = await prisma.$transaction(async (tx) => {
			// Create the tenant
			const newTenant = await tx.tenant.create({
				data: {
					name: businessName,
					slug: tenantSlug,
					phoneNumber: phoneNumber,
					address: address,
				},
			});

			// Create membership with OWNER role
			await tx.membership.create({
				data: {
					tenantId: newTenant.id,
					userId: userId,
					role: "OWNER",
				},
			});

			return newTenant;
		});

		return {
			success: true,
			message: "Tenant created successfully",
			data: tenant,
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