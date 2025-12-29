/**
 * Database Actions - Centralized exports
 *
 * This file re-exports all database actions from their respective modules.
 * Import from this file to access any database action.
 *
 * Example:
 *   import { createUser, getTenantBySubdomain } from "@/lib/db/actions";
 */

// User actions
export { createUser, getUserByEmail, updateUserPassword } from "./users";

// Tenant actions
export { getTenantBySubdomain, createTenant } from "./tenants";

export { getTenantDetails, updateTenantDetails } from "./tenant-details";

// Table actions
export { getTables, createTable, updateTable, deleteTable } from "./tables";

// Membership actions
export {
	getUserMemberships,
	getUserTenants,
	getTenantMembers,
	addTenantMember,
	updateTenantMemberRole,
	removeTenantMember,
} from "./memberships";

// Password reset token actions
export {
	createPasswordResetToken,
	getPasswordResetToken,
	deletePasswordResetToken,
} from "./password-reset-tokens";

// Menu actions
export { getMenu } from "./menu";
