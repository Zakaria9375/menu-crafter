# Database Seeding Guide

This project uses **Drizzle ORM** for database management and seeding.

## Commands

| Command | Description |
| :--- | :--- |
| `npm run db:generate` | Generates SQL migrations from the schema. |
| `npm run db:migrate` | Applies migrations to the database. |
| `npm run db:seed` | Seeds the database with sample data. |
| `npx tsx src/lib/db/reset.ts` | **CAUTION**: Drops all tables in the public schema. |

## Seeding Process

The seed script (`src/lib/db/seed.ts`) clears existing data and populates the database with:
1.  **Users**: 6 sample users.
2.  **Tenants**: 5 sample restaurants.
3.  **Memberships**: Assigns users to tenants with various roles (OWNER, ADMIN, STAFF, MEMBER).
4.  **Menu Data**: A complete menu for "Bella Italia Restaurant".

### Running the Seed Script

```bash
npm run db:seed
```

## Seeded Data

### Users
All users have the password: `password123`

| Name | Email | Role Examples |
| :--- | :--- | :--- |
| John Doe | `john@example.com` | Owner of Bella Italia & Cafe Mocha |
| Jane Smith | `jane@example.com` | Admin of Bella Italia, Owner of Sushi Palace |
| Bob Wilson | `bob@example.com` | Staff at Bella Italia |
| Alice Johnson | `alice@example.com` | Owner of Vegan Delights |
| Charlie Brown | `charlie@example.com` | Owner of Burger Heaven |
| Diana Prince | `diana@example.com` | Staff at Vegan Delights (Unverified) |

### Tenants & URLs

| Name | Slug | Local URL |
| :--- | :--- | :--- |
| Bella Italia Restaurant | `bella-italia` | http://bella-italia.localhost:3000 |
| Sushi Palace | `sushi-palace` | http://sushi-palace.localhost:3000 |
| Burger Heaven | `burger-heaven` | http://burger-heaven.localhost:3000 |
| Vegan Delights | `vegan-delights` | http://vegan-delights.localhost:3000 |
| Cafe Mocha | `cafe-mocha` | http://cafe-mocha.localhost:3000 |

### Sample Menu (Bella Italia)

The seed script populates "Bella Italia Restaurant" with the following menu:

**Appetizers**
*   **Bruschetta** ($8.00) - Vegetarian
*   **Calamari** ($12.00)

**Mains**
*   **Margherita Pizza** ($14.00) - Vegetarian
*   **Spaghetti Carbonara** ($16.00)
*   **Grilled Salmon** ($22.00) - Gluten-Free

**Desserts**
*   **Tiramisu** ($8.00) - Vegetarian
*   **Panna Cotta** ($7.00) - Gluten-Free

**Drinks**
*   **Italian Soda** ($4.00)
*   **Espresso** ($3.00)

## Resetting the Database

If you encounter schema conflicts or want a fresh start, you can reset the database. This will **DROP ALL TABLES**.

```bash
# Reset database (Drop all tables)
npx tsx --require dotenv/config src/lib/db/reset.ts

# Re-apply migrations
npm run db:migrate

# Re-seed data
npm run db:seed
```
