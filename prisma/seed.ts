import { PrismaClient } from '../src/lib/db/generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await prisma.membership.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.authenticator.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        passwordHash: hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        passwordHash: hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        passwordHash: hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Diana Prince',
        email: 'diana@example.com',
        passwordHash: hashedPassword,
        emailVerified: null, // Unverified email
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create tenants
  console.log('🏢 Creating tenants...');
  
  const tenants = await Promise.all([
    prisma.tenant.create({
      data: {
        name: 'Bella Italia Restaurant',
        slug: 'bella-italia',
        phoneNumber: '+1234567890',
        address: '123 Main St, New York, NY 10001',
      },
    }),
    prisma.tenant.create({
      data: {
        name: 'Sushi Palace',
        slug: 'sushi-palace',
        phoneNumber: '+1234567891',
        address: '456 Ocean Ave, San Francisco, CA 94102',
      },
    }),
    prisma.tenant.create({
      data: {
        name: 'Burger Heaven',
        slug: 'burger-heaven',
        phoneNumber: '+1234567892',
        address: '789 Burger Blvd, Austin, TX 78701',
      },
    }),
    prisma.tenant.create({
      data: {
        name: 'Vegan Delights',
        slug: 'vegan-delights',
        phoneNumber: '+1234567893',
        address: '321 Green St, Portland, OR 97201',
      },
    }),
    prisma.tenant.create({
      data: {
        name: 'Cafe Mocha',
        slug: 'cafe-mocha',
        phoneNumber: '+1234567894',
        address: '654 Coffee Rd, Seattle, WA 98101',
      },
    }),
  ]);

  console.log(`✅ Created ${tenants.length} tenants`);

  // Create memberships
  console.log('🔗 Creating memberships...');
  
  const memberships = await Promise.all([
    // John is OWNER of Bella Italia
    prisma.membership.create({
      data: {
        userId: users[0].id, // John
        tenantId: tenants[0].id, // Bella Italia
        role: 'OWNER',
      },
    }),
    // Jane is ADMIN of Bella Italia
    prisma.membership.create({
      data: {
        userId: users[1].id, // Jane
        tenantId: tenants[0].id, // Bella Italia
        role: 'ADMIN',
      },
    }),
    // Bob is STAFF at Bella Italia
    prisma.membership.create({
      data: {
        userId: users[2].id, // Bob
        tenantId: tenants[0].id, // Bella Italia
        role: 'STAFF',
      },
    }),

    // Jane is OWNER of Sushi Palace
    prisma.membership.create({
      data: {
        userId: users[1].id, // Jane
        tenantId: tenants[1].id, // Sushi Palace
        role: 'OWNER',
      },
    }),
    // Alice is ADMIN of Sushi Palace
    prisma.membership.create({
      data: {
        userId: users[3].id, // Alice
        tenantId: tenants[1].id, // Sushi Palace
        role: 'ADMIN',
      },
    }),

    // Charlie is OWNER of Burger Heaven
    prisma.membership.create({
      data: {
        userId: users[4].id, // Charlie
        tenantId: tenants[2].id, // Burger Heaven
        role: 'OWNER',
      },
    }),
    // Bob is MEMBER of Burger Heaven
    prisma.membership.create({
      data: {
        userId: users[2].id, // Bob
        tenantId: tenants[2].id, // Burger Heaven
        role: 'MEMBER',
      },
    }),

    // Alice is OWNER of Vegan Delights
    prisma.membership.create({
      data: {
        userId: users[3].id, // Alice
        tenantId: tenants[3].id, // Vegan Delights
        role: 'OWNER',
      },
    }),
    // Diana is STAFF at Vegan Delights
    prisma.membership.create({
      data: {
        userId: users[5].id, // Diana
        tenantId: tenants[3].id, // Vegan Delights
        role: 'STAFF',
      },
    }),

    // John is OWNER of Cafe Mocha
    prisma.membership.create({
      data: {
        userId: users[0].id, // John
        tenantId: tenants[4].id, // Cafe Mocha
        role: 'OWNER',
      },
    }),
    // Charlie is ADMIN of Cafe Mocha
    prisma.membership.create({
      data: {
        userId: users[4].id, // Charlie
        tenantId: tenants[4].id, // Cafe Mocha
        role: 'ADMIN',
      },
    }),
    // Diana is MEMBER of Cafe Mocha
    prisma.membership.create({
      data: {
        userId: users[5].id, // Diana
        tenantId: tenants[4].id, // Cafe Mocha
        role: 'MEMBER',
      },
    }),
  ]);

  console.log(`✅ Created ${memberships.length} memberships`);
/*
  // Create some OAuth accounts (optional - for users who logged in with Google)
  console.log('🔐 Creating OAuth accounts...');
  
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        userId: users[0].id, // John
        type: 'oauth',
        provider: 'google',
        providerAccountId: '1234567890',
        access_token: 'mock_access_token_john',
        refresh_token: 'mock_refresh_token_john',
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        token_type: 'Bearer',
        scope: 'openid profile email',
        id_token: 'mock_id_token_john',
      },
    }),
    prisma.account.create({
      data: {
        userId: users[1].id, // Jane
        type: 'oauth',
        provider: 'google',
        providerAccountId: '0987654321',
        access_token: 'mock_access_token_jane',
        refresh_token: 'mock_refresh_token_jane',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'Bearer',
        scope: 'openid profile email',
        id_token: 'mock_id_token_jane',
      },
    }),
  ]);

  console.log(`✅ Created ${accounts.length} OAuth accounts`);

  // Create verification tokens for unverified users
  console.log('📧 Creating verification tokens...');
  
  const verificationTokens = await Promise.all([
    prisma.verificationToken.create({
      data: {
        identifier: users[5].email, // Diana (unverified)
        token: 'mock_verification_token_diana_' + Date.now(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    }),
  ]);

  console.log(`✅ Created ${verificationTokens.length} verification tokens`);
*/
  // Print summary
  console.log('\n📊 Seeding Summary:');
  console.log('='.repeat(50));
  console.log(`👥 Users: ${users.length}`);
  console.log(`🏢 Tenants: ${tenants.length}`);
  console.log(`🔗 Memberships: ${memberships.length}`);
  //console.log(`🔐 OAuth Accounts: ${accounts.length}`);
  //console.log(`📧 Verification Tokens: ${verificationTokens.length}`);
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
    await prisma.$disconnect();
  });

