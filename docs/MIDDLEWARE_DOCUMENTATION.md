# Middleware Documentation

## Overview

This application uses a layered middleware architecture to handle authentication, internationalization (i18n), and multi-tenant routing. The middleware system intelligently routes requests based on subdomain presence, user authentication status, and locale preferences.

## Architecture

```
┌─────────────────────────────────────────────┐
│         Main Middleware Entry Point         │
│         (src/middleware.ts)                 │
└────────────────┬────────────────────────────┘
                 │
                 ├─── Has Subdomain? ──────┐
                 │                          │
         ┌───────▼──────┐          ┌───────▼────────┐
         │ App Middleware│          │Tenant Middleware│
         │(app.ts)       │          │(tenant.ts)      │
         └───────┬───────┘          └────────┬────────┘
                 │                           │
                 └────────┬──────────────────┘
                          │
                  ┌───────▼────────┐
                  │ Intl Middleware│
                  │  (intl.ts)     │
                  └────────────────┘
```

---

## 1. Main Middleware Entry Point

**File:** `src/middleware.ts`

### Purpose
The main middleware acts as a router, determining whether a request should be handled by the app middleware (main application) or tenant middleware (subdomain-based tenant access).

### Logic Flow

```typescript
export default async function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request);
  if(subdomain) {
    return tenantMiddleware(request);
  }
  return appMiddleware(request);
}
```

### Matcher Configuration

```typescript
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}
```

**Excludes:**
- `/api/*` - API routes
- `/trpc/*` - tRPC routes
- `/_next/*` - Next.js internal routes
- `/_vercel/*` - Vercel internal routes
- Files with extensions (e.g., `.png`, `.css`, `.js`)

---

## 2. App Middleware

**File:** `src/middlewares/app.ts`

### Purpose
Handles authentication and routing for the main application (non-tenant requests). Manages public routes, authentication pages, and protected routes.

### Route Categories

#### Public Routes (No Authentication Required)
```typescript
const PUBLIC_EXACT = ["/", "/pricing", "/contact", "/faq", "/terms", "/privacy", "/demo", "/features", "/help-center"];
const PUBLIC_PREFIX: string[] = [];
```

**Examples:**
- `/` - Homepage
- `/en/` - Homepage with locale
- `/pricing` - Pricing page
- `/faq` - FAQ page
- `/contact` - Contact page
- `/terms` - Terms page
- `/privacy` - Privacy page

#### Authentication Pages
```typescript
const AUTH_PAGES = ['/login', '/register', '/password-reset'];
```

**Examples:**
- `/en/login` - Login page
- `/en/register` - Registration page
- `/en/password-reset` - Password reset page

#### Protected Routes
All routes that are not public or auth pages require authentication.

**Examples:**
- `/en/onboarding` - Onboarding flow
- `/en/private/*` - Private user pages

### Logic Flow

```
┌─────────────────────────────────────┐
│ 1. Is Public Route?                 │
│    ✓ Allow access → Apply i18n      │
└────────────────┬────────────────────┘
                 │ No
┌────────────────▼────────────────────┐
│ 2. Is Auth Page?                    │
│    ✓ Logged in? → Redirect to       │
│      /onboarding                     │
│    ✗ Not logged in? → Allow access  │
└────────────────┬────────────────────┘
                 │ No
┌────────────────▼────────────────────┐
│ 3. Is Protected Route?              │
│    ✓ Logged in? → Allow access      │
│    ✗ Not logged in? → Redirect to   │
│      /login                           │
└─────────────────────────────────────┘
```

### Implementation Details

```typescript
export const appMiddleware = auth(async (req: NextRequest) => {
  const loggedIn = !!(req as any).auth;
  const {pathNoLocale, locale} = splitLocale(req.nextUrl.pathname);
  
  // 1) Public → allow
  if (isPublic(pathNoLocale)) {
    return intlMiddleware(req);
  }

  // 2) Visiting an auth page
  if (isAuthPage(pathNoLocale)) {
    if (loggedIn) {
      return NextResponse.redirect(`/${locale}/onboarding`);
    }
    return intlMiddleware(req);
  }

  // 3) Protected: require login
  if (!loggedIn) {
    return NextResponse.redirect(`/${locale}/login`);
  }

  // 4) Authorized
  return intlMiddleware(req);
});
```

---

## 3. Tenant Middleware

**File:** `src/middlewares/tenant.ts`

### Purpose
Handles multi-tenant routing for subdomain-based tenant access. Validates tenant membership and rewrites URLs to tenant-specific routes.

### URL Rewriting Strategy

When a subdomain is detected (e.g., `tenant1.example.com`), the middleware rewrites the URL to include the tenant slug in the path:

```
tenant1.example.com/dashboard → example.com/en/tenant1/dashboard
```

### Logic Flow

```
┌─────────────────────────────────────────────┐
│ Extract Subdomain                           │
│ (e.g., tenant1.example.com → "tenant1")    │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│ Is Root Path (/ or /{locale})?              │
│    ✓ Rewrite to /{locale}/{tenant}/         │
└────────────────┬────────────────────────────┘
                 │ No (specific path)
┌────────────────▼────────────────────────────┐
│ Is User Logged In?                          │
└────────────────┬────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼─────┐    ┌─────▼──────┐
    │   YES    │    │     NO      │
    └────┬─────┘    └─────┬───────┘
         │                │
┌────────▼─────────┐      │
│Has Tenant Access?│      │
│(Check memberships)│      │
└────────┬──────────┘      │
         │                │
    ┌────┴─────┐          │
    │          │          │
┌───▼──┐  ┌───▼───┐  ┌───▼────────┐
│Allow │  │Rewrite│  │Redirect to │
│Access│  │to 403 │  │/login      │
└──────┘  └───────┘  └────────────┘
```

### Implementation Details

```typescript
export const tenantMiddleware = auth((request: NextRequest) => {
  const { pathNoLocale, locale } = splitLocale(request.nextUrl.pathname);
  const tenantSlug = extractSubdomain(request);
  
  if (tenantSlug) {
    // Root path → rewrite to tenant home
    if (pathNoLocale === "/" || pathNoLocale === `/${locale}`) {
      return NextResponse.rewrite(
        new URL(`/${locale}/${tenantSlug}/`, request.url)
      );
    } 
    // Specific path → check authentication and membership
    else {
      const loggedIn = !!(request as any).auth;
      if (loggedIn) {
        const token: any = (request as any).auth?.token;
        const memberships = token?.tenants || [];
        const hasAccess = memberships.some((m) => m.slug === tenantSlug);
        
        if (hasAccess) {
          return NextResponse.rewrite(
            new URL(`${locale}/${tenantSlug}/${request.nextUrl.pathname}`, request.url)
          );
        } else {
          return NextResponse.rewrite(
            new URL(`${locale}/${tenantSlug}/403`, request.url)
          );
        }
      } else {
        return NextResponse.rewrite(
          new URL(`/${locale}/login`, request.url)
        );
      }
    }
  }
  return intlMiddleware(request);
});
```

### Tenant Access Control

**Token Structure:**
```typescript
{
  tenants: [
    { slug: string, id: string, role: string }
  ]
}
```

**Access Rules:**
1. User must be authenticated
2. User's token must include tenant membership with matching slug
3. Role is stored but not currently used for authorization

---

## 4. Helper Functions

**File:** `src/middlewares/helper.ts`

### `splitLocale(pathname: string)`

Extracts locale information from the pathname.

**Returns:**
```typescript
{
  hasLocale: boolean;    // Whether path includes locale
  locale: Locale;        // Extracted locale or default
  pathNoLocale: string;  // Path without locale prefix
}
```

**Examples:**
```typescript
splitLocale("/en/pricing")
// → { hasLocale: true, locale: "en", pathNoLocale: "/pricing" }

splitLocale("/pricing")
// → { hasLocale: false, locale: "en", pathNoLocale: "/pricing" }

splitLocale("/ar/login")
// → { hasLocale: true, locale: "ar", pathNoLocale: "/login" }
```

### `toLocalizedPath(locale: string, pathNoLocale: string)`

Builds a localized path with the locale prefix.

**Examples:**
```typescript
toLocalizedPath("en", "/pricing")    // → "/en/pricing"
toLocalizedPath("ar", "/")           // → "/ar"
toLocalizedPath("en", "/login") // → "/en/login"
```

### `extractSubdomain(request: NextRequest)`

Extracts the subdomain from the request URL.

**Returns:** `string | null`

**Examples:**

| URL | Result |
|-----|--------|
| `http://tenant1.localhost:3000` | `"tenant1"` |
| `http://localhost:3000` | `null` |
| `https://tenant1.example.com` | `"tenant1"` |
| `https://example.com` | `null` |
| `https://tenant1.vercel.app` | `"tenant1"` |

**Logic:**
1. **Local Development:** Handles `localhost` and `127.0.0.1`
   - Extracts from URL pattern `http://[subdomain].localhost`
   - Falls back to host header parsing
2. **Vercel Environment:** Handles nested subdomains (e.g., `tenant.branch.vercel.app`)
   - Takes the first part of nested subdomain
3. **Production:** Uses `tldts` library to parse subdomain

---

## 5. Internationalization Middleware

**File:** `src/middlewares/intl.ts`

### Purpose
Handles internationalization using `next-intl`. Manages locale detection, cookie storage, and URL prefixing.

### Configuration

**File:** `src/i18n/routing.ts`

```typescript
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",      // Always include locale in URL
  localeCookie: true,          // Store locale in cookie
  localeDetection: true,       // Detect from Accept-Language header
});
```

### Supported Locales

| Code | Language | Flag |
|------|----------|------|
| `en` | English  | 🇺🇸 |
| `ar` | Arabic   | 🇸🇦 |

### Behavior

- **URL Structure:** All URLs include locale prefix (e.g., `/en/pricing`, `/ar/login`)
- **Locale Detection:**
  1. Check URL for locale prefix
  2. Check `NEXT_LOCALE` cookie
  3. Check `Accept-Language` header
  4. Fall back to default locale (`en`)
- **Locale Persistence:** Stores user's locale preference in cookie

---

## 6. Complete Request Flow Examples

### Example 1: Unauthenticated User Visits Homepage

```
Request: GET http://example.com/
         ↓
Main Middleware: No subdomain detected → App Middleware
         ↓
App Middleware: Path "/" is public → Allow
         ↓
Intl Middleware: No locale in URL → Redirect to /en/
         ↓
Response: 307 Redirect to /en/
```

### Example 2: Unauthenticated User Visits Protected Page

```
Request: GET http://example.com/en/onboarding
         ↓
Main Middleware: No subdomain detected → App Middleware
         ↓
App Middleware: Path "/onboarding" is protected & user not logged in
         ↓
Response: 307 Redirect to /en/login
```

### Example 3: Authenticated User Visits Login Page

```
Request: GET http://example.com/en/login
         ↓
Main Middleware: No subdomain detected → App Middleware
         ↓
App Middleware: Path "/login" is auth page & user IS logged in
         ↓
Response: 307 Redirect to /en/onboarding
```

### Example 4: Tenant Subdomain - Root Access

```
Request: GET http://tenant1.example.com/
         ↓
Main Middleware: Subdomain "tenant1" detected → Tenant Middleware
         ↓
Tenant Middleware: Path "/" is root → Rewrite
         ↓
Intl Middleware: No locale → Add locale prefix
         ↓
Response: 200 OK (internally rewritten to /en/tenant1/)
```

### Example 5: Tenant Subdomain - Authenticated with Access

```
Request: GET http://tenant1.example.com/dashboard
User: Logged in, member of tenant1
         ↓
Main Middleware: Subdomain "tenant1" detected → Tenant Middleware
         ↓
Tenant Middleware: User authenticated & has membership → Rewrite
         ↓
Response: 200 OK (internally rewritten to /en/tenant1/dashboard)
```

### Example 6: Tenant Subdomain - Authenticated without Access

```
Request: GET http://tenant2.example.com/dashboard
User: Logged in, NOT a member of tenant2
         ↓
Main Middleware: Subdomain "tenant2" detected → Tenant Middleware
         ↓
Tenant Middleware: User authenticated but NO membership → Rewrite to 403
         ↓
Response: 200 OK (internally rewritten to /en/tenant2/403)
```

### Example 7: Tenant Subdomain - Not Authenticated

```
Request: GET http://tenant1.example.com/dashboard
User: Not logged in
         ↓
Main Middleware: Subdomain "tenant1" detected → Tenant Middleware
         ↓
Tenant Middleware: User not authenticated → Rewrite to login
         ↓
Response: 200 OK (internally rewritten to /en/login)
```

---

## 7. Route Reference

### Main Application Routes (No Subdomain)

#### Public Routes
| Path | Description | Auth Required |
|------|-------------|---------------|
| `/` | Homepage | No |
| `/en/` | Homepage (English) | No |
| `/ar/` | Homepage (Arabic) | No |
| `/en/pricing` | Pricing page | No |
| `/en/faq` | FAQ page | No |
| `/en/contact` | Contact page | No |
| `/en/privacy` | Privacy policy | No |
| `/en/terms` | Terms of service | No |
| `/en/demo` | Demo page | No |
| `/en/features` | Features page | No |
| `/en/help-center` | Help center | No |

#### Authentication Routes
| Path | Description | Behavior if Logged In |
|------|-------------|----------------------|
| `/en/login` | Login page | Redirect to `/en/onboarding` |
| `/en/register` | Registration page | Redirect to `/en/onboarding` |
| `/en/password-reset` | Password reset | Redirect to `/en/onboarding` |

#### Protected Routes
| Path | Description | Behavior if Not Logged In |
|------|-------------|--------------------------|
| `/en/onboarding` | Onboarding flow | Redirect to `/en/login` |
| `/en/private/*` | Private user pages | Redirect to `/en/login` |

### Tenant Routes (With Subdomain)

All tenant routes follow the pattern: `http://{tenant-slug}.{domain}/{path}`

| Path | Internal Rewrite | Description |
|------|------------------|-------------|
| `/` | `/en/{tenant}/` | Tenant homepage |
| `/dashboard` | `/en/{tenant}/dashboard` | Tenant dashboard |
| `/admin/*` | `/en/{tenant}/admin/*` | Admin pages |

**Access Control:**
- Root path (`/`) - Public (no authentication required)
- All other paths - Require authentication AND tenant membership

---

## 8. Environment-Specific Behavior

### Local Development
- **URL Format:** `http://{tenant}.localhost:3000`
- **Subdomain Extraction:** Regex pattern matching on full URL and host header
- **Example:** `http://tenant1.localhost:3000/dashboard`

### Vercel Preview Deployments
- **URL Format:** `https://{tenant}.{branch}.vercel.app`
- **Subdomain Extraction:** Splits nested subdomain, takes first part
- **Example:** `https://tenant1.feature-branch.vercel.app`

### Production
- **URL Format:** `https://{tenant}.yourdomain.com`
- **Subdomain Extraction:** Uses `tldts` library for robust parsing
- **Example:** `https://tenant1.menucrafter.com`

---

## 9. Authentication Integration

### Auth Provider
Uses NextAuth.js (v5/Auth.js) for authentication.

### Session Token Structure
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: {
    tenants: Array<{
      id: string;
      slug: string;
      role: string;
    }>;
  };
}
```

### Token Usage in Middleware
- **App Middleware:** Checks `req.auth` to determine if user is logged in
- **Tenant Middleware:** Reads `req.auth.token.tenants` to validate membership

---

## 10. Security Considerations

### Authentication
- All non-public routes require authentication
- Session tokens are validated on every request
- Unauthorized users are redirected to login page

### Tenant Isolation
- Tenant access is validated against token membership list
- Users without membership cannot access tenant resources
- Failed access attempts show 403 page (not redirect to login)

### URL Rewriting vs Redirects
- **Rewrites:** Used for tenant routes (preserves subdomain in browser)
- **Redirects:** Used for auth flow (changes browser URL)

---

## 11. Troubleshooting

### Issue: Infinite Redirect Loop
**Cause:** Middleware redirecting to a protected route
**Solution:** Ensure redirect targets are public or auth pages

### Issue: Subdomain Not Detected Locally
**Cause:** Browser accessing `localhost` without subdomain prefix
**Solution:** Use format `http://{tenant}.localhost:3000`

### Issue: 403 Instead of Login Redirect
**Cause:** Tenant middleware treats non-root paths differently
**Solution:** Expected behavior - tenant pages require both auth AND membership

### Issue: Locale Not Persisted
**Cause:** Cookie not being set
**Solution:** Check `localePrefix: "always"` and `localeCookie: true` in routing config

---

## 12. Future Enhancements

### Potential Improvements
1. **Role-Based Access Control:** Use `role` field in tenant membership for fine-grained permissions
2. **Custom 403 Pages:** Create tenant-specific unauthorized pages
3. **Subdomain Allowlist:** Validate tenant slugs against database before processing
4. **Rate Limiting:** Add rate limiting per subdomain
5. **Analytics:** Track middleware decisions for monitoring
6. **Cache Headers:** Optimize caching strategy for tenant routes

---

## Summary

This middleware system provides:
- ✅ Multi-tenant architecture with subdomain routing
- ✅ Comprehensive authentication flow
- ✅ Internationalization with multiple locales
- ✅ Fine-grained access control
- ✅ Environment-agnostic subdomain detection
- ✅ Clear separation between public, auth, and protected routes

The layered approach keeps the code modular and maintainable while handling complex routing logic.

