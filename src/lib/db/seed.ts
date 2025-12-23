import db from './index';
import { users, tenants, memberships, categories, menuItems } from './schema';
import * as bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await db.delete(menuItems);
  await db.delete(categories);
  await db.delete(memberships);
  await db.delete(tenants);
  await db.delete(users);

  // Create users
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const createdUsers = await db.insert(users).values([
    {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: hashedPassword,
      emailVerified: new Date(),
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: hashedPassword,
      emailVerified: new Date(),
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      passwordHash: hashedPassword,
      emailVerified: new Date(),
    },
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: hashedPassword,
      emailVerified: new Date(),
    },
    {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      passwordHash: hashedPassword,
      emailVerified: new Date(),
    },
    {
      name: 'Diana Prince',
      email: 'diana@example.com',
      passwordHash: hashedPassword,
      emailVerified: null, // Unverified email
    },
  ]).returning();

  console.log(`✅ Created ${createdUsers.length} users`);

  // Create tenants
  console.log('🏢 Creating tenants...');
  
  const createdTenants = await db.insert(tenants).values([
    {
      name: 'Bella Italia Restaurant',
      slug: 'bella-italia',
      phoneNumber: '+1234567890',
      address: '123 Main St, New York, NY 10001',
      email: 'info@bellaitalia.com',
    },
    {
      name: 'Sushi Palace',
      slug: 'sushi-palace',
      phoneNumber: '+1234567891',
      address: '456 Ocean Ave, San Francisco, CA 94102',
      email: 'info@sushipalace.com',
    },
    {
      name: 'Burger Heaven',
      slug: 'burger-heaven',
      phoneNumber: '+1234567892',
      address: '789 Burger Blvd, Austin, TX 78701',
      email: 'info@burgerheaven.com',
    },
    {
      name: 'Vegan Delights',
      slug: 'vegan-delights',
      phoneNumber: '+1234567893',
      address: '321 Green St, Portland, OR 97201',
      email: 'info@vegandelights.com',
    },
    {
      name: 'Cafe Mocha',
      slug: 'cafe-mocha',
      phoneNumber: '+1234567894',
      address: '654 Coffee Rd, Seattle, WA 98101',
      email: 'info@cafemocha.com',
    },
  ]).returning();

  console.log(`✅ Created ${createdTenants.length} tenants`);

  // Create memberships
  console.log('🔗 Creating memberships...');
  
  const createdMemberships = await db.insert(memberships).values([
    // John is OWNER of Bella Italia
    {
      userId: createdUsers[0].id,
      tenantId: createdTenants[0].id,
      role: 'OWNER',
    },
    // Jane is ADMIN of Bella Italia
    {
      userId: createdUsers[1].id,
      tenantId: createdTenants[0].id,
      role: 'ADMIN',
    },
    // Bob is STAFF at Bella Italia
    {
      userId: createdUsers[2].id,
      tenantId: createdTenants[0].id,
      role: 'STAFF',
    },

    // Jane is OWNER of Sushi Palace
    {
      userId: createdUsers[1].id,
      tenantId: createdTenants[1].id,
      role: 'OWNER',
    },
    // Alice is ADMIN of Sushi Palace
    {
      userId: createdUsers[3].id,
      tenantId: createdTenants[1].id,
      role: 'ADMIN',
    },

    // Charlie is OWNER of Burger Heaven
    {
      userId: createdUsers[4].id,
      tenantId: createdTenants[2].id,
      role: 'OWNER',
    },
    // Bob is MEMBER of Burger Heaven
    {
      userId: createdUsers[2].id,
      tenantId: createdTenants[2].id,
      role: 'MEMBER',
    },

    // Alice is OWNER of Vegan Delights
    {
      userId: createdUsers[3].id,
      tenantId: createdTenants[3].id,
      role: 'OWNER',
    },
    // Diana is STAFF at Vegan Delights
    {
      userId: createdUsers[5].id,
      tenantId: createdTenants[3].id,
      role: 'STAFF',
    },

    // John is OWNER of Cafe Mocha
    {
      userId: createdUsers[0].id,
      tenantId: createdTenants[4].id,
      role: 'OWNER',
    },
    // Charlie is ADMIN of Cafe Mocha
    {
      userId: createdUsers[4].id,
      tenantId: createdTenants[4].id,
      role: 'ADMIN',
    },
    // Diana is MEMBER of Cafe Mocha
    {
      userId: createdUsers[5].id,
      tenantId: createdTenants[4].id,
      role: 'MEMBER',
    },
  ]).returning();

  console.log(`✅ Created ${createdMemberships.length} memberships`);

  // Create Menu Data for Bella Italia
  console.log('🍽️ Creating menu for Bella Italia...');
  const bellaItalia = createdTenants[0];

  const createdCategories = await db.insert(categories).values([
    { tenantId: bellaItalia.id, name: 'Appetizers', order: 0 },
    { tenantId: bellaItalia.id, name: 'Mains', order: 1 },
    { tenantId: bellaItalia.id, name: 'Desserts', order: 2 },
    { tenantId: bellaItalia.id, name: 'Drinks', order: 3 },
  ]).returning();

  console.log(`✅ Created ${createdCategories.length} categories`);

  const createdItems = await db.insert(menuItems).values([
    // Appetizers
    {
      categoryId: createdCategories[0].id,
      name: 'Bruschetta',
      description: 'Toasted bread with tomatoes, garlic, and basil',
      price: '$8.00',
      dietary: ['vegetarian'],
      order: 0,
    },
    {
      categoryId: createdCategories[0].id,
      name: 'Calamari',
      description: 'Fried squid rings with marinara sauce',
      price: '$12.00',
      order: 1,
    },
    // Mains
    {
      categoryId: createdCategories[1].id,
      name: 'Margherita Pizza',
      description: 'Tomato sauce, mozzarella, and basil',
      price: '$14.00',
      dietary: ['vegetarian'],
      order: 0,
    },
    {
      categoryId: createdCategories[1].id,
      name: 'Spaghetti Carbonara',
      description: 'Pasta with eggs, cheese, pancetta, and pepper',
      price: '$16.00',
      order: 1,
    },
    {
      categoryId: createdCategories[1].id,
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with seasonal vegetables',
      price: '$22.00',
      dietary: ['gluten-free'],
      order: 2,
    },
    // Desserts
    {
      categoryId: createdCategories[2].id,
      name: 'Tiramisu',
      description: 'Coffee-flavoured Italian dessert',
      price: '$8.00',
      dietary: ['vegetarian'],
      order: 0,
    },
    {
      categoryId: createdCategories[2].id,
      name: 'Panna Cotta',
      description: 'Italian dessert of sweetened cream thickened with gelatin',
      price: '$7.00',
      dietary: ['gluten-free'],
      order: 1,
    },
    // Drinks
    {
      categoryId: createdCategories[3].id,
      name: 'Italian Soda',
      description: 'Sparkling water with flavored syrup',
      price: '$4.00',
      order: 0,
    },
    {
      categoryId: createdCategories[3].id,
      name: 'Espresso',
      description: 'Strong black coffee',
      price: '$3.00',
      order: 1,
    },
  ]).returning();

  console.log(`✅ Created ${createdItems.length} menu items`);

  // Print summary
  console.log('\n📊 Seeding Summary:');
  console.log('='.repeat(50));
  console.log(`👥 Users: ${createdUsers.length}`);
  console.log(`🏢 Tenants: ${createdTenants.length}`);
  console.log(`🔗 Memberships: ${createdMemberships.length}`);
  console.log(`📂 Categories: ${createdCategories.length}`);
  console.log(`🍽️ Menu Items: ${createdItems.length}`);
  console.log('='.repeat(50));

  console.log('\n📝 Test Credentials:');
  console.log('='.repeat(50));
  console.log('All users have password: password123');
  console.log('\nUsers and their tenants:');
  console.log('');
  console.log('john@example.com:');
  console.log('  - OWNER of bella-italia (Bella Italia Restaurant)');
  console.log('  - OWNER of cafe-mocha (Cafe Mocha)');
  console.log('');
  console.log('jane@example.com:');
  console.log('  - ADMIN of bella-italia (Bella Italia Restaurant)');
  console.log('  - OWNER of sushi-palace (Sushi Palace)');
  console.log('');
  console.log('bob@example.com:');
  console.log('  - STAFF at bella-italia (Bella Italia Restaurant)');
  console.log('  - MEMBER of burger-heaven (Burger Heaven)');
  console.log('');
  console.log('alice@example.com:');
  console.log('  - ADMIN of sushi-palace (Sushi Palace)');
  console.log('  - OWNER of vegan-delights (Vegan Delights)');
  console.log('');
  console.log('charlie@example.com:');
  console.log('  - OWNER of burger-heaven (Burger Heaven)');
  console.log('  - ADMIN of cafe-mocha (Cafe Mocha)');
  console.log('');
  console.log('diana@example.com (unverified):');
  console.log('  - STAFF at vegan-delights (Vegan Delights)');
  console.log('  - MEMBER of cafe-mocha (Cafe Mocha)');
  console.log('');
  console.log('Tenant URLs (local):');
  console.log('  - http://bella-italia.localhost:3000');
  console.log('  - http://sushi-palace.localhost:3000');
  console.log('  - http://burger-heaven.localhost:3000');
  console.log('  - http://vegan-delights.localhost:3000');
  console.log('  - http://cafe-mocha.localhost:3000');
  console.log('='.repeat(50));

  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });

