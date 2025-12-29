import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenantRoleEnum } from "./enums";
import { users } from "./users";
import { tenants } from "./tenants";

// Memberships table (Many-to-Many between Users and Tenants)
export const memberships = pgTable(
	"memberships",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		tenantId: text("tenantId")
			.notNull()
			.references(() => tenants.id, { onDelete: "cascade" }),
		role: tenantRoleEnum("role").notNull().default("MEMBER"),
		createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.tenantId] }),
	})
);

// Relations
export const membershipsRelations = relations(memberships, ({ one }) => ({
	tenant: one(tenants, {
		fields: [memberships.tenantId],
		references: [tenants.id],
	}),
	user: one(users, {
		fields: [memberships.userId],
		references: [users.id],
	}),
}));

// Types
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
