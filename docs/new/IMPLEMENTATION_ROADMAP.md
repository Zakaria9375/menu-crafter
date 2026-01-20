# Implementation Roadmap

> **Purpose**: Prioritized action plan to evolve Menu Crafter from current state to production-ready scale for 1000s of users.

---

## Phase 1: Infrastructure Foundation (Week 1-2)

### 1.1 Image Upload System

**Priority**: 🔴 Critical

| Task                  | Details                                      |
| --------------------- | -------------------------------------------- |
| Integrate UploadThing | `npm install uploadthing @uploadthing/react` |
| Create upload route   | `/api/uploadthing/route.ts`                  |
| Update menu item form | Add image upload component                   |
| Update tenant details | Add logo upload                              |
| Add image deletion    | Clean up on item delete                      |

### 1.2 Caching with Redis

**Priority**: 🔴 Critical

| Task                 | Details                          |
| -------------------- | -------------------------------- |
| Setup Upstash Redis  | Create account, get credentials  |
| Install packages     | `npm install @upstash/redis`     |
| Create cache utility | `src/lib/cache/index.ts`         |
| Cache public menus   | TTL 5 min, invalidate on edit    |
| Add rate limiting    | `npm install @upstash/ratelimit` |

### 1.3 Error Tracking

**Priority**: 🟡 High

| Task                 | Details                               |
| -------------------- | ------------------------------------- |
| Setup Sentry         | `npx @sentry/wizard@latest -i nextjs` |
| Configure DSN        | Add to environment variables          |
| Add error boundaries | Wrap app in error boundary            |

---

## Phase 2: Core Features (Week 3-4)

### 2.1 Public Menu Page

**Priority**: 🔴 Critical

| Task               | Details                          |
| ------------------ | -------------------------------- |
| Design menu layout | Mobile-first, responsive         |
| Create components  | CategoryNav, ItemCard, ItemModal |
| Add search         | Client-side with Fuse.js         |
| Add filters        | Dietary tags, availability       |
| Add i18n support   | Use next-intl                    |

### 2.2 Admin Improvements

**Priority**: 🟡 High

| Task                    | Details                        |
| ----------------------- | ------------------------------ |
| Add toast notifications | Use sonner (already installed) |
| Add loading skeletons   | Create skeleton components     |
| Implement drag-and-drop | Use dnd-kit                    |
| Add bulk operations     | Select multiple items          |

---

## Phase 3: Team & Settings (Week 5)

### 3.1 Team Invitation System

**Priority**: 🟡 High

| Task                     | Details          |
| ------------------------ | ---------------- |
| Create invitations table | Schema migration |
| Build invitation API     | Server actions   |
| Email invitation flow    | Use Resend       |
| Accept/decline pages     | UI components    |

### 3.2 Settings Completion

**Priority**: 🟡 High

| Task                | Details                         |
| ------------------- | ------------------------------- |
| Business info form  | Edit tenant details             |
| Social links form   | Update tenant_details           |
| QR customization UI | Color pickers, preview          |
| Danger zone         | Delete tenant with confirmation |

---

## Phase 4: Analytics & Polish (Week 6-7)

### 4.1 Analytics Dashboard

**Priority**: 🟢 Medium

| Task                    | Details              |
| ----------------------- | -------------------- |
| Create analytics schema | events table         |
| Track menu views        | PostHog or custom    |
| Build dashboard UI      | Charts with Recharts |
| Add date filters        | Daily/weekly/monthly |

### 4.2 Performance Optimization

**Priority**: 🟢 Medium

| Task                  | Details                 |
| --------------------- | ----------------------- |
| Implement ISR         | For public pages        |
| Add revalidation tags | Per-tenant cache tags   |
| Optimize images       | Next.js Image component |
| Bundle analysis       | Reduce client bundle    |

---

## Phase 5: Monetization (Week 8)

### 5.1 Stripe Integration

**Priority**: 🟢 Medium (for business)

| Task                | Details                |
| ------------------- | ---------------------- |
| Setup Stripe        | Install stripe package |
| Create checkout     | Stripe Checkout        |
| Webhook handling    | Subscription events    |
| Subscription gating | Middleware checks      |
| Customer portal     | Billing management     |

---

## Quick Reference: Package Installations

```bash
# Infrastructure
npm install uploadthing @uploadthing/react
npm install @upstash/redis @upstash/ratelimit
npm install @sentry/nextjs

# Features
npm install @dnd-kit/core @dnd-kit/sortable
npm install fuse.js
npm install resend react-email

# Analytics & Payments
npm install posthog-js
npm install stripe @stripe/stripe-js
```

---

## Success Metrics

| Metric                | Target                 |
| --------------------- | ---------------------- |
| Public menu load time | < 2 seconds (LCP)      |
| Admin dashboard load  | < 3 seconds            |
| Error rate            | < 0.1%                 |
| Cache hit rate        | > 80% for public pages |
| Uptime                | 99.9%                  |

---

## Timeline Summary

| Phase     | Duration    | Key Deliverables                   |
| --------- | ----------- | ---------------------------------- |
| Phase 1   | 2 weeks     | Image uploads, Redis cache, Sentry |
| Phase 2   | 2 weeks     | Public menu, Admin improvements    |
| Phase 3   | 1 week      | Team invites, Settings             |
| Phase 4   | 2 weeks     | Analytics, Performance             |
| Phase 5   | 1 week      | Stripe payments                    |
| **Total** | **8 weeks** | Production-ready MVP               |
