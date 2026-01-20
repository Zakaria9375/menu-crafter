# MenuCrafter — Development Prompt

Use this prompt with AI code generators (v0.dev, bolt.new, Cursor) to scaffold the full application.

---

## Project Overview

Build **MenuCrafter**, a multi-tenant SaaS for restaurants to manage digital menus, enable QR-based table ordering, and view analytics.

**Tech Stack (Required)**:

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Vercel + Neon Postgres

---

## Database Schema (MUST USE EXACTLY)

```typescript
// === ENUMS ===
export const orderStatusEnum = pgEnum("order_status", [
	"PENDING",
	"CONFIRMED",
	"PREPARING",
	"READY",
	"SERVED",
	"COMPLETED",
	"CANCELLED",
]);
export const orderTypeEnum = pgEnum("order_type", [
	"DINE_IN",
	"TAKEOUT",
	"DELIVERY",
]);

// === TENANTS ===
export const tenants = pgTable("tenants", {
	id: text("id").primaryKey(),
	slug: text("slug").unique().notNull(),
	name: text("name").notNull(),
	isActive: boolean("isActive").default(true),
	plan: text("plan").default("FREE"),
	createdAt: timestamp("createdAt").defaultNow(),
});

export const tenantSettings = pgTable("tenant_settings", {
	tenantId: text("tenantId")
		.primaryKey()
		.references(() => tenants.id),
	branding: json("branding"),
	socials: json("socials"),
	features: json("features"),
	currency: text("currency").default("USD"),
	locales: json("locales")
		.$type<{ default: string; supported: string[] }>()
		.default({ default: "en", supported: [] }),
	timezone: text("timezone").default("UTC"),
});

// === USERS & MEMBERSHIPS ===
export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").unique().notNull(),
	name: text("name"),
	passwordHash: text("passwordHash").notNull(),
	createdAt: timestamp("createdAt").defaultNow(),
});

export const memberships = pgTable(
	"memberships",
	{
		userId: text("userId").references(() => users.id),
		tenantId: text("tenantId").references(() => tenants.id),
		role: text("role").notNull(), // OWNER, MANAGER, WAITER
	},
	(t) => ({ pk: primaryKey(t.userId, t.tenantId) }),
);

// === MENU ===
export const categories = pgTable("categories", {
	id: text("id").primaryKey(),
	tenantId: text("tenantId").notNull(),
	name: text("name").notNull(),
	order: integer("order").default(0),
	isActive: boolean("isActive").default(true),
	availability: json("availability"),
});

export const menuItems = pgTable("menu_items", {
	id: text("id").primaryKey(),
	tenantId: text("tenantId").notNull(),
	categoryId: text("categoryId").references(() => categories.id),
	name: text("name").notNull(),
	description: text("description"),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	image: text("image"),
	isSoldOut: boolean("isSoldOut").default(false),
	availability: json("availability"),
});

export const modifierGroups = pgTable("modifier_groups", {
	id: text("id").primaryKey(),
	tenantId: text("tenantId").notNull(),
	name: text("name").notNull(),
	minSelection: integer("minSelection").default(0),
	maxSelection: integer("maxSelection"),
});

export const modifierOptions = pgTable("modifier_options", {
	id: text("id").primaryKey(),
	groupId: text("groupId").references(() => modifierGroups.id),
	name: text("name").notNull(),
	priceAdjustment: decimal("priceAdjustment", {
		precision: 10,
		scale: 2,
	}).default("0"),
});

export const itemModifiers = pgTable(
	"item_modifiers",
	{
		itemId: text("itemId").references(() => menuItems.id),
		groupId: text("groupId").references(() => modifierGroups.id),
		order: integer("order"),
	},
	(t) => ({ pk: primaryKey(t.itemId, t.groupId) }),
);

// === TABLES ===
export const tables = pgTable("tables", {
	id: text("id").primaryKey(),
	tenantId: text("tenantId").notNull(),
	name: text("name").notNull(),
	zone: text("zone"),
	capacity: integer("capacity"),
	qrCodeToken: text("qrCodeToken").unique(),
});

// === ORDERS ===
export const orders = pgTable("orders", {
	id: text("id").primaryKey(),
	tenantId: text("tenantId").notNull(),
	tableId: text("tableId").references(() => tables.id),
	status: orderStatusEnum("status").default("PENDING"),
	type: orderTypeEnum("type").default("DINE_IN"),
	totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
	customerName: text("customerName"),
	customerPhone: text("customerPhone"),
	paymentStatus: text("paymentStatus").default("UNPAID"),
	createdAt: timestamp("createdAt").defaultNow(),
	updatedAt: timestamp("updatedAt").defaultNow(),
});

export const orderItems = pgTable("order_items", {
	id: text("id").primaryKey(),
	orderId: text("orderId").references(() => orders.id),
	menuItemId: text("menuItemId").references(() => menuItems.id),
	quantity: integer("quantity").notNull(),
	unitPrice: decimal("unitPrice").notNull(),
	notes: text("notes"),
	modifiers: json("modifiers"),
});

// === ANALYTICS ===
export const analyticsEvents = pgTable("analytics_events", {
	id: text("id").primaryKey(),
	tenantId: text("tenantId").notNull(),
	sessionId: text("sessionId").notNull(),
	eventType: text("eventType").notNull(),
	metadata: json("metadata"),
	createdAt: timestamp("createdAt").defaultNow(),
});

export const dailyStats = pgTable(
	"daily_stats",
	{
		tenantId: text("tenantId").notNull(),
		date: date("date").notNull(),
		totalViews: integer("totalViews").default(0),
		totalOrders: integer("totalOrders").default(0),
		totalRevenue: decimal("totalRevenue").default("0"),
	},
	(t) => ({ pk: primaryKey(t.tenantId, t.date) }),
);
```

---

## Routes to Implement

### Public Routes

| Route                  | Description                   |
| ---------------------- | ----------------------------- |
| `/`                    | Marketing homepage            |
| `/pricing`             | Pricing tiers                 |
| `/login`               | Login form                    |
| `/register`            | Registration form             |
| `/[tenant]`            | Public menu view for a tenant |
| `/[tenant]/item/[id]`  | Item detail page              |
| `/[tenant]/cart`       | Shopping cart                 |
| `/[tenant]/order/[id]` | Order confirmation            |

### Protected Routes (Admin Dashboard)

| Route                       | Description                            |
| --------------------------- | -------------------------------------- |
| `/[tenant]/admin`           | Dashboard overview                     |
| `/[tenant]/admin/menu`      | Menu manager (categories + items CRUD) |
| `/[tenant]/admin/tables`    | Table management + QR codes            |
| `/[tenant]/admin/orders`    | Order management (Kanban)              |
| `/[tenant]/admin/analytics` | Charts and stats                       |
| `/[tenant]/admin/settings`  | Business settings, branding, languages |
| `/[tenant]/admin/website`   | Website editor                         |

---

## Core Features to Build

1. **Auth**: Email/password login, registration, password reset, session management
2. **Onboarding**: Multi-step wizard to create tenant (name, slug, type, contact)
3. **Menu CRUD**: Create/edit/delete categories and items with drag-to-reorder
4. **Modifiers**: Attach modifier groups to items (e.g., "Size", "Toppings")
5. **Table Ordering**: Customer scans QR → views menu → adds to cart → submits order
6. **Order Flow**: Staff sees orders in real-time, updates status (Kanban board)
7. **Analytics**: Track page views, item views, orders; aggregate into daily stats
8. **Multi-language**: Store translations in JSON, UI to edit translations

---

## Implementation Notes

- Use Server Actions for all mutations
- Implement Row-Level Security: every query must filter by `tenantId`
- Use `next-intl` for i18n
- Use `recharts` for analytics charts
- Use `qrcode.react` for QR generation
- Validate all forms with `zod`

---

## Folder Structure (Suggested)

```
src/
├── app/
│   ├── (public)/           # Marketing pages
│   ├── (auth)/             # Login, register
│   ├── [tenant]/           # Public menu
│   └── [tenant]/admin/     # Dashboard
├── components/
│   ├── ui/                 # shadcn components
│   ├── menu/               # Menu-specific components
│   ├── orders/             # Order components
│   └── admin/              # Dashboard components
├── lib/
│   ├── db/
│   │   ├── schema/         # Drizzle schema files
│   │   └── actions/        # Server actions
│   └── auth/               # NextAuth config
└── types/                  # TypeScript interfaces
```

---

Start by scaffolding the database schema, then build the public menu view, then the admin dashboard.
