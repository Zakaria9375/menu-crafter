import db from "../index";
import { memberships, type User, type Tenant } from "../schema";

/**
 * Seeds memberships (user-tenant relationships) into the database
 * @param users - Array of created users
 * @param tenants - Array of created tenants
 * @returns Array of created memberships
 */
export async function seedMemberships(users: User[], tenants: Tenant[]) {
	console.log("🔗 Creating memberships...");

	const createdMemberships = await db
		.insert(memberships)
		.values([
			// John is OWNER of Bella Italia
			{
				userId: users[0].id,
				tenantId: tenants[0].id,
				role: "OWNER",
			},
			// Jane is ADMIN of Bella Italia
			{
				userId: users[1].id,
				tenantId: tenants[0].id,
				role: "ADMIN",
			},
			// Bob is STAFF at Bella Italia
			{
				userId: users[2].id,
				tenantId: tenants[0].id,
				role: "STAFF",
			},

			// Jane is OWNER of Sushi Palace
			{
				userId: users[1].id,
				tenantId: tenants[1].id,
				role: "OWNER",
			},
			// Alice is ADMIN of Sushi Palace
			{
				userId: users[3].id,
				tenantId: tenants[1].id,
				role: "ADMIN",
			},

			// Charlie is OWNER of Burger Heaven
			{
				userId: users[4].id,
				tenantId: tenants[2].id,
				role: "OWNER",
			},
			// Bob is MEMBER of Burger Heaven
			{
				userId: users[2].id,
				tenantId: tenants[2].id,
				role: "MEMBER",
			},

			// Alice is OWNER of Vegan Delights
			{
				userId: users[3].id,
				tenantId: tenants[3].id,
				role: "OWNER",
			},
			// Diana is STAFF at Vegan Delights
			{
				userId: users[5].id,
				tenantId: tenants[3].id,
				role: "STAFF",
			},

			// John is OWNER of Cafe Mocha
			{
				userId: users[0].id,
				tenantId: tenants[4].id,
				role: "OWNER",
			},
			// Charlie is ADMIN of Cafe Mocha
			{
				userId: users[4].id,
				tenantId: tenants[4].id,
				role: "ADMIN",
			},
			// Diana is MEMBER of Cafe Mocha
			{
				userId: users[5].id,
				tenantId: tenants[4].id,
				role: "MEMBER",
			},
		])
		.returning();

	console.log(`✅ Created ${createdMemberships.length} memberships`);

	return createdMemberships;
}
