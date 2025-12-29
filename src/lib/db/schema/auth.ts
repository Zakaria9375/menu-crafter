import {
	pgTable,
	text,
	timestamp,
	integer,
	boolean,
	primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Accounts table (OAuth)
export const accounts = pgTable(
	"accounts",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
		createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
	})
);

// Sessions table
export const sessions = pgTable("sessions", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Verification tokens table
export const verificationTokens = pgTable(
	"verification_tokens",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.identifier, table.token] }),
	})
);

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text("email").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Authenticators table (WebAuthn)
export const authenticators = pgTable(
	"Authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.credentialID] }),
	})
);

// Relations
export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
	user: one(users, {
		fields: [authenticators.userId],
		references: [users.id],
	}),
}));

export const passwordResetTokensRelations = relations(
	passwordResetTokens,
	({ one }) => ({
		user: one(users, {
			fields: [passwordResetTokens.userId],
			references: [users.id],
		}),
	})
);

// Types
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
