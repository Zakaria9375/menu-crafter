# Onboarding Flow Documentation

## Overview

The onboarding flow now uses server actions instead of API routes, with smart redirects based on user's tenant membership status.

## User Flow

### 1. New User (No Tenants)

```
Login/Register → Onboarding Page → Create Tenant → Tenant Dashboard
```

**Flow:**
1. User registers or logs in
2. Middleware detects no tenants → redirects to `/onboarding`
3. User fills onboarding form
4. Server action creates tenant and membership
5. User redirected to `/{tenant-slug}/admin/dashboard`

### 2. Existing User (Has Tenants)

```
Login → First Tenant Dashboard
```

**Flow:**
1. User logs in
2. Middleware detects existing tenants → redirects to first tenant's dashboard
3. User lands on `/{first-tenant-slug}/admin/dashboard`

### 3. User Tries to Access Onboarding With Existing Tenants

```
Visit /onboarding → Redirect to Dashboard
```

**Flow:**
1. User visits onboarding page
2. Server component checks memberships
3. Redirects to `/{first-tenant-slug}/admin/dashboard`

## Implementation Details

### Onboarding Form

**File:** `src/app/[locale]/(protected)/onboarding/OnboardingForm.tsx`

**Uses:**
- `createTenantAction()` - Server action from `./actions.ts`
- No API calls
- Direct server-side database operations

**Features:**
- ✅ Loading state with spinner
- ✅ Error handling
- ✅ Form validation
- ✅ Automatic redirect after success

### Onboarding Actions

**File:** `src/app/[locale]/(protected)/onboarding/actions.ts`

```typescript
export async function createTenantAction(
  businessName: string,
  phoneNumber: string,
  address: string,
  tenantSlug: string
): Promise<IActionResult<Tenant>>
```

**Features:**
- ✅ Gets userId from session automatically
- ✅ Validates authentication
- ✅ Calls `createTenant` from db actions
- ✅ Returns IActionResult

### Middleware Logic

**File:** `src/middlewares/app.ts`

**Auth Page Redirect Logic:**

```typescript
if (isAuthPage(pathNoLocale)) {
  if (loggedIn) {
    const memberships = session?.user?.memberships || [];
    
    if (memberships.length > 0) {
      // Redirect to first tenant's dashboard
      return redirect(`/${locale}/${memberships[0].slug}/admin/dashboard`);
    } else {
      // Redirect to onboarding
      return redirect(`/${locale}/onboarding`);
    }
  }
  return intlMiddleware(req);
}
```

**Tenant Route Check:**

```typescript
if (memberships.length === 0) {
  // User has no tenants → onboarding
  return redirect(`/${locale}/onboarding`);
}

if (!hasAccess) {
  // User has tenants but not this one → 403
  return redirect(`/${locale}/forbidden?tenant=${tenantSlug}`);
}
```

## Redirect Matrix

| User State | Current Page | Redirect To | Reason |
|------------|--------------|-------------|--------|
| Not logged in | Any protected | `/login` | Authentication required |
| Logged in, no tenants | Auth pages | `/onboarding` | Needs to create business |
| Logged in, has tenants | Auth pages | `/{slug}/admin/dashboard` | Go to their restaurant |
| Logged in, has tenants | `/onboarding` | `/{slug}/admin/dashboard` | Already has business |
| Logged in, no tenants | Tenant route | `/onboarding` | Create tenant first |
| Logged in, no access | Tenant route | `/forbidden` | Not a member |

## Database Operations

### Creating a Tenant

**Transaction Flow:**

```typescript
1. Check if slug already exists
   ↓
2. Start database transaction
   ↓
3. Create tenant record
   ↓
4. Create membership record (OWNER role)
   ↓
5. Commit transaction
   ↓
6. Return tenant data
```

**Atomicity:** If membership creation fails, tenant creation is rolled back.

## Session Management

### After Tenant Creation

**The issue:** New tenant won't be in the JWT token immediately.

**Solutions:**

1. **Option 1: Force Session Update (Recommended)**

   Trigger a session update after tenant creation:

   ```typescript
   // In OnboardingForm after successful creation
   await update(); // NextAuth's session update function
   ```

2. **Option 2: Manual Redirect**

   Redirect with a full page reload to refresh session:

   ```typescript
   window.location.href = `/${result.data.slug}/admin/dashboard`;
   ```

3. **Option 3: Wait for Next Login**

   Accept that new tenant will show on next login (current implementation).

### Current Implementation

Currently using Option 3. The new tenant will be available:
- ✅ After redirect (middleware will fetch fresh session)
- ✅ On page refresh
- ✅ On next login

## Testing Scenarios

### Scenario 1: New User Registration

```bash
# Steps
1. Register new account
2. Should auto-redirect to /onboarding
3. Fill onboarding form
4. Submit
5. Should redirect to /{tenant-slug}/admin/dashboard
```

### Scenario 2: User Logs In (No Tenants)

```bash
# Steps
1. Login with credentials
2. Should auto-redirect to /onboarding
3. Create tenant
4. Should redirect to dashboard
```

### Scenario 3: User Logs In (Has Tenants)

```bash
# Steps
1. Login with credentials
2. Should auto-redirect to /{first-tenant}/admin/dashboard
3. Skips onboarding completely
```

### Scenario 4: User Manually Visits Onboarding (Has Tenants)

```bash
# Steps
1. Visit /en/onboarding directly
2. Server component checks memberships
3. Auto-redirects to /{first-tenant}/admin/dashboard
```

## Error Handling

### Form Errors

- **Slug already taken** → "This subdomain is already taken"
- **Validation errors** → Field-specific errors
- **Database errors** → "An error occurred. Please try again"

### Session Errors

- **No session** → Redirect to login
- **Session expired** → Redirect to login (middleware handles)

## Security Considerations

✅ **Authentication Check:** Server action validates session  
✅ **Authorization:** Only authenticated users can create tenants  
✅ **Ownership:** Creator automatically becomes OWNER  
✅ **Transaction:** Atomic tenant + membership creation  
✅ **Validation:** All inputs validated with Zod schema  

## API Cleanup

### Removed

- ❌ `/api/onboarding` route (no longer needed)

### Why Server Actions are Better

1. **Type Safety** - Full TypeScript support
2. **No API Routes** - Less code, fewer files
3. **Direct DB Access** - No HTTP overhead
4. **Better DX** - Import and use like any function
5. **Automatic Serialization** - NextJS handles it
6. **Server-side Only** - Can't be called from client accidentally

## Future Enhancements

### Multi-Step Onboarding

Add more steps for restaurant setup:

```typescript
Step 1: Business Info (current)
Step 2: Restaurant Hours
Step 3: Upload Logo
Step 4: Choose Template
Step 5: Invite Team Members
```

### Onboarding Progress

Track which steps are completed:

```typescript
// Add to tenant schema
onboardingCompleted: boolean
onboardingStep: integer
```

### Skip Onboarding

Allow users to skip and complete later:

```typescript
// Create tenant with minimal info
// Allow editing in settings
```

---

**Your onboarding flow is now streamlined and uses modern Next.js patterns!** 🚀

