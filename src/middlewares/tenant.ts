import { NextRequest, NextResponse } from "next/server";
import { splitLocale } from "./helper";
import { intlMiddleware } from "./intl";
import { getCurrentLocale } from "@/utils/getCurrentLocale";
import { Locale } from "@/i18n/routing";
import db from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


const PRIVATE_TENANT_ROUTES = [
	"/admin",
];

function isPrivateRoute(pathNoLocale: string): boolean {
	return PRIVATE_TENANT_ROUTES.some((route) => pathNoLocale === route || pathNoLocale.startsWith(route));
}

export const tenantMiddleware = async (request: NextRequest, tenantSlug: string) => {
	const { pathNoLocale, locale: requestedLocale, hasLocale } = splitLocale(request.nextUrl.pathname);
	let locale = requestedLocale;
	if (!hasLocale) {
		locale = (await getCurrentLocale()) as Locale;
	}

	if (tenantSlug) {
		// Check if tenant exists in database
		const tenant = await db.select({ id: tenants.id, slug: tenants.slug })
			.from(tenants)
			.where(eq(tenants.slug, tenantSlug))
			.limit(1);

		if (tenant.length === 0) {
			// Tenant doesn't exist - show 404
			return NextResponse.rewrite(
				new URL(`/${locale}/not-found`, request.url)
			);
		}
		// If no locale in URL, redirect to add locale (keeping subdomain)
		if (!hasLocale) {
			const url = new URL(request.url);
			url.pathname = `/${locale}${pathNoLocale}`;
			return NextResponse.redirect(url);
		}

		// Check if this is a public route
		if (!isPrivateRoute(pathNoLocale)) {
			// Public route - serve from subdomain, no auth required
			return NextResponse.rewrite(
				new URL(`/${locale}/${tenantSlug}${pathNoLocale}`, request.url)
			);
		} else {
			// Non-public route accessed on subdomain - show 404
			// Protected routes should be accessed via main domain (e.g., localhost:3000/en/cafe-mocha/admin)
			return NextResponse.rewrite(
				new URL(`/${locale}/not-found`, request.url)
			);
		}
	}
	return intlMiddleware(request);
};
