import { hasLocale as isLocale } from "next-intl";
import { Locale, routing } from "../i18n/routing";
import { NextRequest } from "next/server";
import db from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** Utility: split out the first segment if it's a known locale */
export function splitLocale(pathname: string): {
	hasLocale: boolean;
	locale: Locale;
	pathNoLocale: string;
} {
	const segments = pathname.split("/").filter(Boolean);
	const locale = segments[0] as Locale;
	const hasLocale = isLocale(routing.locales, locale);
	const pathNoLocale = hasLocale
		? "/" + segments.slice(1).join("/")
		: pathname || "/";
	return { hasLocale, locale, pathNoLocale };
}

/** Utility: build a localized path (supports localePrefix: 'always') */
export function toLocalizedPath(locale: string, pathNoLocale: string): string {
	const clean = pathNoLocale.startsWith("/")
		? pathNoLocale
		: `/${pathNoLocale}`;
	// With localePrefix: 'always', root becomes "/{locale}"
	return `/${locale}${clean === "/" ? "" : clean}`;
}

export function extractSubdomain(request: NextRequest): string | null {
	const host = request.headers.get("host") || "";
	const hostname = host.split(":")[0];

	/* Local environment */
	if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
		const parts = hostname.split(".");
		if (parts.length > 1) {
			return parts[0];
		}
		return null;
	}

	/* Handle Vercel environment */
	if (hostname?.includes("vercel.app")) {
		const parts = hostname.split(".");
		if (parts.length > 3) {
			return parts[0];
		}
		return null;
	}

	/* Handle Generic Domain environment */
	if (hostname?.includes(".")) {
		const parts = hostname.split(".");
		if (parts.length > 1) {
			return parts[0];
		}
		return null;
	}

	return null;
}

export const isTenantRoute = async (
	p: string
): Promise<{
	isTenant: boolean;
	tenantSlug?: string;
	remainingPath?: string;
}> => {
	const segments = p.split("/").filter(Boolean);
	// If path has at least 2 segments and doesn't start with known routes
	if (segments.length >= 1) {
		// First segment might be tenant slug
		const tenantSlug = segments[0];
		const tenant = await db
			.select({ id: tenants.id, slug: tenants.slug })
			.from(tenants)
			.where(eq(tenants.slug, tenantSlug))
			.limit(1);

		if (tenant.length === 0) {
			return { isTenant: false };
		}
		const remainingPath = "/" + segments.slice(1).join("/");
		return {
			isTenant: true,
			tenantSlug,
			remainingPath: remainingPath === "/" ? "" : remainingPath,
		};
	}
	return { isTenant: false };
};
