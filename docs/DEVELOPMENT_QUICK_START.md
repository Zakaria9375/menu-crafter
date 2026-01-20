# Development Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/menucrafter?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npm run db:migrate

# Seed the database (optional but recommended)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
# or with turbopack
npm run dev-local
```

---

## 🧪 Testing with Seed Data

After running `npm run db:seed`, you can test with these accounts:

### Test Accounts

| Email | Password | Tenants | Roles |
|-------|----------|---------|-------|
| `john@example.com` | `password123` | Bella Italia, Cafe Mocha | OWNER, OWNER |
| `jane@example.com` | `password123` | Bella Italia, Sushi Palace | ADMIN, OWNER |
| `bob@example.com` | `password123` | Bella Italia, Burger Heaven | STAFF, MEMBER |

### Test URLs

**Main Application:**

- Homepage: <http://localhost:3000>
- Login: <http://localhost:3000/en/login>
- Register: <http://localhost:3000/en/register>

**Tenant Subdomains (Bella Italia example):**

- <http://bella-italia.localhost:3000>
- <http://sushi-palace.localhost:3000>
- <http://burger-heaven.localhost:3000>
- <http://vegan-delights.localhost:3000>
- <http://cafe-mocha.localhost:3000>

> **Note:** Subdomain testing works on localhost. Your browser should handle `*.localhost` automatically.

---

## 📋 Common Commands

### Database Commands

```bash
# Seed database with test data
npm run db:seed

# Run migrations
npm run db:migrate

# Reset database (drops all data, runs migrations, and seeds)
npm run db:reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate
```

### Development Commands

```bash
# Start dev server
npm run dev

# Start dev server (without turbopack)
npm run dev-local

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Deployment Commands

```bash
# Deploy to Vercel
npm run deploy
```

---

## 🧭 Project Structure

```text
menu-crafter/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   ├── SEED_README.md         # Seed documentation
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── [locale]/         # Internationalized routes
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── [tenant]/     # Tenant pages
│   │   │   └── (protected)/  # Protected routes
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── auth/            # Auth-related components
│   │   ├── nav/             # Navigation components
│   │   └── ui/              # UI components
│   ├── lib/
│   │   ├── auth/            # NextAuth configuration
│   │   └── db/              # Database utilities
│   ├── middlewares/         # Middleware logic
│   │   ├── app.ts          # App middleware
│   │   ├── tenant.ts       # Tenant middleware
│   │   ├── intl.ts         # i18n middleware
│   │   └── helper.ts       # Helper functions
│   ├── i18n/               # Internationalization config
│   └── middleware.ts       # Main middleware entry
├── messages/               # Translation files
│   ├── en.json
│   └── ar.json
├── MIDDLEWARE_DOCUMENTATION.md  # Middleware docs
└── DEVELOPMENT_QUICK_START.md   # This file
```

---

## 🌍 Internationalization

### Supported Locales

- English (`en`) 🇺🇸
- Arabic (`ar`) 🇸🇦

### URL Structure

All URLs include a locale prefix:

- English: `/en/...`
- Arabic: `/ar/...`

### Adding Translations

Edit the JSON files in the `messages/` directory:

- `messages/en.json` - English translations
- `messages/ar.json` - Arabic translations

---

## 🔐 Authentication Flow

### Registration

1. Visit `/en/register`
2. Create account with email/password or Google OAuth
3. Redirected to `/en/onboarding`

### Login

1. Visit `/en/login`
2. Login with email/password or Google OAuth
3. If first time: redirected to `/en/onboarding`
4. If returning: redirected to last visited page or dashboard

### Protected Routes

- Unauthenticated users are redirected to login
- Authenticated users can access based on tenant membership

---

## 🏢 Multi-Tenant Architecture

### How It Works

1. **Subdomain Detection:** Middleware checks for subdomain (e.g., `tenant1.localhost`)
2. **Authentication:** Verifies user is logged in
3. **Access Control:** Checks if user is a member of the tenant
4. **URL Rewriting:** Internally rewrites to `/en/{tenant}/...`

### Access Control Matrix

- **No subdomain:** Main application routes
- **Subdomain + Not logged in:** Redirect to login
- **Subdomain + No membership:** Show 403 page
- **Subdomain + Has membership:** Allow access

### Testing Locally

1. Login as `john@example.com` / `password123`
2. Visit `http://bella-italia.localhost:3000` ✅ (John is OWNER)
3. Visit `http://sushi-palace.localhost:3000` ❌ (John is not a member)

---

## 🔧 Troubleshooting

### Subdomain Not Working Locally

**Problem:** `bella-italia.localhost:3000` doesn't work

**Solutions:**

1. Try `http://` instead of `https://`
2. Clear browser cache
3. Try a different browser (Chrome/Firefox handle `*.localhost` best)
4. Check if port 3000 is correct: `npm run dev` shows the port

### Database Connection Error

**Problem:** Can't connect to database

**Solutions:**

1. Ensure PostgreSQL is running
2. Check `.env` file has correct `DATABASE_URL`
3. Test connection: `npx prisma studio`
4. Verify database exists: `psql -l` (if using psql)

### Prisma Client Not Found

**Problem:** `Cannot find module '@prisma/client'`

**Solutions:**

```bash
npx prisma generate
npm install
```

### Middleware Not Working

**Problem:** Routes not behaving as expected

**Solutions:**

1. Check `NEXTAUTH_SECRET` is set in `.env`
2. Clear `.next` cache: `rm -rf .next`
3. Restart dev server
4. Check browser console for errors

### Seed Script Fails

**Problem:** Error running `npm run db:seed`

**Solutions:**

```bash
# Reset database and try again
npm run db:reset

# Or manually:
npx prisma migrate reset
npx prisma generate
npm run db:seed
```

---

## 📚 Additional Documentation

- **Middleware Logic:** See `MIDDLEWARE_DOCUMENTATION.md`
- **Seed Data:** See `prisma/SEED_README.md`
- **Database Schema:** See `prisma/schema.prisma`
- **Next.js Docs:** <https://nextjs.org/docs>
- **NextAuth Docs:** <https://authjs.dev/>
- **Prisma Docs:** <https://www.prisma.io/docs>

---

## 🎯 Next Steps

1. **Explore the codebase:**
   - Read `MIDDLEWARE_DOCUMENTATION.md` to understand routing
   - Check `prisma/schema.prisma` for database structure

2. **Test authentication:**
   - Try registering a new account
   - Test Google OAuth (if configured)
   - Navigate between different routes

3. **Test multi-tenancy:**
   - Login with seed accounts
   - Visit different tenant subdomains
   - Test access control (403 pages)

4. **Build features:**
   - Add new pages to tenant areas
   - Create new components
   - Extend the database schema

5. **Read documentation:**
   - Middleware architecture
   - Authentication flow
   - Database relationships

---

## 💡 Tips

- **Use Prisma Studio** for database visualization: `npx prisma studio`
- **Check middleware logs** in terminal when testing routes
- **Use React DevTools** for component debugging
- **Test with multiple browsers** to verify subdomain handling
- **Keep seed data updated** when schema changes

---

## 🆘 Getting Help

1. Check error messages in browser console
2. Check terminal output for server errors
3. Read the relevant documentation files
4. Check Prisma/Next.js/NextAuth docs
5. Use `npx prisma studio` to inspect database

---

Happy coding! 🚀
