import db from "../index";
import { tenants } from "../schema";
import { tenantsData } from "./data/tenants.data";

/**
 * Seeds tenants into the database
 * @returns Array of created tenants
 */
export async function seedTenants() {
	console.log("🏢 Creating tenants...");

	const createdTenants = await db.insert(tenants).values(tenantsData).returning();

	console.log(`✅ Created ${createdTenants.length} tenants`);

	return createdTenants;
}
