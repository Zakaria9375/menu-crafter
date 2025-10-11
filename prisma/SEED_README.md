# Database Seeding Guide

## Schema

```sql
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../src/lib/db/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("sessions")
}

model User {
  id             String          @id @default(cuid())
  name           String?
  email          String          @unique
  emailVerified  DateTime?
  image          String?
  passwordHash   String
  accounts       Account[]
  sessions       Session[]
  // Optional for WebAuthn support
  Authenticator  Authenticator[]
  memberships    Membership[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  @@map("users")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
  @@map("verification_tokens")
}

model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  phoneNumber String
  address     String
  // Many users can belong via TenantUser join
  members Membership[]

  @@map("tenants")
}

model Membership  {
  id       String @id @default(cuid())
  tenantId String
  userId   String

  tenant Tenant @relation(fields: [tenantId], references: [id])
  user   User   @relation(fields: [userId], references: [id])

  role     TenantRole @default(MEMBER)
  joinedAt DateTime   @default(now())

  @@unique([tenantId, userId])
  @@map("memberships")
}

enum TenantRole {
  OWNER
  ADMIN
  STAFF
  MEMBER
}

// Optional for WebAuthn support
model Authenticator {
  credentialID         String  @unique
  userId               String
  providerAccountId    String
  credentialPublicKey  String
  counter              Int
  credentialDeviceType String
  credentialBackedUp   Boolean
  transports           String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, credentialID])
}

```

## Overview

The seed file (`seed.ts`) populates your database with test data for development and testing purposes.

## What Gets Seeded

### Users (6 total)

All users have the password: `password123`

| Email | Name | Email Verified | OAuth Provider |
|-------|------|----------------|----------------|
| `john@example.com` | John Doe | ✅ Yes | Google |
| `jane@example.com` | Jane Smith | ✅ Yes | Google |
| `bob@example.com` | Bob Wilson | ✅ Yes | - |
| `alice@example.com` | Alice Johnson | ✅ Yes | - |
| `charlie@example.com` | Charlie Brown | ✅ Yes | - |
| `diana@example.com` | Diana Prince | ❌ No | - |

### Tenants (5 total)

| Name | Slug | URL (local) |
|------|------|-------------|
| Bella Italia Restaurant | `bella-italia` | http://bella-italia.localhost:3000 |
| Sushi Palace | `sushi-palace` | http://sushi-palace.localhost:3000 |
| Burger Heaven | `burger-heaven` | http://burger-heaven.localhost:3000 |
| Vegan Delights | `vegan-delights` | http://vegan-delights.localhost:3000 |
| Cafe Mocha | `cafe-mocha` | http://cafe-mocha.localhost:3000 |

### Memberships (12 total)

#### Bella Italia Restaurant
- **John Doe** - OWNER
- **Jane Smith** - ADMIN
- **Bob Wilson** - STAFF

#### Sushi Palace
- **Jane Smith** - OWNER
- **Alice Johnson** - ADMIN

#### Burger Heaven
- **Charlie Brown** - OWNER
- **Bob Wilson** - MEMBER

#### Vegan Delights
- **Alice Johnson** - OWNER
- **Diana Prince** - STAFF

#### Cafe Mocha
- **John Doe** - OWNER
- **Charlie Brown** - ADMIN
- **Diana Prince** - MEMBER

### Additional Data
- **OAuth Accounts**: 2 (John and Jane with Google provider)
- **Verification Tokens**: 1 (for Diana's unverified email)

---

## How to Run the Seed Script

### Option 1: Run Seed Only
```bash
npm run db:seed
```

### Option 2: Reset Database and Seed
This will drop all data, re-run migrations, and seed:
```bash
npm run db:reset
```

### Option 3: Migrate and Seed
```bash
npm run db:migrate
# The seed will run automatically after migration
```

---

## Testing Scenarios

### Scenario 1: Test Single Tenant Owner
**Login as:** `john@example.com` / `password123`

**Access:**
- Visit http://bella-italia.localhost:3000 (OWNER access)
- Visit http://cafe-mocha.localhost:3000 (OWNER access)
- Visit http://sushi-palace.localhost:3000 (403 - No access)

### Scenario 2: Test Multi-Tenant User
**Login as:** `jane@example.com` / `password123`

**Access:**
- Visit http://bella-italia.localhost:3000 (ADMIN access)
- Visit http://sushi-palace.localhost:3000 (OWNER access)
- Visit http://burger-heaven.localhost:3000 (403 - No access)

### Scenario 3: Test Staff Member
**Login as:** `bob@example.com` / `password123`

**Access:**
- Visit http://bella-italia.localhost:3000 (STAFF access)
- Visit http://burger-heaven.localhost:3000 (MEMBER access)
- Visit http://vegan-delights.localhost:3000 (403 - No access)

### Scenario 4: Test Unverified Email
**Login as:** `diana@example.com` / `password123`

**Access:**
- Email not verified (can test email verification flow)
- Visit http://vegan-delights.localhost:3000 (STAFF access)
- Visit http://cafe-mocha.localhost:3000 (MEMBER access)

### Scenario 5: Test OAuth Integration
**Login as:** `john@example.com` or `jane@example.com`

**Features:**
- These users have linked Google OAuth accounts
- Test social login flows

---

## User-Tenant Matrix

| User | Bella Italia | Sushi Palace | Burger Heaven | Vegan Delights | Cafe Mocha |
|------|--------------|--------------|---------------|----------------|------------|
| John | OWNER | - | - | - | OWNER |
| Jane | ADMIN | OWNER | - | - | - |
| Bob | STAFF | - | MEMBER | - | - |
| Alice | - | ADMIN | - | OWNER | - |
| Charlie | - | - | OWNER | - | ADMIN |
| Diana | - | - | - | STAFF | MEMBER |

---

## Customizing the Seed Data

To modify the seed data, edit `prisma/seed.ts`:

### Add More Users
```typescript
prisma.user.create({
  data: {
    name: 'New User',
    email: 'newuser@example.com',
    passwordHash: hashedPassword,
    emailVerified: new Date(),
  },
}),
```

### Add More Tenants
```typescript
prisma.tenant.create({
  data: {
    name: 'New Restaurant',
    slug: 'new-restaurant',
  },
}),
```

### Add More Memberships
```typescript
prisma.membership.create({
  data: {
    userId: users[0].id,
    tenantId: tenants[0].id,
    role: 'OWNER', // or 'ADMIN', 'STAFF', 'MEMBER'
  },
}),
```

---

## Roles Explained

| Role | Description | Typical Permissions |
|------|-------------|---------------------|
| **OWNER** | Tenant owner | Full access, can delete tenant, manage billing |
| **ADMIN** | Administrator | Can manage members, edit tenant settings |
| **STAFF** | Staff member | Can edit content, limited admin access |
| **MEMBER** | Regular member | Basic access, view-only for most features |

---

## Troubleshooting

### Error: "Unique constraint failed"
**Solution:** Run `npm run db:reset` to clear existing data before seeding.

### Error: "Cannot find module '@prisma/client'"
**Solution:** Generate Prisma client first:
```bash
npx prisma generate
npm run db:seed
```

### Error: "Can't reach database server"
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct in `.env`:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/menucrafter?schema=public"
```

### Seed runs but no data appears
**Solution:** Check if you're connected to the correct database:
```bash
npx prisma studio
```

---

## Cleaning Up

### Remove All Seed Data
```bash
npm run db:reset
```

### Remove Specific Data
Use Prisma Studio:
```bash
npx prisma studio
```
Then manually delete records through the UI.

---

## Production Warning

⚠️ **NEVER run the seed script in production!**

The seed script includes:
- `deleteMany()` operations that clear all data
- Weak passwords for test accounts
- Mock OAuth tokens

Only use this for:
- Local development
- Staging environments
- CI/CD testing

---

## Next Steps

After seeding:

1. **Test Authentication:**
   ```
   Visit: http://localhost:3000/en/auth/login
   Login: john@example.com / password123
   ```

2. **Test Tenant Access:**
   ```
   Visit: http://bella-italia.localhost:3000
   Should see: Bella Italia tenant homepage
   ```

3. **Test Multi-Tenant:**
   ```
   Login as jane@example.com
   Switch between bella-italia and sushi-palace subdomains
   ```

4. **Test Access Control:**
   ```
   Login as bob@example.com
   Try accessing different tenant subdomains
   Verify 403 page for non-member tenants
   ```

---

For more information about the database schema, see `schema.prisma`.

For middleware and routing documentation, see `MIDDLEWARE_DOCUMENTATION.md`.

