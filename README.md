# Menu Crafter - Digital Menu Platform

A modern SaaS multi-tenant platform that enables restaurants, hotels, cafes, and other hospitality businesses to create and manage digital menus accessible via QR codes. Developed as a Bachelor's thesis project at Riga Technical University (RTU).

## Table of Contents

- [Overview](#overview)
  - [The Challenge](#the-challenge)
  - [Solution](#solution)
- [Technologies](#technologies)
- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Links](#links)
- [Architecture](#architecture)
  - [Multi-Tenant System](#multi-tenant-system)
  - [Database Schema](#database-schema)
  - [Authentication System](#authentication-system)
- [Internationalization](#internationalization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Retrospectives](#retrospectives)
- [About The Author](#about-the-author)
- [Contributing](#contributing)
- [License](#license)

## Overview

### The Challenge

Modern hospitality businesses face several challenges with traditional paper menus:
- Difficulty in updating menu items and prices
- Language barriers for international customers
- Limited space for detailed descriptions
- Environmental concerns with disposable menus
- Inability to track customer engagement and preferences

### Solution

**Menu Crafter** provides a comprehensive digital menu platform with:
- QR code-based menu access for contactless viewing
- Multi-language support for international customers
- Easy-to-use admin dashboard for menu management
- Real-time updates without reprinting
- Analytics and insights on customer behavior
- Multi-currency support for diverse markets

## Technologies

The technologies used in this project are:

**Frontend & Framework:**
- Next.js 15.5.7 (React 19, App Router)
- TypeScript 5
- Tailwind CSS 4 with custom theming
- Radix UI component library
- Lucide React (icons)
- React Hook Form 7.63.0
- Recharts 3.2.1 (data visualization)

**Backend & Database:**
- Next.js API Routes
- Drizzle ORM 0.44.6 (type-safe queries)
- PostgreSQL (via Neon serverless)
- Drizzle Kit 0.31.8 (migrations)

**Authentication & Security:**
- NextAuth 5.0.0-beta.30
- NextAuth Drizzle Adapter
- OAuth providers (Google)
- bcryptjs 3.0.2 (password hashing)
- WebAuthn/Authenticator support

**Validation & Forms:**
- Yup 1.7.1
- Zod 4.1.13
- @hookform/resolvers 5.2.2

**Internationalization:**
- next-intl 4.3.9
- Support for English (en) and Arabic (ar)

**Email & Communication:**
- Nodemailer 7.0.11
- React Toastify 11.0.5

**Development Tools:**
- ESLint 9
- Tailwind Merge 3.3.1
- Class Variance Authority (CVA)
- tsx 4.20.6

## Features

**Core Platform Features:**
- **Multi-Tenant Architecture**: Each business operates in its own isolated workspace
- **QR Code Generation**: Create unique QR codes for different menu sections
- **Admin Dashboard**: Comprehensive control panel for business management
- **Real-time Menu Updates**: Instant changes without reprinting QR codes
- **Multi-language Support**: Customizable languages per tenant
- **Multi-currency Support**: Configure default currency (EUR, USD, etc.)

**User Management:**
- User registration and authentication
- Password reset functionality via email
- OAuth integration (Google)
- Role-based access control (Owner, Admin, Staff, Member)
- Multi-tenant user assignments

**Business Configuration:**
- Logo and brand management
- Social media integration (Facebook, Instagram, X/Twitter, WhatsApp, TikTok)
- Website URL management
- Operating hours configuration
- Business type categorization (Restaurant, Hotel, Cafe, Bar, Bakery, Other)

**Admin Dashboard Modules:**
- Dashboard & Analytics overview
- Menu management with QR code generation
- QR code management and distribution
- Profile settings
- Website customization
- Translation/localization center
- Analytics and reporting

**Public Pages:**
- Landing page with hero and features
- Pricing information
- FAQ page
- Contact page
- Terms of Service
- Privacy Policy

**User Onboarding:**
- Guided onboarding flow for new business owners
- Profile setup during registration
- Business information collection

**Security Features:**
- JWT-based session strategy
- Password hashing with bcrypt
- Email-based password reset tokens
- Multi-tenant isolation via middleware
- Protected route handling

## Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- PostgreSQL database (or Neon account)
- Git

### Installation

To run this app in development mode, open the terminal and execute the following commands:

```bash
# Clone the repository
git clone https://github.com/Zakaria9375/menu-crafter.git

# Navigate to the project directory
cd menu-crafter

# Install dependencies
npm install
```

### Database Setup

1. Create a PostgreSQL database (or use Neon serverless):
```bash
# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Drizzle Studio to view your database
npm run db:studio

# (Optional) Seed the database with initial data
npm run db:seed
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# NextAuth
AUTH_SECRET=your_auth_secret
AUTH_TRUST_HOST=true

# Google OAuth (optional)
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Email Configuration (Nodemailer)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@example.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=noreply@menucrafter.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Available Scripts

In the project directory, you can run:

### Development

```bash
# Start development server
npm run dev

# Start development server with Turbopack (faster)
npm run dev:turbo

# Start development server with debugging
npm run dev:debug
```

### Production

```bash
# Build for production
npm run build

# Build with Turbopack
npm run build:turbo

# Start production server
npm start

# Deploy to Vercel
npm run deploy
```

### Database

```bash
# Generate database migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed database with initial data
npm run db:seed
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Links

- **Live Demo**: [Coming Soon]
- **Thesis Documentation**: See `/docs/thesis/` directory
- **Repository**: [GitHub](https://github.com/Zakaria9375/menu-crafter)

## Architecture

### Multi-Tenant System

Menu Crafter uses a sophisticated multi-tenant architecture:

- **Tenant Isolation**: Each business (tenant) operates in its own isolated workspace
- **Subdomain Routing**: Tenants are accessed via subdomains or paths
- **Middleware-based Context**: Tenant context extracted at middleware level
- **Shared Infrastructure**: All tenants share the same application infrastructure while maintaining data separation

### Database Schema

**Core Tables:**
- `users`: User accounts with authentication credentials
- `accounts`: OAuth provider accounts
- `sessions`: JWT session management
- `verification_tokens`: Email verification
- `password_reset_tokens`: Password recovery flow
- `tenants`: Business/organization profiles
- `tenant_details`: Extended tenant information (logo, social media, languages, currencies)
- `memberships`: User-tenant relationships with role-based access
- `authenticators`: WebAuthn credential storage

**Role-Based Access Control:**
- **OWNER**: Full access to all tenant features
- **ADMIN**: Administrative access with limitations
- **STAFF**: Limited access to daily operations
- **MEMBER**: Basic access for viewing and minimal changes

**Business Types:**
- Restaurant
- Hotel
- Cafe
- Bar
- Bakery
- Other

### Authentication System

- **NextAuth.js**: Industry-standard authentication framework
- **Multiple Providers**: Credentials (email/password) and Google OAuth
- **Session Strategy**: JWT-based for scalability
- **Password Security**: bcrypt hashing with salt rounds
- **Password Reset**: Token-based email recovery flow
- **Future Support**: WebAuthn/Passkeys for passwordless authentication

## Internationalization

Menu Crafter supports multiple languages out of the box:

**Supported Languages:**
- English (en)
- Arabic (ar)

**Implementation:**
- `next-intl` middleware handles locale routing
- Message files in `/messages/` directory
- Dynamic locale parameter in URL routes
- Language selector component for user preference
- RTL support for Arabic language

**Adding New Languages:**
1. Create a new message file in `/messages/` (e.g., `fr.json`)
2. Add the locale to the routing configuration in `src/i18n/routing.ts`
3. Translate all message keys from an existing language file

## Testing

**Current Status**: Testing framework planned for future implementation

**Planned Testing Strategy:**
- **Unit Tests**: Jest or Vitest for component and utility testing
- **Integration Tests**: Testing API routes and database operations
- **E2E Tests**: Playwright or Cypress for full user flow testing
- **Accessibility Tests**: Automated a11y testing with tools like axe-core
- **Performance Tests**: Lighthouse CI for performance monitoring

**To run tests** (once implemented):
```bash
npm test
```

## Deployment

**Vercel Deployment:**

Menu Crafter is optimized for deployment on Vercel:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Deploy**: Automatic deployments on every push to main branch

```bash
# Manual deployment
npm run deploy
```

**Database Migrations:**

Ensure database migrations are run before deploying:
```bash
npm run db:push
```

**Environment Setup:**
- Configure production environment variables in Vercel
- Ensure `DATABASE_URL` points to production database
- Set `NEXT_PUBLIC_APP_URL` to production domain
- Configure email server credentials for production

## Retrospectives

### What went well?

- Successfully implemented a scalable multi-tenant architecture
- Clean separation of concerns with modular component structure
- Type-safe database queries with Drizzle ORM
- Comprehensive authentication system with multiple providers
- Internationalization support from the ground up
- Modern UI with Radix primitives and Tailwind CSS
- Efficient development workflow with Next.js App Router
- Password reset functionality with email integration

### What could be improved?

- **Testing Coverage**: Implement comprehensive unit, integration, and E2E tests
- **Documentation**: Add more inline code comments and API documentation
- **Performance Optimization**: Implement caching strategies and optimize database queries
- **Error Handling**: More robust error handling and user-friendly error messages
- **Accessibility**: Conduct thorough accessibility audit and improvements
- **Mobile Experience**: Enhanced mobile-specific features and optimizations
- **Analytics Implementation**: Complete the analytics dashboard with real-time data
- **Menu Builder**: Advanced menu builder with drag-and-drop functionality
- **QR Code Customization**: Allow custom QR code designs and branding

### What's next?

- Implement comprehensive testing suite
- Complete the menu management system
- Add advanced analytics and reporting
- Implement QR code scanning analytics
- Add customer feedback and rating system
- Support for menu item images and galleries
- Allergen and dietary information management
- Integration with POS systems
- Mobile app for customers (React Native)
- Advanced theming and customization options

## About the Author

This project was developed as a Bachelor's thesis at Riga Technical University (RTU), demonstrating modern web development practices, SaaS architecture, and multi-tenant system design.

In every project I develop, I focus on improving code quality and incorporating new techniques into my development process. I strive to learn from my mistakes by addressing them directly and applying those lessons to future projects. My goal is to continuously refine and enhance my standard approach to project development.

- **Portfolio**: [Zakaria Ali](https://zakaria-ali.com)
- **GitHub**: [@Zakaria9375](https://github.com/Zakaria9375)
- **Frontend Mentor**: [@Zakaria9375](https://www.frontendmentor.io/profile/Zakaria9375)

## Contributing

Want to contribute? Great! Here's how you can help:

1. Fork the repository
2. Create your feature branch from `main`
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes and test thoroughly
4. Commit your changes with descriptive commit messages
   ```bash
   git commit -m "Add amazing feature"
   ```
5. Push to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
6. Open a Pull Request with a clear description of your changes

**Contribution Guidelines:**
- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep commits atomic and well-described

## License

MIT License

Copyright (c) 2024-present, Zakaria Ali

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Built with** ❤️ **using Next.js, TypeScript, and modern web technologies**
