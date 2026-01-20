# Multi-Tenant Request Flow

This document contains sequence diagrams for different request flow scenarios in the multi-tenant application.

## 1. Subdomain-Based Request Flow

This flow handles requests coming from tenant subdomains (e.g., `cafe-mocha.localhost` or `cafe-mocha.example.com`).

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant TenantService
    participant Database
    participant AppService

    Client->>Middleware: HTTP Request<br/>(subdomain: cafe-mocha.localhost)
    Middleware->>Middleware: extractSubdomain()
    Middleware->>TenantService: tenantMiddleware(tenantSlug)
    TenantService->>Database: SELECT tenant WHERE slug = tenantSlug
    
    alt Tenant Not Found
        Database-->>TenantService: No tenant found
        TenantService-->>Client: 404 Not Found
    else Tenant Found
        Database-->>TenantService: Tenant exists (id, slug)
        
        alt Private Route on Subdomain<br/>(e.g., /admin)
            TenantService-->>Client: 404 Not Found<br/>(Protected routes must use main domain)
        else Public Route on Subdomain<br/>(e.g., /menu, /about)
            TenantService->>AppService: Rewrite to<br/>/{locale}/{tenantSlug}{path}
            AppService->>Database: Query tenant-scoped data
            Database-->>AppService: Public tenant data
            AppService-->>Client: Serve public content
        end
    end
```

**Key Points:**
- Subdomain is extracted from the host header
- Tenant validation happens before route processing
- Private routes (like `/admin`) are blocked on subdomains for security
- Public routes are rewritten to include tenant context

---

## 2. Public Route Handling

Public routes are accessible without authentication (e.g., `/`, `/pricing`, `/contact`).

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant AppService

    Client->>Middleware: HTTP Request<br/>(path: /en/pricing)
    Middleware->>Middleware: Check if route is public
    Middleware->>Middleware: Route is public?<br/>(/pricing, /contact, etc.)
    
    alt Public Route
        Middleware->>AppService: Process public route
        AppService-->>Client: Serve public content<br/>(no auth required)
    else Not Public Route
        Middleware->>Middleware: Continue to other checks<br/>(auth, tenant, protected)
    end
```

**Key Points:**
- No authentication required
- No tenant context needed
- Immediate response without database queries

---

## 3. Auth Page Handling

This flow handles authentication pages like `/login` and `/register`.

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant AuthService
    participant Database
    participant AppService

    Client->>Middleware: HTTP Request<br/>(path: /en/login)
    Middleware->>Middleware: Route is auth page?<br/>(/login, /register)
    Middleware->>AuthService: Get session
    
    alt User Not Logged In
        AuthService-->>Middleware: No session
        Middleware->>AppService: Process auth page
        AppService-->>Client: Show login/register page
    else User Logged In
        AuthService-->>Middleware: Session exists<br/>(userId)
        Middleware->>Database: getUserTenants(userId)<br/>JOIN memberships + tenants
        
        alt User Has Tenants
            Database-->>Middleware: User tenants list<br/>[{slug, name, role}, ...]
            Middleware-->>Client: Redirect to<br/>/{locale}/{firstTenant}/admin/dashboard
        else User Has No Tenants
            Database-->>Middleware: Empty tenants list
            Middleware-->>Client: Redirect to<br/>/{locale}/onboarding
        end
    end
```

**Key Points:**
- If user is already logged in, redirect based on tenant membership
- New users without tenants are sent to onboarding
- Existing users with tenants go to their first tenant's dashboard

---

## 4. Tenant Route Handling (Path-Based)

This flow handles tenant-specific routes accessed via main domain (e.g., `/en/cafe-mocha/admin/dashboard`).

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant AuthService
    participant Database
    participant AppService

    Client->>Middleware: HTTP Request<br/>(path: /en/cafe-mocha/admin/dashboard)
    Middleware->>Middleware: isTenantRoute(path)
    Middleware->>Database: Check tenant exists<br/>(extract slug from path)
    
    alt Tenant Not Found in Path
        Database-->>Middleware: No tenant found
        Middleware->>AppService: Process as regular route
        AppService-->>Client: Serve content
    else Tenant Found in Path
        Database-->>Middleware: Tenant exists<br/>(id, slug)
        Middleware->>AuthService: Get session
        
        alt User Not Logged In
            AuthService-->>Middleware: No session
            Middleware-->>Client: Redirect to login<br/>with callbackUrl parameter
        else User Logged In
            AuthService-->>Middleware: Session exists<br/>(userId)
            Middleware->>Database: getUserTenants(userId)<br/>Check membership
            
            alt User Has No Tenants
                Database-->>Middleware: Empty tenants list
                Middleware-->>Client: Redirect to<br/>/{locale}/onboarding
            else User Doesn't Have Access
                Database-->>Middleware: User tenants<br/>(but slug not in list)
                Middleware-->>Client: Redirect to<br/>/{locale}/forbidden?tenant={slug}
            else User Has Access
                Database-->>Middleware: User tenants + roles<br/>(slug found in list)
                Middleware->>AppService: Process tenant request<br/>(with tenant context)
                AppService->>Database: Query with tenant filter<br/>WHERE tenantId = {tenantId}
                Database-->>AppService: Tenant-scoped data
                AppService-->>Client: Serve tenant content
            end
        end
    end
```

**Key Points:**
- Tenant slug is extracted from URL path (second segment after locale)
- Tenant existence is validated before access control
- User membership is checked via `memberships` table
- All database queries are filtered by tenant ID for data isolation
- Access denied users see a forbidden page with tenant information

---

## 5. Protected Route Handling

This flow handles general protected routes that require authentication but are not tenant-specific.

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant AuthService
    participant AppService

    Client->>Middleware: HTTP Request<br/>(path: /en/settings)
    Middleware->>Middleware: Route is protected?<br/>(not public, not auth, not tenant)
    Middleware->>AuthService: Get session
    
    alt User Not Logged In
        AuthService-->>Middleware: No session
        Middleware-->>Client: Redirect to login<br/>/{locale}/login
    else User Logged In
        AuthService-->>Middleware: Session exists<br/>(userId)
        Middleware->>AppService: Process protected route
        AppService-->>Client: Serve protected content
    end
```

**Key Points:**
- Simple authentication check
- No tenant context required
- Redirects to login if not authenticated

---

## Flow Summary

### Request Routing Decision Tree

1. **Subdomain Present?**
   - Yes → Subdomain-Based Request Flow
   - No → Continue to route classification

2. **Route Type?**
   - Public → Public Route Handling
   - Auth Page → Auth Page Handling
   - Tenant Route → Tenant Route Handling
   - Protected → Protected Route Handling

### Key Components

- **Tenant Identification**: Via subdomain (`cafe-mocha.localhost`) or URL path (`/en/cafe-mocha/...`)
- **Access Control**: Validated through `memberships` table (user-tenant-role relationship)
- **Session Management**: NextAuth sessions stored in `sessions` table
- **Data Isolation**: All tenant queries filtered by tenant ID for multi-tenancy
- **Security**: Private routes blocked on subdomains, must use main domain

