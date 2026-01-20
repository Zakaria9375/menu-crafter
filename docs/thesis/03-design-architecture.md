# Chapter 3: System Design and Architecture

> **Chapter Goal**: Present the system architecture, design decisions, and technical specifications

---

## 3.1 System Architecture Overview

### 3.1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────┬───────────────────────────────────────────┬────────┘
         │                                           │
    ┌────▼────────┐                          ┌──────▼────────┐
    │   Browser   │                          │  Mobile App   │
    │  (Customer) │                          │  (Restaurant) │
    └────┬────────┘                          └──────┬────────┘
         │                                           │
         └────────────────┬──────────────────────────┘
                          │
              ┌───────────▼──────────────┐
              │    Vercel Edge Network   │
              │    (CDN + Edge Runtime)  │
              └───────────┬──────────────┘
                          │
              ┌───────────▼──────────────┐
              │   Next.js Application    │
              │  ┌────────────────────┐  │
              │  │    Middleware      │  │
              │  │  - Auth Check      │  │
              │  │  - Tenant Router   │  │
              │  │  - i18n Handler    │  │
              │  └─────────┬──────────┘  │
              │            │              │
              │  ┌─────────▼──────────┐  │
              │  │   App Router        │  │
              │  │  - Server Actions   │  │
              │  │  - API Routes       │  │
              │  │  - Page Components  │  │
              │  └─────────┬──────────┘  │
              └────────────┼──────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼─────┐    ┌─────▼──────┐    ┌────▼──────┐
    │PostgreSQL│    │  NextAuth  │    │  Vercel   │
    │   (Neon) │    │   (Auth)   │    │   Blob    │
    └──────────┘    └────────────┘    └───────────┘
```

### 3.1.2 Architecture Style

**Selected: Monolithic Full-Stack Application**

**Rationale:**

- ✅ Faster development for MVP
- ✅ Easier deployment and maintenance
- ✅ Lower operational complexity
- ✅ Suitable for team size (1-2 developers)
- ✅ Can refactor to microservices later if needed

**Alternative Considered:**

- Microservices: Too complex for current scale
- Serverless: Good fit, but using serverless-ready monolith (Next.js on Vercel)

---

## 3.2 Multi-Tenant Architecture Design

### 3.2.1 Tenant Isolation Strategy

**Chosen Approach: Shared Database, Shared Schema with Row-Level Security**

```sql
-- All tenant data includes tenant_id foreign key
CREATE TABLE menu_items (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  -- ...
);

-- Row-Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON menu_items
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

**Why This Approach:**

- ✅ Cost-effective (single database)
- ✅ Easy backup and maintenance
- ✅ Good performance with proper indexing
- ✅ Suitable for <10,000 tenants
- ✅ Strong isolation via PostgreSQL RLS

**Indexing Strategy:**

```sql
-- Critical for multi-tenant performance
CREATE INDEX idx_menu_items_tenant_id ON menu_items(tenant_id);
CREATE INDEX idx_memberships_tenant_id ON memberships(tenant_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
```

### 3.2.2 Subdomain Routing Architecture

**URL Structure:**

```
Main Application:
- https://menucrafter.com           → Landing page
- https://menucrafter.com/en/login  → Login page
- https://menucrafter.com/en/register → Register

Tenant Subdomains:
- https://bella-italia.menucrafter.com → Restaurant public site
- https://bella-italia.menucrafter.com/admin/dashboard → Admin dashboard
```

**Middleware Flow:**

```typescript
// src/middleware.ts
export default async function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request);
  
  if (subdomain) {
    // Tenant-specific request
    return await tenantMiddleware(request, subdomain);
  }
  
  // Main application request
  return await appMiddleware(request);
}
```

**Internal Rewriting:**

```
External URL: bella-italia.menucrafter.com/menu
                          ↓
Internal Rewrite: /en/bella-italia/menu
                          ↓
File System: app/[locale]/[tenant]/page.tsx
```

**Benefits:**

- ✅ Clean URLs for customers
- ✅ SEO-friendly (each restaurant has own subdomain)
- ✅ Brandable (custom domain support later)
- ✅ Tenant isolation at URL level

---

## 3.3 Database Design

### 3.3.1 Entity-Relationship Diagram

```
┌──────────────┐         ┌──────────────────┐         ┌────────────────┐
│    users     │         │   memberships    │         │    tenants     │
├──────────────┤         ├──────────────────┤         ├────────────────┤
│ id (PK)      │────────<│ user_id (FK)     │>────────│ id (PK)        │
│ name         │         │ tenant_id (FK)   │         │ name           │
│ email (UQ)   │         │ role (ENUM)      │         │ slug (UQ)      │
│ passwordHash │         │ joined_at        │         │ phone          │
│ created_at   │         └──────────────────┘         │ address        │
│ updated_at   │                                      │ email          │
└──────────────┘                                      │ created_at     │
       │                                              └────────┬───────┘
       │                                                       │
       │                                                       │
       │                                              ┌────────▼─────────────┐
       │                                              │   tenant_details     │
       │                                              ├──────────────────────┤
       │                                              │ id (PK)              │
       │                                              │ tenant_id (FK, UQ)   │
       │                                              │ logo                 │
       │                                              │ business_type        │
       │                                              │ languages []         │
       │                                              │ currencies []        │
       │                                              │ facebook, instagram  │
       │                                              │ ...                  │
       │                                              └──────────────────────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
┌──────▼────────┐                    ┌───────▼───────────────┐
│   sessions    │                    │   accounts (OAuth)    │
├───────────────┤                    ├───────────────────────┤
│ session_token │                    │ userId (FK)           │
│ user_id (FK)  │                    │ provider              │
│ expires       │                    │ providerAccountId     │
└───────────────┘                    │ access_token          │
                                     │ ...                   │
                                     └───────────────────────┘

                                     
        ┌─────────────────┐
        │  menu_items     │
        ├─────────────────┤
        │ id (PK)         │
        │ tenant_id (FK)  │
        │ category_id (FK)│
        │ name            │
        │ description     │
        │ price           │
        │ image_url       │
        │ available       │
        │ created_at      │
        └────────┬────────┘
                 │
        ┌────────▼──────────────────┐
        │ menu_item_translations    │
        ├───────────────────────────┤
        │ id (PK)                   │
        │ menu_item_id (FK)         │
        │ locale                    │
        │ name                      │
        │ description               │
        └───────────────────────────┘
```

### 3.3.2 Key Tables

#### users

Primary authentication table

- Supports both email/password and OAuth
- Password hashed with bcrypt (cost factor: 10)

#### tenants

Core tenant entity

- `slug`: Unique identifier for subdomain
- Must match pattern: `^[a-z0-9-]+$`

#### memberships

Many-to-many relationship between users and tenants

- role: OWNER | ADMIN | STAFF | MEMBER
- Unique constraint on (user_id, tenant_id)

#### tenant_details

Extended tenant information (1-to-1 with tenants)

- Separate table for optional fields
- Reduces NULL values in main tenant table

---

## 3.4 Authentication and Authorization Design

### 3.4.1 Authentication Flow

```
┌─────────┐                                        ┌──────────┐
│ Browser │                                        │  Server  │
└────┬────┘                                        └─────┬────┘
     │                                                   │
     │  1. POST /api/auth/signin                        │
     │    { email, password }                           │
     ├──────────────────────────────────────────────────>│
     │                                                   │
     │                               2. Query database  │
     │                                  Find user by email
     │                                  Verify password (bcrypt)
     │                                                   │
     │                                3. Create session  │
     │                                  Generate JWT     │
     │                                  Store in cookie  │
     │                                                   │
     │  4. Set-Cookie: session-token=<JWT>              │
     │<──────────────────────────────────────────────────┤
     │                                                   │
     │  5. All subsequent requests                       │
     │     Cookie: session-token=<JWT>                   │
     ├──────────────────────────────────────────────────>│
     │                                                   │
     │                               6. Middleware       │
     │                                  Verify JWT       │
     │                                  Attach user to req
     │                                                   │
     │  7. Response with user data                       │
     │<──────────────────────────────────────────────────┤
     │                                                   │
```

### 3.4.2 Authorization Model

**Role-Based Access Control (RBAC)**

| Role | Permissions |
|------|-------------|
| **OWNER** | Full access: manage team, billing, settings, delete tenant |
| **ADMIN** | Manage: menus, QR codes, website, view analytics |
| **STAFF** | Limited: update item availability, view menus |
| **MEMBER** | View-only access |

**Implementation:**

```typescript
// Middleware checks role
export function requireRole(minRole: TenantRole) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (canAccess(userRole, minRole)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
}
```

**Permission Hierarchy:**

```
OWNER > ADMIN > STAFF > MEMBER
```

---

## 3.5 Frontend Architecture

### 3.5.1 Component Structure

```
src/components/
├── ui/                    # Reusable UI components (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
│
├── nav/                   # Navigation components
│   ├── HomeNavBar.tsx
│   ├── DashBoardNavBar.tsx
│   ├── LeftSideBar.tsx
│   └── Footer.tsx
│
├── home/                  # Landing page components
│   ├── Hero.tsx
│   ├── Features.tsx
│   └── ...
│
├── admin/                 # Admin dashboard components
│   ├── profile/
│   │   ├── BusinessInfoTab.tsx
│   │   ├── LanguagesTab.tsx
│   │   └── ...
│   └── VenueSelector.tsx
│
└── i18n/
    └── LanguageSelector.tsx
```

### 3.5.2 State Management

**Approach: Server State + URL State (No Redux)**

**Rationale:**

- Next.js Server Components handle most state
- URL parameters for navigation state
- React Context for theme, language
- Server Actions for mutations

**Example:**

```typescript
// Server Component (default)
async function MenuList({ tenantId }) {
  const items = await db.query.menuItems.findMany({
    where: eq(menuItems.tenantId, tenantId)
  });
  
  return <MenuItemList items={items} />;
}

// Client Component (only when needed)
'use client';
function MenuItemList({ items }) {
  const [filter, setFilter] = useState('');
  // Client-side filtering for instant UX
}
```

---

## 3.6 Middleware Design

### 3.6.1 Layered Middleware Architecture

```
Request
  │
  ▼
┌─────────────────────────┐
│  Main Middleware Entry  │
│  - Extract subdomain    │
└──────────┬──────────────┘
           │
     ┌─────┴──────┐
     │            │
┌────▼─────┐  ┌──▼──────────┐
│   App    │  │   Tenant    │
│Middleware│  │ Middleware  │
└────┬─────┘  └──┬──────────┘
     │           │
     └─────┬─────┘
           │
    ┌──────▼────────┐
    │     Intl      │
    │  Middleware   │
    │ - Locale      │
    │ - Redirect    │
    └───────────────┘
```

### 3.6.2 Tenant Middleware Logic

```typescript
// Pseudocode
function tenantMiddleware(request, subdomain) {
  // 1. Look up tenant by subdomain slug
  const tenant = await db.tenants.findOne({ slug: subdomain });
  
  if (!tenant) {
    return NotFoundResponse();
  }
  
  // 2. Check authentication
  const user = await getSessionUser(request);
  
  if (!user) {
    // Public pages allowed, others redirect to login
    if (isPublicPath(request.path)) {
      return rewrite(`/[locale]/[tenant]${request.path}`);
    } else {
      return redirect('/login');
    }
  }
  
  // 3. Check tenant membership
  const membership = user.memberships.find(m => m.tenantId === tenant.id);
  
  if (!membership) {
    return rewrite('/forbidden');
  }
  
  // 4. Attach tenant context to request
  request.tenant = tenant;
  request.role = membership.role;
  
  // 5. Rewrite URL
  return rewrite(`/[locale]/[tenant]${request.path}`);
}
```

---

## 3.7 Internationalization (i18n) Design

### 3.7.1 Translation Architecture

**Two-Layer Translation System:**

1. **UI Translations** (next-intl)
   - Buttons, labels, navigation
   - Stored in: `messages/en.json`, `messages/ar.json`

2. **Content Translations** (Database)
   - Menu items, descriptions
   - Stored in: `menu_item_translations` table

**Structure:**

```
messages/
├── en.json
│   {
│     "auth": {
│       "login": "Log In",
│       "register": "Sign Up"
│     },
│     "menu": {
│       "addItem": "Add Item",
│       "categories": "Categories"
│     }
│   }
└── ar.json
    {
      "auth": {
        "login": "تسجيل الدخول",
        "register": "إنشاء حساب"
      },
      ...
    }
```

### 3.7.2 RTL Support

**Right-to-Left Language Handling:**

```tsx
// Layout automatically adjusts
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

**CSS Adjustments:**

```css
/* Logical properties for RTL support */
.card {
  padding-inline-start: 1rem;  /* left in LTR, right in RTL */
  margin-inline-end: 0.5rem;   /* right in LTR, left in RTL */
}
```

---

## 3.8 API Design

### 3.8.1 Server Actions

**Using Next.js Server Actions for mutations:**

```typescript
// src/lib/db/actions/menu-items.ts
'use server';

export async function createMenuItem(data: NewMenuItem) {
  // 1. Validate input
  const validated = menuItemSchema.parse(data);
  
  // 2. Check permissions
  const session = await auth();
  const hasPermission = await checkPermission(session.user.id, data.tenantId, 'ADMIN');
  
  if (!hasPermission) {
    return { success: false, error: 'Unauthorized' };
  }
  
  // 3. Insert into database
  const [item] = await db.insert(menuItems).values(validated).returning();
  
  // 4. Revalidate cache
  revalidatePath(`/[locale]/[tenant]/menu`);
  
  return { success: true, data: item };
}
```

**Benefits:**

- ✅ Type-safe client-server communication
- ✅ No need for REST API routes
- ✅ Automatic CSRF protection
- ✅ Progressive enhancement

### 3.8.2 REST API (for external integrations)

**Planned endpoints:**

```
GET  /api/v1/tenants/:slug/menu          # Public menu
GET  /api/v1/tenants/:slug/menu/:id      # Single item
POST /api/v1/menu-items                   # Create (auth required)
PUT  /api/v1/menu-items/:id               # Update (auth required)
DEL  /api/v1/menu-items/:id               # Delete (auth required)
```

**Authentication: Bearer token**

```
Authorization: Bearer <API_TOKEN>
```

---

## 3.9 UI/UX Design Principles

### 3.9.1 Design System

**Based on shadcn/ui + Tailwind CSS v4**

**Color Palette:**

```css
:root {
  --primary: 221 83% 53%;     /* Blue */
  --secondary: 38 92% 50%;    /* Orange */
  --accent: 142 71% 45%;      /* Green */
  --destructive: 0 84% 60%;   /* Red */
  --muted: 210 40% 96%;       /* Light Gray */
}
```

**Typography:**

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-heading: 'Cal Sans', Georgia, serif;
```

**Spacing Scale:** 4px, 8px, 16px, 24px, 32px, 48px, 64px

### 3.9.2 Mobile-First Responsive Design

**Breakpoints:**

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

**Design Philosophy:**

1. Design for mobile first
2. Progressive enhancement for larger screens
3. Touch-friendly targets (min 44x44px)
4. Readable text sizes (min 16px)

---

## 3.10 Performance Optimization Design

### 3.10.1 Image Optimization

**Strategy:**

- Use Next.js `<Image>` component (automatic optimization)
- Lazy loading below the fold
- WebP format with fallback
- Responsive images (srcset)

**CDN:**

- Vercel Edge Network for static assets
- Cache-Control headers
- gzip/brotli compression

### 3.10.2 Code Splitting

**Automatic by Next.js:**

- Each route = separate bundle
- Dynamic imports for heavy components
- Third-party libraries code-split

**Example:**

```typescript
// Lazy load chart library (heavy)
const Chart = dynamic(() => import('recharts'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

### 3.10.3 Database Query Optimization

**Strategies:**

1. **Indexes**: All foreign keys indexed
2. **Select only needed columns**: Avoid SELECT *
3. **Pagination**: Limit results to 20-50 items
4. **Connection pooling**: Reuse database connections
5. **Prepared statements**: Via Drizzle ORM

---

## 3.11 Security Design

### 3.11.1 Defense in Depth

**Multiple layers:**

1. **Network**: HTTPS only, HSTS enabled
2. **Application**: CSRF tokens, input validation
3. **Database**: Row-level security, parameterized queries
4. **Authentication**: bcrypt hashing, secure session tokens

### 3.11.2 OWASP Top 10 Mitigation

| Threat | Mitigation |
|--------|------------|
| Injection | Drizzle ORM (parameterized queries) |
| Broken Authentication | NextAuth.js, strong passwords, session management |
| Sensitive Data Exposure | HTTPS, encrypted at rest |
| XML External Entities | Not applicable (no XML parsing) |
| Broken Access Control | Middleware checks, role-based permissions |
| Security Misconfiguration | Secure defaults, no debug in production |
| XSS | React auto-escaping, DOMPurify for rich text |
| Insecure Deserialization | JSON only, schema validation |
| Using Components with Known Vulnerabilities | Regular `npm audit`, Dependabot |
| Insufficient Logging | Structured logging, error tracking (Sentry) |

---

## 3.12 Chapter Summary

This chapter presented:

1. **System architecture** (§3.1): Monolithic full-stack on Next.js/Vercel
2. **Multi-tenant design** (§3.2): Shared database with subdomain routing
3. **Database design** (§3.3): PostgreSQL schema with RLS
4. **Auth/authz** (§3.4): NextAuth.js with RBAC
5. **Frontend architecture** (§3.5): Server Components, minimal client state
6. **Middleware design** (§3.6): Layered architecture for routing
7. **i18n design** (§3.7): Two-layer translation system with RTL support
8. **API design** (§3.8): Server Actions + REST endpoints
9. **UI/UX principles** (§3.9): Mobile-first, accessible design
10. **Performance** (§3.10): Image optimization, code splitting, query optimization
11. **Security** (§3.11): Defense in depth, OWASP Top 10 mitigation

**Design Decisions Justified:**

- Monolithic architecture suitable for MVP and small team
- Shared database multi-tenancy cost-effective for scale
- Server Components reduce JavaScript sent to client
- Subdomain routing provides clean URLs and SEO benefits

**Next Chapter**: Chapter 4 will detail the actual implementation of these designs with code examples.

---

**Word Count**: ~3,000

**Status**: 📝 Draft

**Last Updated**: October 15, 2025
