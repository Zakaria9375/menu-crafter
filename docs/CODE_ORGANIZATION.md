# Code Organization Guide

## Overview

The codebase follows a modular, scalable architecture with clear separation of concerns. Actions are organized by domain/feature into focused files.

## Directory Structure

```text
src/lib/
├── auth/
│   ├── actions/
│   │   ├── index.ts               ← Re-exports all auth actions
│   │   ├── register.ts            ← User registration (40 lines)
│   │   ├── login.ts               ← User login (43 lines)
│   │   ├── sign-out.ts            ← User sign out (11 lines)
│   │   ├── password-reset.ts      ← Password reset request (68 lines)
│   │   └── change-password.ts     ← Password change (57 lines)
│   └── index.ts                   ← NextAuth configuration
├── db/
│   ├── actions/
│   │   ├── index.ts               ← Re-exports all db actions
│   │   ├── users.ts               ← User CRUD (81 lines)
│   │   ├── tenants.ts             ← Tenant operations (93 lines)
│   │   ├── memberships.ts         ← Membership queries (64 lines)
│   │   └── password-reset-tokens.ts  ← Password reset token operations (78 lines)
│   ├── schema.ts                  ← Database schema
│   ├── index.ts                   ← Database connection
│   └── seed.ts                    ← Seed script
├── email/
│   ├── index.ts                   ← Email service exports
│   ├── sendPasswordResetEmail.ts  ← Email sender
│   └── templates/
│       └── passwordReset.ts       ← Email HTML template
└── validation/
    ├── login-schema.ts
    ├── register-schema.ts
    ├── password-reset-schema.ts
    ├── change-password-schema.ts
    └── onboarding-schema.ts
```

## Benefits of This Structure

### 1. Single Responsibility Principle ✅

Each file has ONE clear purpose:
- `users.ts` - Only user operations
- `tenants.ts` - Only tenant operations
- `register.ts` - Only registration logic

### 2. Easy Navigation 🗺️

Finding code is intuitive:
- Need user functions? → `src/lib/db/actions/users.ts`
- Need login logic? → `src/lib/auth/actions/login.ts`

### 3. Smaller Files 📏

- **Before:** 259 lines in one file
- **After:** 40-93 lines per file
- **Result:** Easier to read and maintain

### 4. Better Collaboration 👥

- Less merge conflicts
- Clear ownership of files
- Easier code reviews

### 5. Improved Testing 🧪

Test individual modules:

```typescript
// Test only user actions
import { createUser, getUserByEmail } from "@/lib/db/actions/users";

// Test only tenant actions  
import { createTenant } from "@/lib/db/actions/tenants";
```

### 6. Scalability 📈

Easy to add new actions:

```typescript
// Add new action in appropriate file
// src/lib/db/actions/users.ts
export const updateUserProfile = async (...) => { ... }

// Automatically available via index
import { updateUserProfile } from "@/lib/db/actions";
```

## Import Patterns

### Database Actions

```typescript
// Import specific actions
import { createUser, getUserByEmail } from "@/lib/db/actions";

// Import from specific module (if you prefer)
import { createUser } from "@/lib/db/actions/users";
import { createTenant } from "@/lib/db/actions/tenants";

// Import multiple from different modules
import { createUser } from "@/lib/db/actions/users";
import { getUserMemberships } from "@/lib/db/actions/memberships";
```

### Auth Actions

```typescript
// Import specific actions
import { registerAction, signInAction } from "@/lib/auth/actions";

// Import from specific module
import { registerAction } from "@/lib/auth/actions/register";
import { passwordResetAction } from "@/lib/auth/actions/password-reset";
```

## File Breakdown

### Database Actions

#### `users.ts` (81 lines)

- `createUser(name, email, passwordHash)` - Create new user
- `getUserByEmail(email)` - Get user by email
- `updateUserPassword(userId, passwordHash)` - Update password

#### `tenants.ts` (93 lines)

- `getTenantBySubdomain(slug)` - Get tenant by slug
- `createTenant(name, phone, address, slug, userId)` - Create tenant with owner

#### `memberships.ts` (64 lines)

- `getUserMemberships(userId)` - Get user's memberships
- `getUserMembershipsWithTenants(userId)` - Get memberships with tenant info

#### `password-reset-tokens.ts` (78 lines)

- `createPasswordResetToken(values)` - Create reset token
- `getPasswordResetToken(token)` - Get token by string
- `deletePasswordResetToken(token)` - Delete used token

### Auth Actions

#### `register.ts` (40 lines)

- `registerAction(data)` - Handle user registration

#### `login.ts` (43 lines)

- `signInAction(data)` - Handle user login

#### `sign-out.ts` (11 lines)

- `signOutAction()` - Handle user sign out

#### `password-reset.ts` (68 lines)

- `passwordResetAction(data)` - Request password reset, send email

#### `change-password.ts` (57 lines)

- `changePasswordAction(data, token)` - Change password with token

## Adding New Actions

### Step 1: Determine Category

- User-related? → `db/actions/users.ts`
- Tenant-related? → `db/actions/tenants.ts`
- New category? → Create new file (e.g., `db/actions/menus.ts`)

### Step 2: Add Function

```typescript
// src/lib/db/actions/menus.ts (new file)
"use server";

import { IActionResult } from "@/types/ITypes";
import db from "..";
import { menus } from "../schema";
import type { Menu } from "../schema";
import { success, failure } from "@/utils/actionResult";

export const createMenu = async (...) => {
  // Implementation
};

export const getMenuById = async (...) => {
  // Implementation
};
```

### Step 3: Export in Index

```typescript
// src/lib/db/actions/index.ts
export {
  createMenu,
  getMenuById,
} from "./menus";
```

### Step 4: Use Anywhere

```typescript
import { createMenu } from "@/lib/db/actions";
```

## Backward Compatibility

✅ **All existing imports still work!**

The index files re-export everything, so code using:

```typescript
import { createUser } from "@/lib/db/actions";
```

...continues to work without any changes.

## Best Practices

### DO ✅

- Keep related functions together in the same file
- Use descriptive file names
- Export via index.ts
- Keep files under 150 lines
- Add JSDoc comments
- Use consistent naming

### DON'T ❌

- Mix unrelated functions in one file
- Create overly granular files (one function per file)
- Duplicate code across files
- Import from specific files outside the module
- Skip the index.ts re-export

## Migration Complete

**Old Structure:**

```
src/lib/
├── auth/
│   └── actions.ts  (180 lines) ❌
└── db/
    └── actions.ts  (259 lines) ❌
```

**New Structure:**

```
src/lib/
├── auth/
│   └── actions/
│       ├── index.ts (11 lines)
│       ├── register.ts (40 lines)
│       ├── login.ts (43 lines)
│       ├── sign-out.ts (11 lines)
│       ├── password-reset.ts (68 lines)
│       └── change-password.ts (57 lines)
└── db/
    └── actions/
        ├── index.ts (38 lines)
        ├── users.ts (81 lines)
        ├── tenants.ts (93 lines)
        ├── memberships.ts (64 lines)
        └── password-reset-tokens.ts (78 lines)
```

**Improvements:**

- ✅ 439 lines → 584 lines across 10 focused files
- ✅ Average file size: ~58 lines (down from ~220 lines)
- ✅ Zero breaking changes
- ✅ All imports still work
- ✅ No linting errors
- ✅ Clear separation of concerns
- ✅ Ready to scale

## Next Features

When you add new features, create new action files:

- **Menu Management:** `src/lib/db/actions/menus.ts`
- **Categories:** `src/lib/db/actions/categories.ts`
- **Menu Items:** `src/lib/db/actions/menu-items.ts`
- **QR Codes:** `src/lib/db/actions/qr-codes.ts`
- **Analytics:** `src/lib/db/actions/analytics.ts`

Each feature gets its own well-organized file! 🚀

---

**Your codebase is now organized for growth!** 📦✨

