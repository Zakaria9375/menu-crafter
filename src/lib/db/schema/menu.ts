import {
	pgTable,
	text,
	timestamp,
	integer,
	boolean,
	json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants } from "./tenants";

// Categories table
export const categories = pgTable("categories", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	tenantId: text("tenantId")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	order: integer("order").default(0),
	translations: json("translations").$type<Record<string, any>>().default({}),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Menu Items table
export const menuItems = pgTable("menu_items", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	categoryId: text("categoryId")
		.notNull()
		.references(() => categories.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	price: text("price").notNull(), // Storing as text for flexibility, or could be decimal
	image: text("image"),
	available: boolean("available").default(true),
	dietary: text("dietary").array().default([]), // ['vegetarian', 'vegan', 'gluten-free']
	order: integer("order").default(0),
	translations: json("translations").$type<Record<string, any>>().default({}),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
	tenant: one(tenants, {
		fields: [categories.tenantId],
		references: [tenants.id],
	}),
	items: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
	category: one(categories, {
		fields: [menuItems.categoryId],
		references: [categories.id],
	}),
}));

// Types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
