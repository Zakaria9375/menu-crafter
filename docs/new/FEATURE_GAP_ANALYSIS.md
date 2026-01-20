# Feature Gap Analysis

> **Document Purpose**: This document identifies missing features required to scale Menu Crafter to **1000s of users** by comparing the current implementation against a complete production-ready SaaS platform.

---

## 1. Implementation Status Overview

### ✅ Implemented Features

| Feature                       | Implementation                                        | Notes                                        |
| ----------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| **Multi-Tenant Architecture** | `src/middlewares/tenant.ts`, `src/middlewares/app.ts` | Subdomain-based routing, tenant isolation    |
| **Authentication**            | `src/lib/auth/index.ts`                               | NextAuth v5, JWT, Credentials + Google OAuth |
| **User Management**           | `src/lib/db/actions/users.ts`                         | CRUD operations                              |
| **Tenant Management**         | `src/lib/db/actions/tenants.ts`                       | Create, read, update tenants                 |
| **Membership/RBAC**           | `src/lib/db/actions/memberships.ts`                   | Owner, Admin, Staff, Member roles            |
| **Menu Categories**           | `src/lib/db/actions/menu.ts`                          | CRUD with ordering                           |
| **Menu Items**                | `src/lib/db/actions/menu.ts`                          | CRUD with ordering, dietary tags             |
| **Tables Management**         | `src/lib/db/actions/tables.ts`                        | CRUD for restaurant tables                   |
| **QR Code Generation**        | `/admin/qr-codes` route                               | Basic QR code display                        |
| **Website Config**            | `src/lib/db/actions/website.ts`                       | JSON-based theme/content storage             |
| **Translations**              | `src/lib/db/actions/translation.ts`                   | i18n content management                      |
| **Password Reset**            | `src/lib/db/actions/password-reset-tokens.ts`         | Token-based flow                             |
| **Internationalization**      | `next-intl`                                           | English + Arabic support                     |
| **Onboarding Flow**           | `/onboarding` route                                   | New tenant setup wizard                      |
| **Admin Dashboard**           | `/admin/dashboard`                                    | Basic layout                                 |

---

## 2. Missing Features (Categorized by Priority)

### 🔴 Critical (Required for Production)

#### 2.1 Image Upload System

**Current State**: `image: text("image")` stores URLs but no upload mechanism exists.

**Required**:

- [ ] Image upload component with drag-and-drop
- [ ] Direct-to-cloud uploads (UploadThing/S3)
- [ ] Image cropping/resizing UI
- [ ] Automatic WebP conversion
- [ ] Image deletion when menu item deleted

**Affected Areas**:

- Menu item images
- Restaurant logo
- Gallery photos
- Hero section images

---

#### 2.2 Public Menu Page

**Current State**: Route exists (`/[tenant]/menu`) but implementation unclear.

**Required**:

- [ ] Responsive public menu view
- [ ] Category navigation
- [ ] Item detail modal/page
- [ ] Dietary filter (vegan, gluten-free)
- [ ] Search functionality
- [ ] Multi-language support
- [ ] Currency display

---

#### 2.3 Error Handling & Loading States

**Current State**: Basic try/catch in server actions.

**Required**:

- [ ] Toast notifications for all mutations
- [ ] Skeleton loading components
- [ ] Error boundary components
- [ ] Optimistic UI updates
- [ ] Retry mechanisms for failed requests

---

### 🟡 High Priority (Required for Scale)

#### 2.4 Bulk Operations

**Current State**: Only single-item CRUD exists in `menu.ts`.

**Required**:

- [ ] Bulk availability toggle ("Mark all as unavailable")
- [ ] Bulk price update ("Increase all by 10%")
- [ ] Bulk delete with confirmation
- [ ] Bulk import from CSV/Excel
- [ ] Bulk export to CSV

---

#### 2.5 Search & Filtering

**Current State**: No search implementation.

**Required**:

- [ ] Admin-side: Search menu items by name
- [ ] Admin-side: Filter by category, availability
- [ ] Public-side: Search menu items
- [ ] Public-side: Filter by dietary tags

**Implementation**: Use Postgres `ILIKE` or `tsvector` for basic search.

---

#### 2.6 Analytics Dashboard

**Current State**: `/admin/analytics` route exists but empty.

**Required**:

- [ ] Menu view counts (per tenant)
- [ ] Popular items chart
- [ ] QR scan tracking
- [ ] Time-based analytics (daily/weekly/monthly)
- [ ] Export analytics data

---

#### 2.7 Team Invitation System

**Current State**: Memberships exist but no invitation flow.

**Required**:

- [ ] Email invitation with secure tokens
- [ ] Role selection during invite
- [ ] Accept/decline invitation page
- [ ] Pending invitations list
- [ ] Resend/revoke invitations

---

#### 2.8 Settings Page

**Current State**: `/admin/settings` route exists but implementation unclear.

**Required**:

- [ ] Business info editing
- [ ] Social media links
- [ ] Currency/language preferences
- [ ] QR code customization
- [ ] Danger zone (delete tenant)

---

### 🟢 Medium Priority (Nice to Have)

#### 2.9 Drag-and-Drop Ordering

**Current State**: `order` field exists but no UI for reordering.

**Required**:

- [ ] Drag-and-drop for categories
- [ ] Drag-and-drop for items within category
- [ ] Persist order changes to database

---

#### 2.10 Website Builder

**Current State**: `websiteConfig` JSON storage exists.

**Required**:

- [ ] Visual theme selector
- [ ] Color picker for brand colors
- [ ] Section visibility toggles
- [ ] Hero image upload
- [ ] About section editor
- [ ] Contact info form

---

#### 2.11 Multi-Currency Support

**Current State**: `currencies` array in tenant_details.

**Required**:

- [ ] Currency selector in settings
- [ ] Price display in selected currency
- [ ] Currency conversion (optional)

---

#### 2.12 Operating Hours

**Current State**: Not implemented.

**Required**:

- [ ] Operating hours table
- [ ] Day-by-day schedule
- [ ] Special hours (holidays)
- [ ] "Open Now" status display

---

### 🔵 Future Phase (Post-MVP)

| Feature                  | Description                        |
| ------------------------ | ---------------------------------- |
| **Online Ordering**      | Cart, checkout, order management   |
| **Payment Integration**  | Stripe Connect for tenant payments |
| **Table Reservations**   | Booking system with calendar       |
| **Push Notifications**   | Order updates, promotions          |
| **Mobile Apps**          | iOS/Android native apps            |
| **Kitchen Display**      | Real-time order queue              |
| **Inventory Management** | Stock tracking, low-stock alerts   |
| **Loyalty Program**      | Points, rewards, discounts         |
| **AI Menu Suggestions**  | GPT-powered descriptions           |
| **Multi-Location**       | Chain restaurant support           |

---

## 3. Database Schema Gaps

Current schema is missing tables/columns for:

| Table/Column           | Purpose                      |
| ---------------------- | ---------------------------- |
| `operating_hours`      | Store daily schedules        |
| `invitations`          | Pending team invitations     |
| `analytics_events`     | Track menu views, scans      |
| `subscriptions`        | Stripe subscription data     |
| `audit_log`            | Track admin actions          |
| `menu_items.variants`  | Size/option variants         |
| `menu_items.modifiers` | Add-ons (extra cheese, etc.) |

---

## 4. Security Gaps

| Gap                           | Risk                  | Recommendation                          |
| ----------------------------- | --------------------- | --------------------------------------- |
| No rate limiting              | DDoS, brute force     | Add Upstash Ratelimit                   |
| No CSRF tokens                | Request forgery       | NextAuth handles session tokens         |
| No input sanitization logging | XSS injection         | Use Zod for all inputs (partially done) |
| No audit logging              | Compliance, debugging | Add audit_log table                     |
| No RLS policies               | Data leakage          | Add Postgres RLS                        |

---

## 5. UX/UI Gaps

| Gap                   | Impact                        |
| --------------------- | ----------------------------- |
| No skeleton loaders   | Perceived slow performance    |
| No empty states       | Confusing when no data exists |
| No onboarding tour    | Users don't discover features |
| No keyboard shortcuts | Power user efficiency         |
| No dark mode          | User preference               |
| No mobile admin       | Can't manage on phone         |

---

## 6. Implementation Roadmap

### Sprint 1: Core Gaps (2 weeks)

1. Image upload system (UploadThing integration)
2. Public menu page with responsive design
3. Error handling + toast notifications

### Sprint 2: Admin Features (2 weeks)

1. Bulk operations for menu
2. Search and filtering
3. Drag-and-drop ordering

### Sprint 3: Team & Settings (1 week)

1. Team invitation flow
2. Settings page completion
3. Operating hours

### Sprint 4: Analytics & Polish (2 weeks)

1. Analytics dashboard
2. Website builder improvements
3. Performance optimization (caching)

---

## 7. Summary

**Total Features Implemented**: ~15 core features
**Critical Gaps**: 3 (Image uploads, Public menu, Error handling)
**High Priority Gaps**: 5 (Bulk ops, Search, Analytics, Invites, Settings)
**Medium Priority Gaps**: 4 (Drag-drop, Website builder, Currency, Hours)

**Estimated Effort**: 7-8 weeks for production-ready MVP
