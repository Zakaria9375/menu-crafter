# MenuCrafter — Design Prompt

Use this prompt with design AI tools (e.g., Figma AI, Framer, Galileo AI) to generate a complete UI/UX design system.

---

## Project Overview

**MenuCrafter** is a multi-tenant SaaS platform for restaurants/cafes to create digital menus, enable table ordering via QR codes, and view analytics. Design a premium, modern, dark-mode-first interface with glassmorphism accents.

---

## Design System Requirements

### Component Library

Design reusable components for:

- Buttons (primary, secondary, ghost, destructive)
- Form inputs (text, select, toggle, slider)
- Cards (stat cards, content cards, image cards)
- Modals and dialogs
- Navigation (sidebar, top bar, breadcrumbs)
- Tables with sorting/filtering
- Empty states and loading skeletons
- Toast notifications

---

## Pages to Design

### 1. Marketing Website (Public)

| Page         | Key Elements                                                                                |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Homepage** | Hero with product mockup, feature grid (3 cols), testimonials carousel, pricing teaser, CTA |
| **Pricing**  | 3-tier pricing cards (Free, Pro, Enterprise), feature comparison table                      |
| **FAQ**      | Accordion-style Q&A                                                                         |
| **Contact**  | Contact form + support email + social links                                                 |

### 2. Authentication

| Page               | Key Elements                                                          |
| ------------------ | --------------------------------------------------------------------- |
| **Login**          | Email/password, "Forgot password" link, OAuth buttons (Google)        |
| **Register**       | Name, email, password, terms checkbox                                 |
| **Password Reset** | Email input, success/error states                                     |
| **Onboarding**     | Multi-step wizard: business name, slug, business type, phone, address |

### 3. Admin Dashboard

| Page                   | Key Elements                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **Overview**           | Stat cards (views, orders, revenue), recent orders table, quick actions                             |
| **Menu Manager**       | Sidebar category list, main area with item grid, drag-to-reorder, "Add Category/Item" modals        |
| **Item Editor**        | Form: name, description, price, image upload, dietary tags, availability toggle, modifier groups    |
| **Table Management**   | Grid of table cards with QR preview, capacity, zone filter                                          |
| **Order Management**   | Kanban board (Pending → Preparing → Ready → Served), order detail drawer                            |
| **Analytics**          | Date range picker, line chart (views/orders over time), top items bar chart, heatmap for peak hours |
| **QR Codes**           | QR customization panel (color, size), bulk download, preview                                        |
| **Settings**           | Tabs: Business Info, Languages, Branding (logo, colors), Notifications                              |
| **Website Editor**     | Live preview + config panel for hero text, accent color, sections toggle                            |
| **Translation Center** | Language selector, key-value translation table with auto-translate button                           |

### 4. Customer-Facing Menu (Public)

| Page                   | Key Elements                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **Menu View**          | Sticky category tabs, item cards with image/price/dietary icons, "Add to Cart" button               |
| **Item Detail**        | Large image, full description, modifier selection (radio/checkbox), quantity stepper, "Add to Cart" |
| **Cart**               | Item list with quantity controls, notes field, total, "Place Order" CTA                             |
| **Order Confirmation** | Order number, estimated time, status badge                                                          |

---

## Responsive Breakpoints

- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px

---

## Deliverables

1. Figma file with all pages at all breakpoints
2. Component library with variants
3. Dark/Light mode color tokens
4. Prototype with navigation flows
