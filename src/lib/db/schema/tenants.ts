import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { businessTypeEnum } from "./enums";
import { memberships } from "./memberships";
import { categories } from "./menu";
import { tables } from "./tables";

// Tenants table
export const tenants = pgTable("tenants", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	phoneNumber: text("phoneNumber").notNull(),
	address: text("address").notNull(),
	email: text("email").notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

// Tenant Details table (one-to-one with tenants)
export const tenantDetails = pgTable("tenant_details", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	tenantId: text("tenantId")
		.notNull()
		.unique()
		.references(() => tenants.id, { onDelete: "cascade" }),
	logo: text("logo"), // URL to logo image
	businessType: businessTypeEnum("businessType").default("RESTAURANT"),

	// Social media accounts
	facebook: text("facebook"),
	instagram: text("instagram"),
	x: text("x"), // X (formerly Twitter)
	whatsapp: text("whatsapp"),
	tiktok: text("tiktok"),

	// Languages supported (array of language codes: ['en', 'ar', 'fr'])
	languages: text("languages").array().default(["en"]),
	currencies: text("currency").array().default(["EUR"]),
	// Additional info
	website: text("website"),

	// Website Configuration (Theme, Content, etc.)
	websiteConfig: json("websiteConfig").$type<any>().default({}),

	// QR Code Settings (colors, size, and error correction for all QR codes)
	qrCodeSettings: json("qrCodeSettings")
		.$type<{
			fgColor?: string;
			bgColor?: string;
			size?: "small" | "medium" | "large" | "xlarge";
			level?: "L" | "M" | "Q" | "H";
		}>()
		.default({
			fgColor: "#000000",
			bgColor: "#ffffff",
			size: "medium",
			level: "M",
		}),

	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Relations
export const tenantsRelations = relations(tenants, ({ many, one }) => ({
	members: many(memberships),
	details: one(tenantDetails, {
		fields: [tenants.id],
		references: [tenantDetails.tenantId],
	}),
	categories: many(categories),
	tables: many(tables),
}));

export const tenantDetailsRelations = relations(tenantDetails, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tenantDetails.tenantId],
		references: [tenants.id],
	}),
}));

// Types
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type TenantDetails = typeof tenantDetails.$inferSelect;
export type NewTenantDetails = typeof tenantDetails.$inferInsert;
