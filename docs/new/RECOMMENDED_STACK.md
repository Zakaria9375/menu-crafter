# Recommended Technology Stack & Infrastructure Architecture

## Executive Summary

To support **1000s of active tenants** and effectively scale **Menu Crafter**, the current stack (Next.js, Neon, Drizzle) is a strong foundation. However, "production-readiness" at scale requires robust solutions for **Asset Storage**, **Observability**, **Caching**, and **Task Processing**.

This document outlines the recommended evolution of your architecture.

---

## 1. Core Application Stack (Confirmed)

_Keep these; they are modern, efficient, and scale well._

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) - Industry standard for React apps.
- **Language**: TypeScript - Essential for maintainability.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - High performance.
- **Component Primitives**: [Radix UI](https://www.radix-ui.com/) - Accessible, unstyled base for your custom themes.
- **Database**: [Neon (Serverless Postgres)](https://neon.tech/) - Scales connections automatically, precise billing.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - Lightweight, type-safe, low overhead.
- **Auth**: [NextAuth.js (Auth.js) v5](https://authjs.dev/) - Flexible, owning your own data.

---

## 2. Infrastructure & Missing Layers (Recommendations)

### 2.1. Asset Storage & Delivery (Critical)

_Current gap: "Image text field". Scaling requires creating, resizing, and serving thousands of food images._

- **Recommendation**: **UploadThing** (easiest wrapper around S3) or **AWS S3 + CloudFront**.
- **Reasoning**: You need direct uploads (presigned URLs) so your server isn't the bottleneck. UploadThing handles this beautifully for Next.js.
- **Optimization**: Use [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image) component heavily with a custom loader to serve optimized WebP/AVIF formats.

### 2.2. Global Caching & Rate Limiting

_Current gap: Protecting DB from scan spikes._

- **Recommendation**: **Upstash (Serverless Redis)**.
- **Use Cases**:
  - **Rate Limiting**: Prevent abuse of public QR pages (e.g., bots scanning menus).
  - **Session Caching**: Faster than DB hits for middleware checks.
  - **Data Caching**: Cache "published" menus (JSON blobs) so public viewers don't hit Postgres on every page load.
  - **Key**: `menu-cache:{tenant-slug}`.

### 2.3. Analytics & Observability

_Current gap: "Analytics (future)". You need to know when things break or are slow._

- **Error Tracking**: **Sentry**. (Automatic error reporting for backend/frontend).
- **Product Analytics**: **PostHog** (Open source, free tier generous). Track "Menu Viewed", "Item Clicked".
- **Logs**: **Vercel Logs** (Basic) or **Axiom** (Advanced retention).

### 2.4. Transactional Email

_Current gap: `nodemailer` (basic)._

- **Recommendation**: **Resend**.
- **Reasoning**: Built by ex-Resend/Vercel folks. React-based email templates (`react-email`). Incredible developer experience and deliverability.

### 2.5. Payments & Billing

_Current gap: "Subscription plans"._

- **Recommendation**: **Stripe** (Checkout & Billing Portal).
- **Implementation**: Webhooks to sync `subscription_status` to `tenants` table.

---

## 3. Revised Infrastructure Diagram

```mermaid
graph TD
    User[End User / Customer]
    CDN[Edge CDN (Vercel)]
    WAF[Firewall / Rate Limit]

    subgraph "Application Layer (Vercel)"
        Next[Next.js App Server]
        API[API Routes / Server Actions]
    end

    subgraph "Data Layer"
        Redis[(Upstash Redis - Cache)]
        DB[(Neon Postgres - Primary)]
        DB_Read[(Neon - Read Replica *optional*)]
    end

    subgraph "Storage & Services"
        S3[Object Storage (UploadThing/S3)]
        Email[Resend]
        Q[Queue (Upstash QStash)]
    end

    User --> CDN
    CDN --> WAF
    WAF --> Next
    Next --> Redis
    Next --> DB
    Next --> S3
    API --> Email
    API --> Q
```

## 4. Why this stack for 1000s of users?

1.  **Serverless Scalability**: Neon, Upstash, and Vercel scale to zero and scale up infinitely without managing instances.
2.  **Performance**: Caching public menus in Redis/Edge ensures that 10,000 customers scanning QR codes at lunch time doesn't crash your Admin dashboard Postgres connection.
3.  **Cost Efficiency**: You only pay for active storage/compute.
4.  **Developer Experience**: strict type safety from DB (Drizzle) to Frontend (TypeScript) to Helper Services (tRPC/Server Actions).
