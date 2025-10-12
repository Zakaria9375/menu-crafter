// src/middlewares/app.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { intlMiddleware } from "./intl";
import { isTenantRoute, splitLocale } from "./helper";

// Public/auth route config (locale-agnostic)
const PUBLIC_EXACT = ["/", "/pricing", "/contact", "/faq", "/terms", "/privacy", "/demo", "/features", "/help-center"];
const PUBLIC_PREFIX: string[] = [];
const AUTH_PAGES = ["/login", "/register", "/password-reset", "/change-password"];

// ---- match helpers ----
const isPublic = (p: string) =>
	PUBLIC_EXACT.includes(p) || PUBLIC_PREFIX.some((pref) => p.startsWith(pref));

const isAuthPage = (p: string) => AUTH_PAGES.includes(p);

// Check if path is a tenant route (e.g., /cafe-mocha/admin)

export const appMiddleware = auth(async (req: NextRequest) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const session = (req as any).auth;
	const loggedIn = !!session;
	const { pathNoLocale, locale } = splitLocale(req.nextUrl.pathname);

	// 1) Public → allow
	if (isPublic(pathNoLocale)) {
		return intlMiddleware(req);
	}

	// 2) Visiting an auth page
	if (isAuthPage(pathNoLocale)) {
		if (loggedIn) {
			// Check if user has tenants
			const memberships: Array<{ slug: string }> = session?.user?.memberships || [];
			
			if (memberships.length > 0) {
				// User has tenants, redirect to first tenant's dashboard
				const redirectUrl = new URL(`/${locale}/${memberships[0].slug}/admin/dashboard`, req.url);
				return NextResponse.redirect(redirectUrl);
			} else {
				// User has no tenants, redirect to onboarding
				const redirectUrl = new URL(`/${locale}/onboarding`, req.url);
				return NextResponse.redirect(redirectUrl);
			}
		}
		return intlMiddleware(req);
	}

	const { isTenant, tenantSlug, remainingPath } = await isTenantRoute(
		pathNoLocale
	);

	if (isTenant && tenantSlug) {
		// This is a tenant-specific protected route
		if (!loggedIn) {
			// Not logged in - redirect to login
			const redirectUrl = new URL(`/${locale}/login`, req.url);
			redirectUrl.searchParams.set(
				"callbackUrl",
				`/${locale}/${tenantSlug}${remainingPath}`
			);
			return NextResponse.redirect(redirectUrl);
		}

		// Check if user has access to this tenant
		const memberships: Array<{ slug: string; id: string; role: string }> =
			session?.user?.memberships || [];

		if (memberships.length === 0) {
			const redirectUrl = new URL(`/${locale}/onboarding`, req.url);
			return NextResponse.redirect(redirectUrl);
		}
		const hasAccess = memberships.some(
			(m: { slug: string }) => m.slug === tenantSlug
		);

		if (!hasAccess) {
			// User has other tenants but not this one - show 403 forbidden
			const redirectUrl = new URL(`/${locale}/forbidden`, req.url);
			redirectUrl.searchParams.set('tenant', tenantSlug);
			return NextResponse.redirect(redirectUrl);
		}

		// User has access - allow
		return intlMiddleware(req);
	}

	// 3) Protected: require login
	if (!loggedIn) {
		const redirectUrl = new URL(`/${locale}/login`, req.url);
		return NextResponse.redirect(redirectUrl);
	}

	// 4) Authorized
	return intlMiddleware(req);
});
