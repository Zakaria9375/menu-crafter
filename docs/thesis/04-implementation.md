# Chapter 4: Implementation

> **Chapter Goal**: Document the actual development process, technology stack, and key code implementations

---

## 4.1 Development Environment and Tools

### 4.1.1 Development Setup

**Hardware:**

- Development Machine: [Specify: e.g., Laptop with 16GB RAM, Intel i7]
- Operating System: Windows 11

**Software Tools:**

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x LTS | JavaScript runtime |
| npm | 10.x | Package manager |
| VS Code | Latest | Code editor |
| Git | 2.x | Version control |
| PostgreSQL | 15.x | Database (via Neon) |
| Chrome DevTools | - | Debugging |

**VS Code Extensions:**

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- GitLens

### 4.1.2 Technology Stack

**Frontend:**

```json
{
  "next": "15.1.7",           // Framework
  "react": "19.1.0",          // UI library
  "typescript": "^5",         // Type safety
  "tailwindcss": "^4",        // Styling
  "next-intl": "4.3.9"        // Internationalization
}
```

**Backend:**

```json
{
  "drizzle-orm": "0.44.6",              // ORM
  "@neondatabase/serverless": "1.0.2",  // PostgreSQL driver
  "next-auth": "5.0.0-beta.29",         // Authentication
  "bcryptjs": "3.0.2"                   // Password hashing
}
```

**Full stack in `package.json`:**

```json
// From actual menu-crafter/package.json
{
  "name": "menu-crafter",
  "version": "0.1.0",
  "dependencies": {
    "@auth/drizzle-adapter": "1.11.0",
    "@hookform/resolvers": "5.2.2",
    "@neondatabase/serverless": "1.0.2",
    // ... (full list documented)
  }
}
```

### 4.1.3 Development Workflow

**Git Branching Strategy:**

```
main (production-ready)
  └── dev (development branch)
       ├── feature/auth
       ├── feature/multi-tenant
       ├── feature/menu-management
       └── bugfix/login-redirect
```

**Commit Convention:**

```
feat: Add menu item creation
fix: Resolve subdomain routing issue
docs: Update README with setup instructions
refactor: Simplify middleware logic
```

---

## 4.2 Database Implementation

### 4.2.1 Schema Definition

**File: `src/lib/db/schema.ts`**

```typescript
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

// Memberships (many-to-many)
export const memberships = pgTable('memberships', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: text('tenantId').notNull().references(() => tenants.id),
  userId: text('userId').notNull().references(() => users.id),
  role: tenantRoleEnum('role').notNull().default('MEMBER'),
  joinedAt: timestamp('joinedAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => ({
  uniqueTenantUser: unique().on(table.tenantId, table.userId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  members: many(memberships),
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
```

### 4.2.2 Migrations

**Generated with Drizzle Kit:**

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:push
```

**Example Migration File:**

```sql
-- drizzle/0001_init.sql
CREATE TYPE "TenantRole" AS ENUM ('OWNER', 'ADMIN', 'STAFF', 'MEMBER');

CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE "tenants" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  -- ...
);

CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_tenants_slug" ON "tenants"("slug");
```

### 4.2.3 Database Connection

**File: `src/lib/db/index.ts`**

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

const db = drizzle(pool, { schema });

export default db;
```

---

## 4.3 Authentication Implementation

### 4.3.1 NextAuth.js Configuration

**File: `src/lib/auth/index.ts`**

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/lib/db";
import { getUserByEmail } from "../db/actions";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await getUserByEmail(email as string);

        if (user.succeeded && user.data) {
          const isValid = await bcrypt.compare(
            password as string,
            user.data.passwordHash
          );
          return isValid ? user.data : null;
        }
        return null;
      },
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
```

### 4.3.2 Registration Action

**File: `src/lib/auth/actions/register.ts`**

```typescript
'use server';

import { registerSchema } from '@/lib/validation/register-schema';
import { createUser } from '@/lib/db/actions/users';
import bcrypt from 'bcryptjs';

export async function registerAction(data: unknown) {
  // 1. Validate input
  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    return { 
      success: false, 
      errors: validation.error.flatten().fieldErrors 
    };
  }

  const { name, email, password } = validation.data;

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Create user
  const result = await createUser({
    name,
    email,
    passwordHash,
  });

  if (!result.succeeded) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}
```

### 4.3.3 Login Form Component

**File: `src/app/[locale]/(auth)/login/LoginForm.tsx`**

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/lib/validation/login-schema';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: '/en/onboarding',
    });

    if (result?.error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        {...register('email')} 
        placeholder="Email" 
        error={errors.email?.message}
      />
      <Input 
        {...register('password')} 
        type="password" 
        placeholder="Password"
        error={errors.password?.message}
      />
      <Button type="submit">Log In</Button>
    </form>
  );
}
```

---

## 4.4 Multi-Tenant Middleware Implementation

### 4.4.1 Main Middleware Entry

**File: `src/middleware.ts`**

```typescript
import { NextRequest } from "next/server";
import { appMiddleware } from "./middlewares/app";
import { tenantMiddleware } from "./middlewares/tenant";
import { extractSubdomain } from "./middlewares/helper";

export default async function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request);
  
  if (subdomain) {
    return await tenantMiddleware(request, subdomain);
  }
  
  return await appMiddleware(request, {} as any);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

### 4.4.2 Subdomain Extraction Logic

**File: `src/middlewares/helper.ts`**

```typescript
import { NextRequest } from 'next/server';
import { parse } from 'tldts';

export function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Local development (localhost)
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const match = url.href.match(/https?:\/\/([^.]+)\.localhost/);
    return match ? match[1] : null;
  }

  // Vercel preview deployments (e.g., tenant.branch.vercel.app)
  if (host.includes('.vercel.app')) {
    const parts = host.split('.');
    return parts.length > 3 ? parts[0] : null;
  }

  // Production (use tldts for robust parsing)
  const parsed = parse(host);
  return parsed.subdomain || null;
}
```

### 4.4.3 Tenant Middleware Logic

**File: `src/middlewares/tenant.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { intlMiddleware } from './intl';

export const tenantMiddleware = auth((request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);
  
  if (!subdomain) {
    return intlMiddleware(request);
  }

  // Root path → public restaurant page
  if (pathname === '/' || pathname.startsWith('/en') || pathname.startsWith('/ar')) {
    return NextResponse.rewrite(
      new URL(`/en/${subdomain}/`, request.url)
    );
  }

  // Check authentication for non-public paths
  const user = (request as any).auth;
  
  if (!user) {
    return NextResponse.redirect(new URL('/en/login', request.url));
  }

  // Check tenant membership
  const memberships = user.token?.tenants || [];
  const hasAccess = memberships.some(m => m.slug === subdomain);

  if (!hasAccess) {
    return NextResponse.rewrite(new URL(`/en/${subdomain}/forbidden`, request.url));
  }

  // User has access, rewrite to tenant route
  return NextResponse.rewrite(
    new URL(`/en/${subdomain}${pathname}`, request.url)
  );
});
```

---

## 4.5 Onboarding Flow Implementation

### 4.5.1 Onboarding Form Component

**File: `src/app/[locale]/(protected)/onboarding/OnboardingForm.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { onboardingSchema } from '@/lib/validation/onboarding-schema';
import { createTenantAction } from '@/lib/db/actions/tenants';
import { useRouter } from 'next/navigation';

export function OnboardingForm() {
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const router = useRouter();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(onboardingSchema),
  });

  const slug = watch('slug');

  // Check slug availability as user types
  useEffect(() => {
    if (slug && slug.length > 2) {
      checkSlugAvailability(slug).then(setSlugAvailable);
    }
  }, [slug]);

  const onSubmit = async (data) => {
    const result = await createTenantAction(data);
    
    if (result.success) {
      // Redirect to new tenant dashboard
      router.push(`https://${data.slug}.${window.location.host}/admin/dashboard`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Restaurant Name</label>
        <Input {...register('name')} error={errors.name?.message} />
      </div>

      <div>
        <label>Phone Number</label>
        <Input {...register('phoneNumber')} error={errors.phoneNumber?.message} />
      </div>

      <div>
        <label>Address</label>
        <Textarea {...register('address')} error={errors.address?.message} />
      </div>

      <div>
        <label>Subdomain (your-restaurant.menucrafter.com)</label>
        <div className="flex items-center">
          <Input 
            {...register('slug')} 
            placeholder="bella-italia"
            error={errors.slug?.message}
          />
          <span className=".menucrafter.com">.menucrafter.com</span>
        </div>
        {slugAvailable === true && <span className="text-green-600">✓ Available</span>}
        {slugAvailable === false && <span className="text-red-600">✗ Taken</span>}
      </div>

      <Button type="submit" disabled={!slugAvailable}>
        Create Restaurant
      </Button>
    </form>
  );
}
```

### 4.5.2 Create Tenant Action

**File: `src/lib/db/actions/tenants.ts`**

```typescript
'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { tenants, memberships, tenantDetails } from '@/lib/db/schema';
import { onboardingSchema } from '@/lib/validation/onboarding-schema';

export async function createTenantAction(data: unknown) {
  // 1. Get current user
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Validate input
  const validation = onboardingSchema.safeParse(data);
  if (!validation.success) {
    return { 
      success: false, 
      errors: validation.error.flatten().fieldErrors 
    };
  }

  const { name, slug, phoneNumber, address, email } = validation.data;

  // 3. Check slug availability
  const existing = await db.query.tenants.findFirst({
    where: eq(tenants.slug, slug)
  });

  if (existing) {
    return { success: false, error: 'Subdomain already taken' };
  }

  // 4. Create tenant
  const [tenant] = await db.insert(tenants).values({
    name,
    slug,
    phoneNumber,
    address,
    email: email || session.user.email,
  }).returning();

  // 5. Create tenant details
  await db.insert(tenantDetails).values({
    tenantId: tenant.id,
    businessType: 'RESTAURANT',
    languages: ['en'],
    currencies: ['EUR'],
  });

  // 6. Create membership (user becomes OWNER)
  await db.insert(memberships).values({
    userId: session.user.id,
    tenantId: tenant.id,
    role: 'OWNER',
  });

  // 7. Revalidate cache
  revalidatePath('/');

  return { success: true, data: tenant };
}
```

---

## 4.6 Admin Dashboard Implementation

### 4.6.1 Dashboard Layout

**File: `src/app/[locale]/[tenant]/admin/layout.tsx`**

```typescript
import { DashBoardNavBar } from '@/components/nav/DashBoardNavBar';
import { LeftSideBar } from '@/components/nav/LeftSideBar';

export default function AdminLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: { tenant: string; locale: string };
}) {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <LeftSideBar tenant={params.tenant} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashBoardNavBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 4.6.2 Dashboard Page

**File: `src/app/[locale]/[tenant]/admin/dashboard/page.tsx`**

```typescript
import { auth } from '@/lib/auth';
import { getTenantBySlug } from '@/lib/db/actions/tenants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Menu, QrCode, Eye } from 'lucide-react';

export default async function DashboardPage({
  params
}: {
  params: { tenant: string }
}) {
  const session = await auth();
  const tenant = await getTenantBySlug(params.tenant);

  // Fetch statistics (placeholder)
  const stats = {
    totalViews: 1234,
    totalMenuItems: 45,
    qrScans: 567,
    teamMembers: 3,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{tenant.name} Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Views" 
          value={stats.totalViews} 
          icon={<Eye />}
        />
        <StatsCard 
          title="Menu Items" 
          value={stats.totalMenuItems} 
          icon={<Menu />}
        />
        <StatsCard 
          title="QR Scans" 
          value={stats.qrScans} 
          icon={<QrCode />}
        />
        <StatsCard 
          title="Team Members" 
          value={stats.teamMembers} 
          icon={<Users />}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Activity feed component */}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}
```

---

## 4.7 Internationalization Implementation

### 4.7.1 i18n Configuration

**File: `src/i18n/routing.ts`**

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeCookie: true,
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
```

### 4.7.2 Translation Files

**File: `messages/en.json`**

```json
{
  "auth": {
    "login": "Log In",
    "register": "Sign Up",
    "email": "Email Address",
    "password": "Password",
    "forgotPassword": "Forgot password?"
  },
  "dashboard": {
    "welcome": "Welcome to Menu Crafter",
    "stats": {
      "views": "Total Views",
      "items": "Menu Items",
      "scans": "QR Scans",
      "members": "Team Members"
    }
  },
  "menu": {
    "addItem": "Add Menu Item",
    "editItem": "Edit Item",
    "categories": "Categories",
    "items": "Items"
  }
}
```

**File: `messages/ar.json`**

```json
{
  "auth": {
    "login": "تسجيل الدخول",
    "register": "إنشاء حساب",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "forgotPassword": "هل نسيت كلمة المرور؟"
  },
  "dashboard": {
    "welcome": "مرحبًا بك في Menu Crafter",
    "stats": {
      "views": "إجمالي المشاهدات",
      "items": "عناصر القائمة",
      "scans": "مسح رمز الاستجابة السريعة",
      "members": "أعضاء الفريق"
    }
  }
}
```

### 4.7.3 Using Translations in Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function LoginButton() {
  const t = useTranslations('auth');
  
  return <button>{t('login')}</button>;
}
```

---

## 4.8 Development Challenges and Solutions

### 4.8.1 Challenge: Subdomain Routing on Localhost

**Problem**: Browsers don't recognize `*.localhost` subdomains by default.

**Solution**:

- Modern browsers (Chrome, Firefox) support it natively
- Use `subdomain.localhost:3000` format
- Fallback: Host header parsing for development

```typescript
// Development workaround
if (process.env.NODE_ENV === 'development') {
  const match = url.href.match(/https?:\/\/([^.]+)\.localhost/);
  return match ? match[1] : null;
}
```

### 4.8.2 Challenge: NextAuth.js Session in Middleware

**Problem**: Accessing user session in middleware requires wrapping.

**Solution**: Use `auth()` wrapper from NextAuth.js

```typescript
import { auth } from '@/lib/auth';

export const tenantMiddleware = auth((request: NextRequest) => {
  const user = (request as any).auth;
  // Now have access to user
});
```

### 4.8.3 Challenge: Type Safety with Drizzle ORM

**Problem**: Inferring types from database schema.

**Solution**: Export inferred types

```typescript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Tenant = typeof tenants.$inferSelect;
```

---

## 4.9 Code Quality and Standards

### 4.9.1 Linting and Formatting

**ESLint Configuration:**

```json
// eslint.config.mjs
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**Prettier Configuration:**

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 4.9.2 Code Documentation

**Function Documentation:**

```typescript
/**
 * Creates a new tenant (restaurant) and assigns the current user as OWNER.
 * 
 * @param data - Tenant creation data (name, slug, phone, address)
 * @returns Success result with created tenant or error
 * @throws {Error} If user is not authenticated
 * 
 * @example
 * const result = await createTenantAction({
 *   name: "Bella Italia",
 *   slug: "bella-italia",
 *   phoneNumber: "+371 12345678",
 *   address: "Main Street 1, Riga"
 * });
 */
export async function createTenantAction(data: unknown) {
  // ...
}
```

---

## 4.10 Chapter Summary

This chapter documented:

1. **Development environment** (§4.1): Tools, tech stack, workflow
2. **Database implementation** (§4.2): Schema, migrations, connection
3. **Authentication** (§4.3): NextAuth.js setup, registration, login
4. **Multi-tenant middleware** (§4.4): Subdomain extraction, routing logic
5. **Onboarding flow** (§4.5): Form, validation, tenant creation
6. **Admin dashboard** (§4.6): Layout, stats display
7. **Internationalization** (§4.7): next-intl setup, translations
8. **Challenges** (§4.8): Problems encountered and solutions
9. **Code quality** (§4.9): Linting, formatting, documentation

**Key Takeaways:**

- Next.js 15 provides excellent DX with Server Components and Actions
- Drizzle ORM offers type-safe database access
- Middleware chaining enables clean multi-tenant routing
- next-intl simplifies internationalization

**Lines of Code Written**: ~15,000 (estimated)

**Development Time**: 4 months

**Next Chapter**: Chapter 5 will present testing strategies, results, and evaluation of the implemented system.

---

**Word Count**: ~3,500

**Status**: 📝 Draft

**Last Updated**: October 15, 2025
