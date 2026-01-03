import db from "../index";
import {
	users,
	tenants,
	memberships,
	categories,
	menuItems,
	tenantDetails,
} from "../schema";

/**
 * Clears all data from the database (in reverse order of dependencies)
 */
export async function clearDatabase() {
	console.log("🧹 Cleaning existing data...");
	await db.delete(menuItems);
	await db.delete(categories);
	await db.delete(memberships);
	await db.delete(tenantDetails);
	await db.delete(tenants);
	await db.delete(users);
}

/**
 * Prints a summary of the seeding operation
 */
export function printSummary(counts: {
	users: number;
	tenants: number;
	memberships: number;
	categories: number;
	menuItems: number;
}) {
	console.log("\n📊 Seeding Summary:");
	console.log("=".repeat(50));
	console.log(`👥 Users: ${counts.users}`);
	console.log(`🏢 Tenants: ${counts.tenants}`);
	console.log(`🔗 Memberships: ${counts.memberships}`);
	console.log(`📂 Categories: ${counts.categories}`);
	console.log(`🍽️  Menu Items: ${counts.menuItems}`);
	console.log("=".repeat(50));
}

/**
 * Prints test credentials and tenant information
 */
export function printCredentials() {
	console.log("\n📝 Test Credentials:");
	console.log("=".repeat(50));
	console.log("All users have password: password123");
	console.log("\nUsers and their tenants:");
	console.log("");
	console.log("john@example.com:");
	console.log("  - OWNER of bella-italia (Bella Italia Restaurant)");
	console.log("  - OWNER of cafe-mocha (Cafe Mocha)");
	console.log("");
	console.log("jane@example.com:");
	console.log("  - ADMIN of bella-italia (Bella Italia Restaurant)");
	console.log("  - OWNER of sushi-palace (Sushi Palace)");
	console.log("");
	console.log("bob@example.com:");
	console.log("  - STAFF at bella-italia (Bella Italia Restaurant)");
	console.log("  - MEMBER of burger-heaven (Burger Heaven)");
	console.log("");
	console.log("alice@example.com:");
	console.log("  - ADMIN of sushi-palace (Sushi Palace)");
	console.log("  - OWNER of vegan-delights (Vegan Delights)");
	console.log("");
	console.log("charlie@example.com:");
	console.log("  - OWNER of burger-heaven (Burger Heaven)");
	console.log("  - ADMIN of cafe-mocha (Cafe Mocha)");
	console.log("");
	console.log("diana@example.com (unverified):");
	console.log("  - STAFF at vegan-delights (Vegan Delights)");
	console.log("  - MEMBER of cafe-mocha (Cafe Mocha)");
	console.log("");
	console.log("Tenant URLs (local):");
	console.log("  - http://bella-italia.localhost:3000");
	console.log("  - http://sushi-palace.localhost:3000");
	console.log("  - http://burger-heaven.localhost:3000");
	console.log("  - http://vegan-delights.localhost:3000");
	console.log("  - http://cafe-mocha.localhost:3000");
	console.log("=".repeat(50));
}
