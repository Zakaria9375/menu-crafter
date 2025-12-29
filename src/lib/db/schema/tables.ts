import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";

// Tables table
export const tables = pgTable("tables", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	tenantId: text("tenantId")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	minSeats: integer("minSeats").default(1),
	maxSeats: integer("maxSeats").default(4),
	qrCode: text("qrCode"), // Store specific code or token if needed, otherwise ID can be used
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Relations
export const tablesRelations = relations(tables, ({ one }) => ({
	tenant: one(tenants, {
		fields: [tables.tenantId],
		references: [tenants.id],
	}),
}));

// Types
export type Table = typeof tables.$inferSelect;
export type NewTable = typeof tables.$inferInsert;
