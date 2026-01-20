# Development Acceleration Guide

> **Last Updated:** October 14, 2025
> 
> **Purpose:** This document outlines practical strategies, tools, and patterns to accelerate development of the Menu-Crafter application.

---

## Table of Contents

1. [High Impact Actions](#high-impact-actions)
2. [Medium Impact Actions](#medium-impact-actions)
3. [Tools & Automation](#tools--automation)
4. [Recommended Packages](#recommended-packages)
5. [What NOT To Do](#what-not-to-do)
6. [Development Roadmap](#development-roadmap)
7. [Technology Decisions](#technology-decisions)

---

## High Impact Actions

### 1. Extend Database Schema ⭐⭐⭐

**Status:** BLOCKING CORE FEATURES

**Problem:** UI is ready (menu/page.tsx) but has no database backing.

**What's Missing:**
```typescript
// Tables needed in src/lib/db/schema.ts:

- categories (Appetizers, Mains, Desserts, Drinks)
  - id, tenantId, name, slug, displayOrder, createdAt, updatedAt

- menuItems (dishes with prices, descriptions, images)
  - id, tenantId, categoryId, name, slug, description, price, 
    imageUrl, available, createdAt, updatedAt

- menuItemTranslations (multi-language support)
  - id, menuItemId, locale, name, description

- dietaryTags (Vegetarian, Vegan, Gluten-Free, etc.)
  - id, name, slug

- menuItemDietaryTags (many-to-many relationship)
  - menuItemId, dietaryTagId
```

**Action Items:**
- [ ] Add table definitions to schema.ts
- [ ] Run `npm run db:generate` to create migrations
- [ ] Run `npm run db:push` to apply to database
- [ ] Update seed.ts with sample menu data
- [ ] Export TypeScript types for all new tables

**Time Estimate:** 2-3 hours

---

### 2. Server Actions Pattern ⭐⭐⭐

**Status:** CRITICAL - Need consistent CRUD pattern

**Current State:** You have auth actions, but need CRUD actions for all resources.

**Pattern to Implement:**

```typescript
// src/lib/db/actions/menu-items.ts

import { db } from '@/lib/db';
import { menuItems, categories } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// GET all menu items for a tenant
export async function getMenuItems(tenantId: string) {
  try {
    const items = await db.query.menuItems.findMany({
      where: eq(menuItems.tenantId, tenantId),
      with: {
        category: true,
        dietaryTags: true,
        translations: true,
      },
      orderBy: (menuItems, { asc }) => [asc(menuItems.displayOrder)],
    });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: 'Failed to fetch menu items' };
  }
}

// CREATE menu item
export async function createMenuItem(data: NewMenuItem) {
  try {
    const [newItem] = await db.insert(menuItems).values(data).returning();
    revalidatePath('/[locale]/[tenant]/admin/menu');
    return { success: true, data: newItem };
  } catch (error) {
    return { success: false, error: 'Failed to create menu item' };
  }
}

// UPDATE menu item
export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  try {
    const [updated] = await db
      .update(menuItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    revalidatePath('/[locale]/[tenant]/admin/menu');
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: 'Failed to update menu item' };
  }
}

// DELETE menu item
export async function deleteMenuItem(id: string) {
  try {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    revalidatePath('/[locale]/[tenant]/admin/menu');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete menu item' };
  }
}
```

**Action Items:**
- [ ] Create `src/lib/db/actions/menu-items.ts`
- [ ] Create `src/lib/db/actions/categories.ts`
- [ ] Create `src/lib/db/actions/dietary-tags.ts`
- [ ] Add proper TypeScript types
- [ ] Add tenant isolation (security)
- [ ] Add error handling

**Time Estimate:** 3-4 hours

---

### 3. React Hook Form + Zod Integration ⭐⭐⭐

**Status:** UNBLOCKS ALL CRUD UIs

**Current State:** Packages installed, but no reusable form components.

**Create Validation Schemas:**

```typescript
// src/lib/validation/menu-item-schema.ts

import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  categoryId: z.string().uuid('Invalid category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  available: z.boolean().default(true),
  dietaryTags: z.array(z.string()).optional(),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
```

**Create Reusable Form Component:**

```typescript
// src/components/admin/MenuItemForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemSchema, MenuItemFormData } from '@/lib/validation/menu-item-schema';
import { createMenuItem, updateMenuItem } from '@/lib/db/actions/menu-items';
import { useServerAction } from '@/hooks/useServerAction';

export function MenuItemForm({ 
  tenantId, 
  menuItem, 
  onSuccess 
}: MenuItemFormProps) {
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: menuItem || {},
  });

  const { execute, loading } = useServerAction(
    menuItem ? updateMenuItem : createMenuItem
  );

  const onSubmit = async (data: MenuItemFormData) => {
    const result = await execute({ ...data, tenantId });
    if (result.success) {
      onSuccess?.();
      form.reset();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
```

**Action Items:**
- [ ] Create validation schemas for all entities
- [ ] Build reusable form components
- [ ] Add loading states and error handling
- [ ] Implement optimistic updates
- [ ] Add image upload to forms

**Time Estimate:** 4-5 hours

---

### 4. Image Upload Solution ⭐⭐⭐

**Status:** BLOCKING CORE FEATURE (menu items need images)

**Decision Required:** Pick ONE solution

#### Option A: Vercel Blob (Recommended - Fastest)

**Pros:**
- 5 minutes to set up
- Built-in Next.js integration
- Free tier: 500MB storage
- Automatic CDN delivery

**Setup:**
```bash
npm install @vercel/blob
```

```typescript
// src/app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
```

**Cost:** Free for development, scales with usage

#### Option B: Uploadthing (Best DX)

**Pros:**
- Excellent React hooks
- Free tier: 2GB storage
- Automatic optimization
- Built-in image transformations

**Setup:**
```bash
npm install uploadthing @uploadthing/react
```

**Cost:** Free tier generous, then $10/month

#### Option C: Azure Blob Storage (Cheapest at Scale)

**Pros:**
- Most cost-effective at scale (~$0.02/GB/month)
- Full control
- Multi-tenant folder isolation

**Cons:**
- More setup required
- Need to handle CDN separately

**Setup:**
```bash
npm install @azure/storage-blob
```

**Cost:** Pay-as-you-go, very cheap

### **Recommendation:** Start with **Vercel Blob** for speed, migrate to Azure later if needed.

**Action Items:**
- [ ] Choose image upload solution
- [ ] Install package
- [ ] Create upload API route
- [ ] Build image upload component
- [ ] Add to menu item forms
- [ ] Implement multi-tenant folder structure

**Time Estimate:** 2-3 hours (Vercel/Uploadthing), 4-5 hours (Azure)

---

## Medium Impact Actions

### 5. Data Table Component ⭐⭐

**Status:** NEEDED FOR MULTIPLE PAGES

**Problem:** Need sorting, filtering, pagination for menu items, users, orders, etc.

**Solution A: TanStack Table**

```bash
npm install @tanstack/react-table
```

**Solution B: shadcn/ui Data Table** (Recommended)

Matches your existing Radix UI setup. Use the [shadcn data-table recipe](https://ui.shadcn.com/docs/components/data-table).

**Features to Implement:**
- Sorting (by name, price, category)
- Filtering (by category, dietary tags, availability)
- Pagination
- Row actions (edit, delete)
- Bulk actions
- Search

**Action Items:**
- [ ] Install TanStack Table
- [ ] Create reusable DataTable component
- [ ] Add column definitions
- [ ] Implement server-side pagination
- [ ] Add sorting and filtering

**Time Estimate:** 3-4 hours

---

### 6. Form State Management Abstraction ⭐⭐

**Status:** ELIMINATES BOILERPLATE

**Create Custom Hook:**

```typescript
// src/hooks/useServerAction.ts

import { useState } from 'react';
import { toast } from 'react-toastify';

type ServerActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function useServerAction<TInput, TOutput>(
  action: (input: TInput) => Promise<ServerActionResult<TOutput>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (input: TInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await action(input);
      
      if (result.success) {
        toast.success('Success!');
        return result;
      } else {
        setError(result.error || 'An error occurred');
        toast.error(result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
```

**Usage:**
```typescript
const { execute, loading } = useServerAction(createMenuItem);

const onSubmit = async (data) => {
  const result = await execute(data);
  if (result.success) {
    onSuccess();
  }
};
```

**Action Items:**
- [ ] Create useServerAction hook
- [ ] Add toast notifications
- [ ] Add loading states
- [ ] Add error handling
- [ ] Replace manual state management in all forms

**Time Estimate:** 1-2 hours

---

### 7. Optimistic Updates Pattern ⭐⭐

**Status:** IMPROVES UX SIGNIFICANTLY

**Leverage React 19 useOptimistic:**

```typescript
'use client';

import { useOptimistic } from 'react';
import { deleteMenuItem } from '@/lib/db/actions/menu-items';

export function MenuItemList({ items }) {
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, action) => {
      switch (action.type) {
        case 'delete':
          return state.filter(item => item.id !== action.id);
        case 'update':
          return state.map(item => 
            item.id === action.id ? { ...item, ...action.data } : item
          );
        default:
          return state;
      }
    }
  );

  const handleDelete = async (id: string) => {
    addOptimisticItem({ type: 'delete', id });
    await deleteMenuItem(id);
  };

  return (
    <div>
      {optimisticItems.map(item => (
        <MenuItem key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}
```

**Action Items:**
- [ ] Add optimistic updates to menu item list
- [ ] Add optimistic updates to category management
- [ ] Add loading skeletons
- [ ] Handle rollback on error

**Time Estimate:** 2-3 hours

---

## Tools & Automation

### 8. Drizzle Studio ⭐⭐⭐

**Status:** ALREADY INSTALLED

**Usage:**
```bash
npm run db:studio
```

**Benefits:**
- Visual database browser
- Quick data editing during development
- Test data creation
- Relationship visualization
- Query builder

**Action Items:**
- [ ] Use regularly during development
- [ ] Create seed data through Studio
- [ ] Test queries visually

**Time Estimate:** 0 hours (already set up)

---

### 9. Code Generation for CRUD ⭐⭐

**Status:** SAVES HOURS OF REPETITIVE WORK

**Create Generator Script:**

```typescript
// scripts/generate-resource.ts

import * as fs from 'fs';
import * as path from 'path';

type ResourceConfig = {
  name: string;
  fields: Array<{ name: string; type: string; required: boolean }>;
};

function generateSchema(config: ResourceConfig): string {
  return `
export const ${config.name}s = pgTable('${config.name}s', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  tenantId: text('tenantId').notNull().references(() => tenants.id),
  ${config.fields.map(f => `${f.name}: ${f.type}('${f.name}')${f.required ? '.notNull()' : ''}`).join(',\n  ')},
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
});
`;
}

function generateActions(config: ResourceConfig): string {
  // Generate CRUD actions
}

function generateValidation(config: ResourceConfig): string {
  // Generate Zod schema
}

function generateForm(config: ResourceConfig): string {
  // Generate React form component
}

// Usage: tsx scripts/generate-resource.ts menu-item
```

**Action Items:**
- [ ] Create resource generator script
- [ ] Generate template files
- [ ] Add CLI interface
- [ ] Document usage

**Time Estimate:** 4-5 hours (saves 20+ hours long-term)

---

### 10. Better Dev Tools ⭐

**Install Additional Tools:**

```bash
# Auto-generate Zod schemas from Drizzle schema
npm install -D drizzle-zod

# Better environment variable handling
npm install -D @t3-oss/env-nextjs

# API client for testing
npm install -D @tanstack/react-query @tanstack/react-query-devtools
```

**Action Items:**
- [ ] Set up drizzle-zod
- [ ] Configure environment variables properly
- [ ] Add React Query for client-side caching (optional)

**Time Estimate:** 1-2 hours

---

## Recommended Packages

### Image Handling (CHOOSE ONE)

| Package | Setup Time | Free Tier | Best For |
|---------|-----------|-----------|----------|
| `@vercel/blob` | 5 min | 500MB | Quick start, Vercel projects |
| `uploadthing` | 15 min | 2GB | Best DX, built-in components |
| `@azure/storage-blob` | 1-2 hours | Pay-as-you-go | Production, scale, cost |

**Recommendation:** Start with `@vercel/blob`, migrate to Azure if needed.

---

### Data Tables

| Package | Complexity | Features | Best For |
|---------|-----------|----------|----------|
| `@tanstack/react-table` | Medium | Full control | Custom requirements |
| shadcn/ui data-table | Low | Pre-styled | Quick implementation |

**Recommendation:** Use shadcn/ui data-table (matches your UI).

---

### Forms (Current Setup)

✅ **Keep:**
- `react-hook-form` - Excellent performance
- `zod` - Type-safe validation

❌ **Remove:**
- `yup` - You have both zod and yup, pick one (zod recommended)

---

### Additional Packages to Add

```bash
# Date formatting
npm install date-fns

# QR Code generation
npm install qrcode react-qr-code

# Rich text editor (for menu descriptions)
npm install @tiptap/react @tiptap/starter-kit

# Drag and drop (for menu ordering)
npm install @dnd-kit/core @dnd-kit/sortable

# Currency formatting
npm install dinero.js
```

---

## What NOT To Do

### ❌ Don't Use Headless CMS

**Why:** You're building a specialized CMS for restaurants. Using another CMS adds:
- Extra complexity
- Vendor lock-in
- Additional costs
- Loss of flexibility

**Exception:** Use CMS for marketing pages (blog, help docs) if needed.

---

### ❌ Don't Add GraphQL

**Why:** 
- Server Actions are simpler
- No need for complex query language
- Adds build complexity
- Type safety already handled by TypeScript

**Stick with:** Server Actions + tRPC (if you need more structure)

---

### ❌ Don't Add State Management (Yet)

**Why:**
- React 19 features (useOptimistic, useFormState) are enough
- Server Actions handle most state
- Adds unnecessary complexity

**When to add:** If you have complex client-side state shared across many components.

---

### ❌ Don't Microservices (Yet)

**Why:**
- Premature optimization
- Adds deployment complexity
- Harder to debug
- Monolith is fine until you hit scale

**Stick with:** Monolithic Next.js app

---

### ❌ Don't Dockerize (Yet)

**Why:**
- Vercel deployment is simpler
- No need for container orchestration
- More moving parts

**When to add:** If you move off Vercel or need custom infrastructure.

---

### ❌ Don't Write Tests (Initially)

**Why:**
- Get features working first
- Requirements are still changing
- Tests will slow down experimentation

**When to add:** After MVP, when stabilizing for production.

---

## Development Roadmap

### Week 1: Core Infrastructure ✅

**Goal:** Get menu management working end-to-end

- [ ] Extend database schema (menu tables)
- [ ] Set up image upload (Vercel Blob)
- [ ] Create menu item CRUD actions
- [ ] Build MenuItemForm component
- [ ] Connect menu page to real data

**Deliverable:** Working menu management page

---

### Week 2: Reusable Patterns ✅

**Goal:** Create patterns for all CRUD operations

- [ ] Create useServerAction hook
- [ ] Build data table component
- [ ] Add optimistic updates pattern
- [ ] Create form wrapper components
- [ ] Add category management

**Deliverable:** Reusable components and patterns

---

### Week 3: Apply to All Pages ✅

**Goal:** Implement all admin features

- [ ] QR Codes page (generate per table/location)
- [ ] Translation Center (manage menu translations)
- [ ] Settings page (restaurant profile, hours, contact)
- [ ] Analytics page (popular items, revenue)
- [ ] Website customization

**Deliverable:** Full admin dashboard

---

### Week 4: Public Menu & Polish ✅

**Goal:** Customer-facing menu and UX improvements

- [ ] Public menu display page
- [ ] Menu categories and filtering
- [ ] Search functionality
- [ ] Multi-language support
- [ ] Mobile optimization
- [ ] Loading states and animations

**Deliverable:** Customer-facing menu

---

## Technology Decisions

### Headless CMS vs Custom

**Decision:** ❌ Don't use headless CMS

**Rationale:**
- Building a specialized CMS for restaurants
- Need custom business logic (multi-tenancy, permissions, QR codes)
- Already have infrastructure (Drizzle, NextAuth)
- Flexibility and control are paramount

**Use Case for CMS:** Marketing site content only

---

### Image Storage

**Decision:** ✅ Start with Vercel Blob, migrate to Azure if needed

**Rationale:**
- Fastest to implement (5 minutes)
- Free tier sufficient for MVP
- Easy migration path to Azure
- Built-in CDN

**Migration Trigger:** When storage costs > $50/month

---

### Database

**Decision:** ✅ Keep Neon + Drizzle

**Rationale:**
- Already set up
- Drizzle provides excellent TypeScript support
- Neon has good free tier
- Easy to scale

---

### Authentication

**Decision:** ✅ Keep NextAuth v5

**Rationale:**
- Already implemented
- Supports multi-tenancy
- Good OAuth support
- Active community

---

### Forms

**Decision:** ✅ React Hook Form + Zod (remove Yup)

**Rationale:**
- Best performance
- Type-safe validation
- Great DX
- Small bundle size

---

### Styling

**Decision:** ✅ Keep Tailwind + Radix UI

**Rationale:**
- Modern stack
- Accessible components
- Highly customizable
- Good documentation

---

## Quick Wins Checklist

**Do These First (Each < 30 minutes):**

- [ ] Remove `yup` dependency (use only zod)
- [ ] Set up Drizzle Studio shortcut
- [ ] Add `date-fns` for date formatting
- [ ] Create reusable Button loading state
- [ ] Add toast notifications to all forms
- [ ] Create empty state components
- [ ] Add loading skeletons
- [ ] Set up error boundaries

---

## Need Help?

**Common Questions:**

**Q: Which image upload solution should I use?**
A: Start with Vercel Blob. It's 5 minutes to set up and you can always migrate later.

**Q: Should I use a headless CMS?**
A: No. You're building a specialized CMS. Focus on your custom logic.

**Q: How do I handle translations?**
A: Use next-intl (already installed) for UI, and a translations table in your database for menu content.

**Q: What about real-time updates?**
A: Server Actions + revalidation are enough. Add WebSockets only if you need live collaboration.

**Q: Should I add testing?**
A: Not yet. Get features working first, add tests when stabilizing.

---

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [TanStack Table](https://tanstack.com/table)

---

**Last Updated:** October 14, 2025
**Author:** Development Team
**Status:** Living Document (update as decisions are made)

