import db from "@/lib/db";
import { tenantDetails } from "@/lib/db/schema";
import { IWebsiteConfig } from "@/types/website";
import { eq } from "drizzle-orm";

export async function getWebsiteConfig(tenantId: string) {
	try {
		const details = await db.query.tenantDetails.findFirst({
			where: eq(tenantDetails.tenantId, tenantId),
			columns: {
				websiteConfig: true,
			},
		});

		// Parse if it's a string (just in case Drizzle doesn't handle it automatically for some reason, though it should)
		let config = details?.websiteConfig || {};
		if (typeof config === "string") {
			try {
				config = JSON.parse(config);
			} catch (e) {
				console.error("Failed to parse websiteConfig JSON:", e);
				config = {};
			}
		}

		return {
			success: true,
			data: config as IWebsiteConfig,
		};
	} catch (error) {
		console.error("Error fetching website config:", error);
		return { success: false, error: "Failed to fetch website configuration" };
	}
}

export async function updateWebsiteConfig(
	tenantId: string,
	data: IWebsiteConfig
) {
	try {
		// Ensure data is an object
		const configData = typeof data === "string" ? JSON.parse(data) : data;

		const result = await db
			.update(tenantDetails)
			.set({ websiteConfig: configData })
			.where(eq(tenantDetails.tenantId, tenantId))
			.returning({ websiteConfig: tenantDetails.websiteConfig });

		return { success: true, data: result[0]?.websiteConfig as IWebsiteConfig };
	} catch (error) {
		console.error("Error updating website config:", error);
		return { success: false, error: "Failed to update website configuration" };
	}
}
