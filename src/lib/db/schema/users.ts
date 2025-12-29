import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { accounts } from "./auth";
import { sessions } from "./auth";
import { memberships } from "./memberships";
import { authenticators } from "./auth";
import { passwordResetTokens } from "./auth";

// Users table
export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").notNull().unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	passwordHash: text("passwordHash").notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	memberships: many(memberships),
	authenticators: many(authenticators),
	passwordResetTokens: many(passwordResetTokens),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
