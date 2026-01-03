import db from "../index";
import { tenantDetails, type Tenant } from "../schema";
import { websiteConfigsData } from "./data/website-configs.data";

/**
 * Seeds tenant details into the database
 * @param tenants - Array of created tenants
 * @returns Array of created tenant details
 */
export async function seedTenantDetails(tenants: Tenant[]) {
	console.log("📝 Creating tenant details...");

	const createdTenantDetails = await db
		.insert(tenantDetails)
		.values(
			tenants.map((tenant, index) => ({
				tenantId: tenant.id,
				...websiteConfigsData[index],
			}))
		)
		.returning();

	console.log(`✅ Created ${createdTenantDetails.length} tenant details`);

	return createdTenantDetails;
}
