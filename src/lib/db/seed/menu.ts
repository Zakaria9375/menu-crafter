import db from "../index";
import { categories, menuItems, type Tenant } from "../schema";

/**
 * Seeds menu categories and items for a tenant
 * @param tenant - The tenant to create menu for
 * @returns Object containing created categories and menu items
 */
export async function seedMenu(tenant: Tenant) {
	console.log(`🍽️  Creating menu for ${tenant.name}...`);

	const createdCategories = await db
		.insert(categories)
		.values([
			{ tenantId: tenant.id, name: "Appetizers", order: 0 },
			{ tenantId: tenant.id, name: "Mains", order: 1 },
			{ tenantId: tenant.id, name: "Desserts", order: 2 },
			{ tenantId: tenant.id, name: "Drinks", order: 3 },
		])
		.returning();

	console.log(`✅ Created ${createdCategories.length} categories`);

	const createdItems = await db
		.insert(menuItems)
		.values([
			// Appetizers
			{
				categoryId: createdCategories[0].id,
				name: "Bruschetta",
				description: "Toasted bread with tomatoes, garlic, and basil",
				price: "$8.00",
				dietary: ["vegetarian"],
				order: 0,
			},
			{
				categoryId: createdCategories[0].id,
				name: "Calamari",
				description: "Fried squid rings with marinara sauce",
				price: "$12.00",
				order: 1,
			},
			// Mains
			{
				categoryId: createdCategories[1].id,
				name: "Margherita Pizza",
				description: "Tomato sauce, mozzarella, and basil",
				price: "$14.00",
				dietary: ["vegetarian"],
				order: 0,
			},
			{
				categoryId: createdCategories[1].id,
				name: "Spaghetti Carbonara",
				description: "Pasta with eggs, cheese, pancetta, and pepper",
				price: "$16.00",
				order: 1,
			},
			{
				categoryId: createdCategories[1].id,
				name: "Grilled Salmon",
				description: "Fresh Atlantic salmon with seasonal vegetables",
				price: "$22.00",
				dietary: ["gluten-free"],
				order: 2,
			},
			// Desserts
			{
				categoryId: createdCategories[2].id,
				name: "Tiramisu",
				description: "Coffee-flavoured Italian dessert",
				price: "$8.00",
				dietary: ["vegetarian"],
				order: 0,
			},
			{
				categoryId: createdCategories[2].id,
				name: "Panna Cotta",
				description: "Italian dessert of sweetened cream thickened with gelatin",
				price: "$7.00",
				dietary: ["gluten-free"],
				order: 1,
			},
			// Drinks
			{
				categoryId: createdCategories[3].id,
				name: "Italian Soda",
				description: "Sparkling water with flavored syrup",
				price: "$4.00",
				order: 0,
			},
			{
				categoryId: createdCategories[3].id,
				name: "Espresso",
				description: "Strong black coffee",
				price: "$3.00",
				order: 1,
			},
		])
		.returning();

	console.log(`✅ Created ${createdItems.length} menu items`);

	return { categories: createdCategories, menuItems: createdItems };
}
