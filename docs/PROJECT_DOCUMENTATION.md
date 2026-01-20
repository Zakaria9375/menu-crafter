# Menu Crafter - Complete Project Documentation

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Multi-Tenant System](#multi-tenant-system)
6. [Authentication & Authorization](#authentication--authorization)
7. [Internationalization](#internationalization)
8. [Project Structure](#project-structure)
9. [Key Features](#key-features)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)

---

## Project Overview

**Menu Crafter** is a modern SaaS platform that enables restaurants to create, manage, and showcase digital QR code menus and custom websites. Built with Next.js 15 and featuring a robust multi-tenant architecture, the application provides restaurant owners with a comprehensive solution for digitizing their menu operations.

### Core Value Proposition

- 🍽️ **Digital Menu Management** - Create and manage restaurant menus with ease
- 📱 **QR Code Generation** - Generate scannable QR codes for contactless dining
- 🌐 **Custom Websites** - Build beautiful, responsive restaurant websites
- 🏢 **Multi-Tenant SaaS** - Each restaurant operates independently with its own subdomain
- 🌍 **Multi-Language Support** - Serve customers in their preferred language
- 📊 **Analytics & Insights** - Track menu views, QR scans, and customer engagement

### Target Audience

- Restaurant owners seeking digital transformation
- Cafe managers and casual dining establishments
- Food truck operators needing quick digital presence
- Chain managers handling multiple locations

---

## Technology Stack

### Frontend

- **Framework:** Next.js 15.1.7 (App Router)
- **React:** 19.1.0
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Forms:** React Hook Form 7.63.0
- **Validation:** Zod 4.1.11, Yup 1.7.1
- **Charts:** Recharts 3.2.1
- **Notifications:** React Toastify 11.0.5

### Backend

- **Runtime:** Node.js
- **API:** Next.js API Routes & Server Actions
- **Authentication:** NextAuth.js v5 (beta)
- **Database ORM:** Drizzle ORM 0.44.6
- **Database:** PostgreSQL (Neon Serverless)

### Internationalization

- **i18n Library:** next-intl 4.3.9
- **Supported Languages:** English (en), Arabic (ar)
- **RTL Support:** Yes (for Arabic)

### Development Tools

- **TypeScript:** 5.x
- **Linting:** ESLint 9
- **Database Migrations:** Drizzle Kit 0.31.5
- **Package Manager:** npm

### Deployment

- **Platform:** Vercel (optimized)
- **Database:** Neon PostgreSQL (serverless)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Application (Edge/Node)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Layer                          │   │
│  │  - Tenant Identification                              │   │
│  │  - Authentication Check                               │   │
│  │  - Route Protection                                   │   │
│  │  - Internationalization                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (Server Components)            │   │
│  │  - Server Actions                                    │   │
│  │  - API Routes                                        │   │
│  │  - Page Components                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Client Components                         │   │
│  │  - Interactive UI                                     │   │
│  │  - Forms & Validation                                 │   │
│  │  - State Management                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Neon)                       │
│  - Users, Tenants, Memberships                              │
│  - Sessions, Accounts                                       │
│  - Tenant-scoped data                                       │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Architecture

The application uses a **hybrid multi-tenant approach**:

1. **Subdomain-Based Routing** (`tenant-slug.menucrafter.com`)
   - Public restaurant websites
   - Tenant identification via subdomain extraction

2. **Path-Based Routing** (`menucrafter.com/en/tenant-slug/admin`)
   - Admin panels and protected routes
   - Tenant identification via URL path segment

### Request Flow

See [MULTI_TENANT_FLOW.md](./MULTI_TENANT_FLOW.md) for detailed sequence diagrams covering:
- Subdomain-based request flow
- Public route handling
- Auth page handling
- Tenant route handling (path-based)
- Protected route handling

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ accounts : "has"
    users ||--o{ sessions : "has"
    users ||--o{ memberships : "belongs to"
    users ||--o{ password_reset_tokens : "has"
    users ||--o{ authenticators : "has"
    
    tenants ||--|| tenant_details : "has"
    tenants ||--o{ memberships : "has"
    
    memberships }o--|| users : "references"
    memberships }o--|| tenants : "references"
    
    users {
        uuid id PK
        string name
        string email UK
        timestamp emailVerified
        string image
        string passwordHash
        timestamp createdAt
        timestamp updatedAt
    }
    
    accounts {
        string provider PK
        string providerAccountId PK
        uuid userId FK
        string type
        string refresh_token
        string access_token
        integer expires_at
        timestamp createdAt
        timestamp updatedAt
    }
    
    sessions {
        string sessionToken PK
        uuid userId FK
        timestamp expires
        timestamp createdAt
        timestamp updatedAt
    }
    
    tenants {
        uuid id PK
        string name
        string slug UK
        string phoneNumber
        string address
        string email
        timestamp createdAt
    }
    
    tenant_details {
        uuid id PK
        uuid tenantId FK UK
        string logo
        enum businessType
        string facebook
        string instagram
        string x
        string whatsapp
        string tiktok
        array languages
        array currency
        string website
        timestamp createdAt
        timestamp updatedAt
    }
    
    memberships {
        uuid id PK
        uuid tenantId FK
        uuid userId FK
        enum role
        timestamp joinedAt
    }
    
    password_reset_tokens {
        uuid id PK
        string email
        string token UK
        uuid userId FK
        timestamp createdAt
        timestamp expires
    }
    
    verification_tokens {
        string identifier PK
        string token PK
        timestamp expires
    }
    
    authenticators {
        uuid userId PK
        string credentialID PK
        string providerAccountId
        string credentialPublicKey
        integer counter
        string credentialDeviceType
        boolean credentialBackedUp
        string transports
    }
```

### Database Tables

#### Core Tables

**users**
- Stores user account information
- Supports email/password and OAuth authentication
- Primary key: `id` (UUID)

**tenants**
- Represents restaurant/business entities
- Each tenant has a unique `slug` used for subdomain/path routing
- Contains basic business information

**tenant_details**
- One-to-one relationship with tenants
- Stores extended tenant information:
  - Logo and branding
  - Business type (RESTAURANT, HOTEL, CAFE, BAR, BAKERY, OTHER)
  - Social media links
  - Supported languages and currencies
  - Website URL

**memberships**
- Join table connecting users and tenants
- Implements many-to-many relationship
- Contains role information (OWNER, ADMIN, STAFF, MEMBER)
- Unique constraint on (tenantId, userId)

#### Authentication Tables

**accounts**
- OAuth provider connections
- Composite primary key: (provider, providerAccountId)
- Stores OAuth tokens and metadata

**sessions**
- Active user sessions
- Managed by NextAuth.js
- Automatically cleaned up on expiration

**password_reset_tokens**
- Temporary tokens for password reset flow
- Time-limited with expiration

**verification_tokens**
- Email verification tokens
- Composite primary key: (identifier, token)

**authenticators**
- WebAuthn credentials for passwordless authentication
- Future feature support

### Enums

**TenantRole**
- `OWNER` - Full access, can manage everything
- `ADMIN` - Manage menus, QR codes, view analytics
- `STAFF` - View dashboard, mark items available/unavailable
- `MEMBER` - Basic access to view tenant information

**BusinessType**
- `RESTAURANT`
- `HOTEL`
- `CAFE`
- `BAR`
- `BAKERY`
- `OTHER`

### Relationships Summary

```
users (1) ──< (many) memberships (many) >── (1) tenants
tenants (1) ── (1) tenant_details
users (1) ──< (many) accounts
users (1) ──< (many) sessions
users (1) ──< (many) password_reset_tokens
users (1) ──< (many) authenticators
```

### Data Isolation Strategy

All tenant-specific queries must include a `tenantId` filter:

```typescript
// Example: Fetching menu items for a tenant
const menuItems = await db
  .select()
  .from(menuItems)
  .where(eq(menuItems.tenantId, currentTenantId));
```

This ensures complete data isolation between tenants at the database level.

---

## Multi-Tenant System

### Tenant Identification Methods

1. **Subdomain Extraction**
   - Extracted from `Host` header
   - Example: `cafe-mocha.localhost` → tenant slug: `cafe-mocha`
   - Used for public restaurant websites

2. **URL Path Extraction**
   - Extracted from URL path segment
   - Example: `/en/cafe-mocha/admin` → tenant slug: `cafe-mocha`
   - Used for admin panels and protected routes

### Access Control Flow

```mermaid
flowchart TD
    A[Request Received] --> B{Subdomain Present?}
    B -->|Yes| C[Extract Tenant Slug]
    B -->|No| D[Check URL Path]
    D --> E{Is Tenant Route?}
    E -->|Yes| C
    E -->|No| F[Process Regular Route]
    C --> G[Validate Tenant Exists]
    G -->|Not Found| H[404 Not Found]
    G -->|Found| I{User Authenticated?}
    I -->|No| J[Redirect to Login]
    I -->|Yes| K[Check User Membership]
    K -->|No Access| L[403 Forbidden]
    K -->|Has Access| M[Process Request with Tenant Context]
```

### Tenant Context

Once a tenant is identified and access is verified, the tenant context is available throughout the request:

```typescript
// Middleware sets tenant context
const tenant = await getTenantBySlug(tenantSlug);
// Tenant ID is used for all subsequent queries
```

### Security Considerations

- **Route Protection:** Private routes (e.g., `/admin`) are blocked on subdomains
- **Membership Verification:** Every tenant route checks user membership
- **Data Isolation:** All queries filtered by tenant ID
- **Session Validation:** Authentication required for protected routes

---

## Authentication & Authorization

### Authentication Methods

1. **Email/Password**
   - Secure password hashing with bcryptjs
   - Password reset via email tokens
   - Email verification support

2. **OAuth (Google)**
   - NextAuth.js OAuth integration
   - Account linking support
   - Automatic account creation

3. **WebAuthn (Future)**
   - Passwordless authentication
   - Authenticators table ready for implementation

### Session Management

- **Storage:** Database-backed sessions (PostgreSQL)
- **Expiration:** Configurable session lifetime
- **Security:** Secure, HTTP-only cookies
- **Refresh:** Automatic session refresh

### Authorization Model

**Role-Based Access Control (RBAC)**

| Role | Permissions |
|------|-------------|
| **OWNER** | Full access - manage everything including billing, team, and settings |
| **ADMIN** | Manage menus, QR codes, view analytics. Cannot manage billing or delete tenant |
| **STAFF** | View dashboard and menus. Can mark items as available/unavailable |
| **MEMBER** | Basic access to view tenant information |

### Permission Checks

```typescript
// Example: Check if user has admin access
const membership = await db
  .select()
  .from(memberships)
  .where(
    and(
      eq(memberships.tenantId, tenantId),
      eq(memberships.userId, userId),
      inArray(memberships.role, ['OWNER', 'ADMIN'])
    )
  );
```

---

## Internationalization

### Supported Languages

- **English (en)** - Default language
- **Arabic (ar)** - Full RTL support

### URL Structure

All routes include locale prefix:
- English: `/en/...`
- Arabic: `/ar/...`

### Implementation

- **Library:** next-intl
- **Message Files:** `messages/en.json`, `messages/ar.json`
- **Locale Detection:** Automatic based on browser settings
- **Locale Cookie:** Persists user language preference

### Usage Example

```typescript
// Server Component
import { useTranslations } from 'next-intl';

const t = useTranslations('home.hero');
return <h1>{t('title')}</h1>;
```

### RTL Support

Arabic automatically applies RTL layout:
```tsx
<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
```

---

## Project Structure

```
menu-crafter/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Internationalized routes
│   │   │   ├── (auth)/               # Authentication routes
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── password-reset/
│   │   │   ├── (protected)/         # Protected routes
│   │   │   │   ├── onboarding/
│   │   │   │   └── profile/
│   │   │   ├── (public)/            # Public routes
│   │   │   │   └── (product)/       # Product pages
│   │   │   └── [tenant]/            # Tenant-specific routes
│   │   │       └── admin/           # Admin panel
│   │   └── api/                     # API routes
│   │       └── auth/                # NextAuth.js
│   ├── components/                  # React components
│   │   ├── admin/                   # Admin components
│   │   ├── home/                    # Landing page components
│   │   ├── nav/                     # Navigation components
│   │   └── ui/                      # Reusable UI components
│   ├── lib/                         # Core libraries
│   │   ├── auth/                    # Authentication logic
│   │   ├── db/                      # Database
│   │   │   ├── schema.ts            # Drizzle schema
│   │   │   ├── actions/             # Server actions
│   │   │   └── seed.ts              # Seed data
│   │   ├── email/                   # Email utilities
│   │   └── validation/              # Zod schemas
│   ├── middlewares/                 # Middleware functions
│   │   ├── app.ts                   # Main app middleware
│   │   ├── tenant.ts                # Tenant middleware
│   │   ├── intl.ts                  # i18n middleware
│   │   └── helper.ts                # Helper functions
│   ├── i18n/                        # Internationalization
│   │   ├── routing.ts               # Route configuration
│   │   ├── navigation.ts            # Navigation helpers
│   │   └── request.ts                # Request config
│   ├── types/                       # TypeScript types
│   └── utils/                       # Utility functions
├── messages/                        # Translation files
│   ├── en.json
│   └── ar.json
├── public/                          # Static assets
├── docs/                            # Documentation
├── DATABASE_SCHEMA.md               # Database schema
├── MULTI_TENANT_FLOW.md            # Request flow diagrams
└── PROJECT_DOCUMENTATION.md         # This file
```

### Key Directories

**`src/app/`** - Next.js App Router pages
- Route groups: `(auth)`, `(protected)`, `(public)`
- Dynamic segments: `[locale]`, `[tenant]`

**`src/components/`** - React components
- Organized by feature/domain
- Reusable UI components in `ui/`

**`src/lib/`** - Core business logic
- Database operations
- Authentication
- Validation schemas
- Email utilities

**`src/middlewares/`** - Request middleware
- Tenant identification
- Authentication checks
- Route protection

---

## Key Features

### 1. Multi-Tenant Architecture
- Subdomain and path-based tenant identification
- Complete data isolation
- Role-based access control

### 2. Authentication System
- Email/password authentication
- Google OAuth integration
- Password reset flow
- Session management

### 3. Onboarding Flow
- Guided restaurant setup
- Tenant creation
- Initial membership assignment

### 4. Admin Dashboard
- Analytics overview
- Quick stats
- Recent activity
- Menu management shortcuts

### 5. Internationalization
- Multi-language support
- RTL layout for Arabic
- Locale-based routing

### 6. Responsive Design
- Mobile-first approach
- Tailwind CSS styling
- Modern UI components

### Future Features (Roadmap)

- Menu management with AI-powered extraction
- QR code generator
- Restaurant website templates
- Theme customization
- Online ordering system
- Table reservation
- Advanced analytics

---

## Development Setup

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd menu-crafter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Required environment variables:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/database
   
   # NextAuth
   AUTH_SECRET=your-secret-key
   AUTH_URL=http://localhost:3000
   
   # OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Email (Optional)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-password
   ```

4. **Set up the database**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Apply migrations
   npm run db:migrate
   
   # Or push schema directly
   npm run db:push
   ```

5. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with sample data

### Database Management

**Drizzle Studio**
```bash
npm run db:studio
```
Opens a visual database browser at `http://localhost:4983`

**Migrations**
```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate
```

---

## Deployment

### Vercel Deployment

1. **Connect repository to Vercel**
   - Import project from Git
   - Configure build settings

2. **Set environment variables**
   - Add all required environment variables in Vercel dashboard

3. **Database setup**
   - Use Neon PostgreSQL (serverless)
   - Update `DATABASE_URL` in Vercel

4. **Deploy**
   ```bash
   npm run deploy
   # Or use Vercel CLI
   vercel --prod
   ```

### Environment Variables for Production

- `DATABASE_URL` - Production PostgreSQL connection string
- `AUTH_SECRET` - Strong random secret (generate with `openssl rand -base64 32`)
- `AUTH_URL` - Production URL (e.g., `https://menucrafter.com`)
- `GOOGLE_CLIENT_ID` - Production OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Production OAuth client secret
- `SMTP_*` - Production email server credentials

### Database Migrations in Production

Run migrations before deployment:
```bash
npm run db:migrate
```

Or use Vercel's build command to run migrations automatically.

### Subdomain Configuration

For subdomain-based routing to work in production:

1. **DNS Configuration**
   - Set up wildcard DNS: `*.menucrafter.com` → Vercel
   - Or configure individual subdomains

2. **Vercel Configuration**
   - Add domain in Vercel dashboard
   - Configure wildcard subdomain support

---

## Additional Resources

### Documentation Files

- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Detailed database schema
- [MULTI_TENANT_FLOW.md](./MULTI_TENANT_FLOW.md) - Request flow sequence diagrams
- [docs/APPLICATION_OVERVIEW.md](./docs/APPLICATION_OVERVIEW.md) - Application overview
- [docs/MIDDLEWARE_DOCUMENTATION.md](./docs/MIDDLEWARE_DOCUMENTATION.md) - Middleware details
- [docs/ONBOARDING_FLOW.md](./docs/ONBOARDING_FLOW.md) - Onboarding process

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

## Contributing

### Code Style

- TypeScript strict mode enabled
- ESLint configuration follows Next.js recommendations
- Prefer server components over client components
- Use server actions for mutations

### Database Changes

1. Update `src/lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review migration files
4. Test locally: `npm run db:push`
5. Commit migration files

### Testing

- Test tenant isolation thoroughly
- Verify authentication flows
- Check multi-language support
- Validate role-based access control

---

## License

See [LICENSE](./LICENSE) file for details.

---

## Support

For questions or issues:
- Check documentation in `/docs`
- Review existing issues
- Create a new issue with detailed information

---

**Last Updated:** January 2025  
**Version:** 0.1.0  
**Status:** Active Development

