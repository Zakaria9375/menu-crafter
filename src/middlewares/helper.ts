import { hasLocale as isLocale } from "next-intl";
import { Locale, routing } from "../i18n/routing";
import { NextRequest } from "next/server";
import { parse } from 'tldts';
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
	const url = request.url;
	const { subdomain } = parse(url);
	const host = request.headers.get("host") || "";
	const hostname = host.split(":")[0];

	/* Local environment */
	if (url.includes("localhost") || url.includes("127.0.0.1")) {
		// Try to extract subdomain from the full URL
		const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
		if (fullUrlMatch && fullUrlMatch[1]) {
			return fullUrlMatch[1];
		}

		// Fallback to host header approach
		if (hostname.includes(".localhost")) {
			return hostname.split(".")[0];
		}

		return null;
	}


	/* Handle Vercel environment */
	if (subdomain?.includes(".")) {
		const parts = subdomain.split(".");
		return parts[0] || null;
	}

	return subdomain || null;
}


export const isTenantRoute = async (p: string): Promise<{ isTenant: boolean; tenantSlug?: string; remainingPath?: string }> => {
  const segments = p.split('/').filter(Boolean);
  // If path has at least 2 segments and doesn't start with known routes
  if (segments.length >= 1) {
    // First segment might be tenant slug
    const tenantSlug = segments[0];
		const tenant = await db.select({ id: tenants.id, slug: tenants.slug })
			.from(tenants)
			.where(eq(tenants.slug, tenantSlug))
			.limit(1);
			
		if (tenant.length === 0) {
			return { isTenant: false };
		}
    const remainingPath = '/' + segments.slice(1).join('/');
    return { isTenant: true, tenantSlug, remainingPath: remainingPath === '/' ? '' : remainingPath };
  }
  return { isTenant: false };
};
