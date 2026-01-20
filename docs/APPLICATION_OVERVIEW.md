# Menu Crafter - Application Overview

## 📖 About Menu Crafter

**Menu Crafter** is a comprehensive SaaS platform that empowers restaurants to create and manage QR code menus and custom websites. The application provides a seamless solution for restaurant owners to digitize their menus, generate branded websites, and deliver contactless dining experiences to their customers.

### Key Features

- 🍽️ **Digital QR Menu Generation** - Create scannable QR codes for contactless menu viewing
- 🌐 **Custom Restaurant Websites** - Generate beautiful, responsive websites for each restaurant
- 🏢 **Multi-Tenant Architecture** - Each restaurant operates as an independent tenant with their own subdomain
- 🔐 **Secure Authentication** - Email/password and Google OAuth integration
- 🌍 **Internationalization** - Support for multiple languages (English, Arabic)
- 👥 **Role-Based Access Control** - Owner, Admin, Staff, and Member roles
- 📱 **Mobile-First Design** - Optimized for all devices

---

## 🏗️ Architecture

### Multi-Tenant System

Menu Crafter uses a subdomain-based multi-tenant architecture where:

- **Main Application** (`menucrafter.com`) - Marketing site, authentication, and onboarding
- **Tenant Subdomains** (`restaurant-name.menucrafter.com`) - Individual restaurant websites and admin panels

### Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS v4
- **Internationalization:** next-intl
- **Deployment:** Vercel-ready

---

## 📄 Application Pages & Routes

### Main Application Routes

#### 1. **Landing Page** (`/`)

- **Purpose:** Marketing homepage for Menu Crafter
- **Features:**
  - Hero section with value proposition
  - Feature showcase
  - Pricing information
  - Call-to-action for registration
- **Access:** Public
- **Components:** Hero, Features sections

#### 2. **Authentication Pages** (`/[locale]/(auth)/`)

##### Login Page (`/login`)

- **Purpose:** User authentication
- **Features:**
  - Email/password login
  - Google OAuth integration
  - "Remember me" option
  - Password reset link
- **Access:** Public (redirects if authenticated)
- **Form Fields:** Email, Password

##### Register Page (`/register`)

- **Purpose:** New user registration
- **Features:**
  - Email/password registration
  - Google OAuth sign-up
  - Form validation
  - Terms acceptance
- **Access:** Public (redirects if authenticated)
- **Form Fields:** Name, Email, Password, Confirm Password

##### Password Reset (`/password-reset`)

- **Purpose:** Password recovery
- **Features:**
  - Email-based reset flow
  - Secure token generation
  - New password creation
- **Access:** Public

#### 3. **Product Information Pages** (`/[locale]/(product)/`)

##### Pricing Page (`/pricing`)

- **Purpose:** Display subscription plans and pricing
- **Features:**
  - Plan comparison
  - Feature lists
  - Payment options
- **Access:** Public

##### FAQ Page (`/faq`)

- **Purpose:** Frequently asked questions
- **Features:**
  - Searchable questions
  - Categorized content
  - Expandable answers
- **Access:** Public

##### Contact Page (`/contact`)

- **Purpose:** Customer support contact
- **Features:**
  - Contact form
  - Support email
  - Social media links
- **Access:** Public

##### Terms & Privacy (`/terms`, `/privacy`)

- **Purpose:** Legal documentation
- **Access:** Public

#### 4. **Onboarding** (`/[locale]/onboarding`) ⚡ Protected

- **Purpose:** First-time business setup for new users
- **Features:**
  - Restaurant profile creation
  - Business information collection
  - Subdomain/slug selection
  - Initial tenant setup
- **Access:** Protected (authenticated users without tenants)
- **Form Fields:**
  - Business Name
  - Phone Number
  - Address
  - Subdomain/Slug
- **Redirect:** After completion → Tenant admin dashboard

#### 5. **Profile Page** (`/[locale]/profile`) ⚡ Protected

- **Purpose:** User account management
- **Features:**
  - View/edit personal information
  - Manage memberships
  - View all associated restaurants
  - Account settings
- **Access:** Protected (authenticated users)

#### 6. **Forbidden Page** (`/[locale]/forbidden`)

- **Purpose:** Access denied notification
- **Displays:** When user attempts to access a tenant they don't belong to
- **Access:** All users

---

### Tenant-Specific Routes (Subdomain-based)

All tenant routes are accessed via subdomain: `{tenant-slug}.menucrafter.com`

#### 1. **Restaurant Public Website** (`[tenant].menucrafter.com/`)

- **Purpose:** Public-facing restaurant website
- **Features:**
  - Restaurant branding and theme
  - Digital menu display
  - Location and hours
  - Contact information
  - Online ordering integration (future)
  - Reservation system (future)
- **Access:** Public
- **Customizable Elements:**
  - Color scheme
  - Logo and images
  - Menu categories
  - Layout template

#### 2. **Admin Dashboard** (`[tenant].menucrafter.com/admin/dashboard`) ⚡ Protected

- **Purpose:** Restaurant management interface
- **Features:**
  - Analytics overview
  - Quick stats (views, scans, orders)
  - Recent activity
  - Menu management shortcuts
  - Team member overview
- **Access:** Protected (tenant members only)
- **Roles:** Owner, Admin, Staff (read-only)

#### 3. **Menu Management** (`[tenant].menucrafter.com/admin/menu`) 🔜 Coming Soon

- **Purpose:** Create and edit menu items with AI-powered and manual options
- **Access:** Protected (Owner, Admin)

**Input Methods:**

#### Option 1: Smart Menu Upload (AI-Powered)

- Upload existing menus (Image, PDF, Excel/CSV)
- AI automatically extracts menu items
- Preview extracted data with confidence scores
- Edit and confirm extracted items
- Bulk import with one click
- Supported formats:
  - Images (JPG, PNG) - Photo of menu
  - PDF documents - Digital menus
  - Excel/CSV - Structured data

#### Option 2: Manual Menu Creation

- Create items from scratch
- Rich text descriptions with formatting
- Image upload with crop/resize
- Category management
- Dietary tags and allergen warnings
- Price management with currency
- Availability toggles
- Drag-and-drop reordering

**Core Features:**

- Multiple view modes (table, grid, list)
- Real-time menu preview
- Template-based preview
- Search and filter
- Bulk actions
- Category organization
- Auto-save
- Undo/redo
- Mobile and desktop preview
- Export menu data

#### 4. **QR Code Generator** (`[tenant].menucrafter.com/admin/qr-codes`) 🔜 Coming Soon

- **Purpose:** Generate QR codes for menus
- **Features:**
  - Custom QR designs
  - Downloadable formats (PNG, SVG, PDF)
  - Multiple sizes
  - Table-specific QR codes
- **Access:** Protected (Owner, Admin)

#### 5. **Team Management** (`[tenant].menucrafter.com/admin/team`) 🔜 Coming Soon

- **Purpose:** Manage staff and roles
- **Features:**
  - Invite team members
  - Assign roles
  - Manage permissions
  - View member activity
- **Access:** Protected (Owner, Admin only)

#### 6. **Website Builder & Template Manager** (`[tenant].menucrafter.com/admin/website`) 🔜 Coming Soon

- **Purpose:** Customize restaurant website appearance and content
- **Access:** Protected (Owner, Admin)

**Template Selection:**

- Choose from 5 pre-designed templates:
  - Modern Minimal (upscale dining)
  - Bold & Vibrant (fast food, desserts)
  - Rustic Elegance (traditional cuisine)
  - Asian Fusion (Japanese, Thai, Korean)
  - Mediterranean Fresh (Greek, seafood)
- Live preview before applying
- Switch templates anytime

**Visual Customization:**

- **Color Scheme Editor:**
  - Primary color picker
  - Secondary/accent colors
  - Background colors
  - Text colors
  - Live preview of changes
- **Typography:**
  - Font family selection (Google Fonts)
  - Heading styles
  - Body text size
  - Custom CSS support
- **Logo & Branding:**
  - Upload restaurant logo
  - Favicon upload
  - Brand color extraction from logo

**Content Management:**

- **Hero Section:**
  - Upload hero image/video
  - Edit tagline and description
  - Call-to-action buttons
- **About Section:**
  - Restaurant story editor (rich text)
  - Team/chef photos
  - Awards and certifications
- **Location & Hours:**
  - Google Maps integration
  - Opening hours manager
  - Holiday hours
  - Special announcements
- **Gallery:**
  - Upload multiple photos
  - Drag-and-drop organization
  - Image captions
  - Grid/masonry layout options
- **Contact Information:**
  - Phone, email, social media
  - Contact form customization
  - WhatsApp integration
  - Reservation link

**Layout Customization:**

- Section reordering (drag-and-drop)
- Show/hide sections
- Section spacing controls
- Full-width vs contained layouts
- Custom page creation
- Navigation menu editor

**Advanced Features:**

- Custom CSS injection
- SEO settings (meta tags, descriptions)
- Analytics integration (Google Analytics)
- Social media previews
- Multilingual content support
- Mobile responsiveness preview
- A/B testing different designs

**Preview & Publish:**

- Real-time preview as you edit
- Mobile/tablet/desktop preview
- Publish changes
- Schedule updates
- Revert to previous version
- Preview link sharing

#### 7. **Settings** (`[tenant].menucrafter.com/admin/settings`) 🔜 Coming Soon

- **Purpose:** Restaurant configuration and account settings
- **Features:**
  - Business information
  - Subdomain management
  - User preferences
  - Integration settings
  - Billing and subscription
  - Data export
- **Access:** Protected (Owner only)

---

## 👥 User Roles & Permissions

### Role Hierarchy

| Role | Permissions |
|------|-------------|
| **OWNER** | Full access - manage everything including billing, team, and settings |
| **ADMIN** | Manage menus, QR codes, and view analytics. Cannot manage billing or delete tenant |
| **STAFF** | View dashboard and menus. Can mark items as available/unavailable |
| **MEMBER** | Basic access to view tenant information |

---

## 🔄 User Flows

### New User Journey

1. **Landing Page** → View features
2. **Register** → Create account
3. **Onboarding** → Set up first restaurant
4. **Tenant Dashboard** → Start managing restaurant
5. **Menu Management** → Add menu items
6. **QR Generation** → Create and download QR codes

### Returning User Journey

1. **Login** → Authenticate
2. **Profile** → View all restaurants
3. **Select Tenant** → Navigate to specific restaurant
4. **Dashboard** → Manage and view analytics

### Restaurant Website Visitor Journey

1. **Scan QR Code** → Directed to restaurant website
2. **View Menu** → Browse categories and items
3. **Place Order** (future) → Submit order
4. **Payment** (future) → Complete transaction

---

## 🎨 Design Prompt for AI Figma Tool

### Design Request for Menu Crafter Application

**Project Description:**
Design a comprehensive UI/UX system for Menu Crafter, a modern SaaS platform that enables restaurants to create QR code menus and custom websites. The application consists of two main design systems:

**1. Main Application Design (menucrafter.com):**
Create a professional, clean, and conversion-focused design for the main SaaS platform including:

- **Landing Page:** Modern hero section with a large hero image of a restaurant setting, feature cards with icons (QR code, website, analytics, team management), pricing table with 3 tiers (Starter, Professional, Enterprise), testimonial section, and prominent CTAs for "Get Started" and "View Demo"
- **Authentication Pages:** Centered card-based layout with modern form design, social login buttons (Google), clean typography, subtle shadows, and a background with a restaurant-themed gradient or pattern
- **Onboarding Flow:** Multi-step form wizard with progress indicator, welcoming illustrations, form fields for business name, phone, address, and subdomain selection with real-time availability check
- **Dashboard/Profile:** Modern admin panel with sidebar navigation, user avatar dropdown, membership cards showing all associated restaurants, and a clean settings interface
- **Admin Dashboard:** Analytics-focused layout with metric cards (total views, QR scans, menu items, active users), charts for trends, recent activity feed, and quick action buttons

**Color Scheme for Main App:**

- Primary: Professional teal/blue (#0EA5E9 or similar)
- Secondary: Warm orange/amber for CTAs (#F59E0B)
- Background: Clean white/light gray (#F9FAFB)
- Text: Dark gray (#1F2937)
- Accents: Success green, warning yellow, error red

**2. Restaurant Website Templates (tenant subdomains):**
Design 5 distinct restaurant website templates that can be customized per tenant:

**Template 1 - "Modern Minimal":**

- Clean white background with elegant serif headings
- Full-width hero image with overlay text
- Grid-based menu layout with high-quality food photos
- Floating navigation bar
- Perfect for: Upscale dining, cafes, modern bistros

**Template 2 - "Bold & Vibrant":**

- Colorful sections with energetic gradients
- Large product cards with bright accent colors
- Animated elements on scroll
- Playful typography
- Perfect for: Fast food, dessert shops, food trucks

**Template 3 - "Rustic Elegance":**

- Warm earth tones (browns, beiges, burnt orange)
- Textured backgrounds (wood, paper)
- Classic serif fonts
- Vintage-style ornamental dividers
- Perfect for: Italian restaurants, steakhouses, traditional cuisine

**Template 4 - "Asian Fusion":**

- Clean minimalist design with strategic use of red/black/white
- Vertical text elements
- Zen-inspired spacing
- Subtle pattern overlays (bamboo, waves)
- Perfect for: Japanese, Chinese, Thai, Korean restaurants

**Template 5 - "Mediterranean Fresh":**

- Light and airy with blues and whites
- Coastal-inspired imagery
- Fresh, modern sans-serif fonts
- Lots of white space
- Perfect for: Greek, seafood, healthy eating, Mediterranean restaurants

**Common Elements Across All Restaurant Templates:**

- Mobile-first responsive design
- Digital menu section with categories (Appetizers, Mains, Desserts, Beverages)
- Menu items with photos, descriptions, dietary icons (vegan, gluten-free, spicy), and prices
- "About Us" section with restaurant story and chef photo
- Location map with Google Maps integration
- Opening hours display
- Contact section with phone, email, and social media links
- Photo gallery of dishes and restaurant ambiance
- Reservation button (prominent CTA)
- Floating WhatsApp/call button
- Footer with additional links

**Design Style Guidelines:**

- Mobile screens: 375px width (iPhone), tablet: 768px, desktop: 1440px
- Use modern UI components: cards, modals, dropdowns, tabs, accordions
- Implement smooth transitions and micro-interactions
- Include empty states, loading states, and error states
- Use real food photography placeholders (high quality)
- Ensure WCAG AA accessibility standards
- Implement proper spacing (4px, 8px, 16px, 24px, 32px system)
- Use modern shadows for depth (subtle elevation)

**Specific Screens to Design:**

*Main Application:*

1. Landing page (desktop + mobile)
2. Login page
3. Register page
4. Onboarding form (3 steps)
5. User profile page
6. Admin dashboard
7. Menu management interface
8. QR code generator screen
9. Team management page
10. Settings page

*Restaurant Templates (for each of 5 templates):*

1. Homepage with hero and featured dishes
2. Full menu page with all categories
3. Individual menu item detail page
4. About us page
5. Contact page
6. Mobile menu view (optimized for QR code scanning)

**Additional Components Library:**

- Buttons (primary, secondary, text, icon)
- Form inputs (text, email, password, select, textarea)
- Cards (menu items, feature cards, stat cards)
- Navigation bars (main app, restaurant sites)
- Modals and dialogs
- Toasts and notifications
- Loading spinners
- Icons set (Lucide or similar)

**Output Requirements:**

- Organize in Figma with clear page structure
- Create a design system with reusable components
- Use auto-layout for responsive components
- Include desktop, tablet, and mobile views
- Provide style guide page with colors, typography, spacing
- Include interactive prototype with basic click-through flows
- Use realistic content (no lorem ipsum for final designs)
- Include both light mode designs (dark mode optional for main app)

This design system should feel premium, modern, and professional while being accessible and user-friendly for restaurant owners with varying technical expertise.

---

## 🗂️ Database Schema Overview

### Core Tables

- **users** - User accounts with authentication details
- **accounts** - OAuth provider connections
- **sessions** - Active user sessions
- **tenants** - Restaurant/business entities
- **memberships** - User-tenant relationships with roles
- **authenticators** - WebAuthn credentials (future)

### Relationships

- One user can belong to multiple tenants
- One tenant can have multiple users (team members)
- Memberships define the user-tenant relationship and role

---

## 🌐 Internationalization

### Supported Languages

- **English (en)** - Default
- **Arabic (ar)** - RTL support

### URL Structure

All routes include locale prefix:

- English: `/en/...`
- Arabic: `/ar/...`

---

## 🚀 Getting Started

For development setup and detailed technical documentation, see:

- [Development Quick Start Guide](./DEVELOPMENT_QUICK_START.md)
- [Middleware Documentation](./MIDDLEWARE_DOCUMENTATION.md)
- [Seed Data Documentation](./SEED_README.md)

---

## 📊 Future Features Roadmap

### Phase 1 (Current)

- ✅ Authentication system
- ✅ Multi-tenant architecture
- ✅ Onboarding flow
- ✅ Basic admin dashboard

### Phase 2 (Coming Soon)

- 🔜 Menu management interface
- 🔜 QR code generator
- 🔜 Restaurant website templates
- 🔜 Theme customization

### Phase 3 (Planned)

- 📋 Online ordering system
- 📋 Table reservation
- 📋 Analytics and reporting
- 📋 Customer feedback system

### Phase 4 (Future)

- 📋 Payment integration
- 📋 Inventory management
- 📋 Multi-location support
- 📋 Mobile apps (iOS/Android)
- 📋 Kitchen display system
- 📋 Loyalty program

---

## 🎯 Target Audience

### Primary Users

- **Restaurant Owners** - Small to medium restaurant owners seeking digital transformation
- **Cafe Managers** - Coffee shops and casual dining establishments
- **Food Truck Operators** - Mobile food vendors needing quick digital presence
- **Chain Managers** - Multi-location restaurant management

### Use Cases

- Replace paper menus with QR codes
- Create professional restaurant website without coding
- Manage menu updates in real-time
- Track customer engagement and analytics
- Reduce printing costs
- Provide contactless dining experience
- Improve customer experience with digital ordering

---

## 📞 Support & Documentation

### For Users

- In-app help center
- Video tutorials
- FAQ section
- Email support

### For Developers

- Technical documentation in `/docs`
- API reference (coming soon)
- Component library documentation
- Database schema documentation

---

## 📝 Notes

- This application follows Next.js 15 App Router conventions
- All protected routes use middleware-based authentication
- Tenant isolation is enforced at the middleware level
- Database operations use server actions
- Forms use React Hook Form with Yup/Zod validation

---

**Last Updated:** October 2025  
**Version:** 0.1.0  
**Status:** Active Development
