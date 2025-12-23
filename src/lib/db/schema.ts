import { pgTable, text, timestamp, integer, boolean, pgEnum, unique, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const tenantRoleEnum = pgEnum('TenantRole', ['OWNER', 'ADMIN', 'STAFF', 'MEMBER']);
export const businessTypeEnum = pgEnum('BusinessType', ['RESTAURANT', 'HOTEL', 'CAFE', 'BAR', 'BAKERY', 'OTHER']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  passwordHash: text('passwordHash').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

// Accounts table (OAuth)
export const accounts = pgTable('accounts', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

// Sessions table
export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

// Verification tokens table
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));

// Password reset tokens table
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// Tenants table
export const tenants = pgTable('tenants', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  phoneNumber: text('phoneNumber').notNull(),
  address: text('address').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

// Tenant Details table (one-to-one with tenants)
export const tenantDetails = pgTable('tenant_details', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: text('tenantId').notNull().unique().references(() => tenants.id, { onDelete: 'cascade' }),
  logo: text('logo'), // URL to logo image
  businessType: businessTypeEnum('businessType').default('RESTAURANT'),
  
  // Social media accounts
  facebook: text('facebook'),
  instagram: text('instagram'),
  x: text('x'), // X (formerly Twitter)
  whatsapp: text('whatsapp'),
  tiktok: text('tiktok'),
  
  // Languages supported (array of language codes: ['en', 'ar', 'fr'])
  languages: text('languages').array().default(['en']),
  currencies: text('currency').array().default(["EUR"]),
  // Additional info
  website: text('website'),
  
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

// Memberships table (join table for users and tenants)
export const memberships = pgTable('memberships', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: text('tenantId').notNull().references(() => tenants.id),
  userId: text('userId').notNull().references(() => users.id),
  role: tenantRoleEnum('role').notNull().default('MEMBER'),
  joinedAt: timestamp('joinedAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  uniqueTenantUser: unique().on(table.tenantId, table.userId),
}));

// Authenticators table (WebAuthn)
export const authenticators = pgTable('Authenticator', {
  credentialID: text('credentialID').notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  providerAccountId: text('providerAccountId').notNull(),
  credentialPublicKey: text('credentialPublicKey').notNull(),
  counter: integer('counter').notNull(),
  credentialDeviceType: text('credentialDeviceType').notNull(),
  credentialBackedUp: boolean('credentialBackedUp').notNull(),
  transports: text('transports'),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.credentialID] }),
}));


// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: text('tenantId').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  order: integer('order').default(0),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

// Menu Items table
export const menuItems = pgTable('menu_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  categoryId: text('categoryId').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: text('price').notNull(), // Storing as text for flexibility, or could be decimal
  image: text('image'),
  available: boolean('available').default(true),
  dietary: text('dietary').array().default([]), // ['vegetarian', 'vegan', 'gluten-free']
  order: integer('order').default(0),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  memberships: many(memberships),
  authenticators: many(authenticators),
  passwordResetTokens: many(passwordResetTokens),
}));

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

export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  members: many(memberships),
  details: one(tenantDetails, {
    fields: [tenants.id],
    references: [tenantDetails.tenantId],
  }),
  categories: many(categories),
}));

export const tenantDetailsRelations = relations(tenantDetails, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantDetails.tenantId],
    references: [tenants.id],
  }),
}));

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

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

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
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type TenantDetails = typeof tenantDetails.$inferSelect;
export type NewTenantDetails = typeof tenantDetails.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
