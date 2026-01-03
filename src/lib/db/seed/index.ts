import { clearDatabase, printSummary, printCredentials } from "./utils";
import { seedUsers } from "./users";
import { seedTenants } from "./tenants";
import { seedTenantDetails } from "./tenant-details";
import { seedMemberships } from "./memberships";
import { seedMenu } from "./menu";

async function main() {
	console.log("🌱 Starting database seeding...");

	// Clear existing data
	await clearDatabase();

	// Seed users
	const createdUsers = await seedUsers();

	// Seed tenants
	const createdTenants = await seedTenants();

	// Seed tenant details
	await seedTenantDetails(createdTenants);

	// Seed memberships
	const createdMemberships = await seedMemberships(createdUsers, createdTenants);

	// Seed menu for first tenant (Bella Italia)
	const { categories: createdCategories, menuItems: createdItems } =
		await seedMenu(createdTenants[0]);

	// Print summary
	printSummary({
		users: createdUsers.length,
		tenants: createdTenants.length,
		memberships: createdMemberships.length,
		categories: createdCategories.length,
		menuItems: createdItems.length,
	});

	// Print credentials
	printCredentials();

	console.log("\n✨ Database seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		process.exit(0);
	});
