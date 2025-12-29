import { pgEnum } from "drizzle-orm/pg-core";

// Enums
export const tenantRoleEnum = pgEnum("TenantRole", [
	"OWNER",
	"ADMIN",
	"STAFF",
	"MEMBER",
]);

export const businessTypeEnum = pgEnum("BusinessType", [
	"RESTAURANT",
	"HOTEL",
	"CAFE",
	"BAR",
	"BAKERY",
	"OTHER",
]);
