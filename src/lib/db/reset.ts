import db from './index';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('🗑️ Dropping all tables...');
  
  // Disable foreign key checks temporarily if possible, or just drop cascade
  await db.execute(sql`DROP SCHEMA public CASCADE;`);
  await db.execute(sql`CREATE SCHEMA public;`);
  await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
  await db.execute(sql`COMMENT ON SCHEMA public IS 'standard public schema';`);

  console.log('✅ Database reset complete');
}

main()
  .catch((e) => {
    console.error('❌ Error resetting database:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
