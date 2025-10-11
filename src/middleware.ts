/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { appMiddleware } from "./middlewares/app";
import { tenantMiddleware } from "./middlewares/tenant";
import { extractSubdomain } from "./middlewares/helper";

export default async function middleware(request: NextRequest) {
	const subdomain = extractSubdomain(request);
	if(subdomain) {
		return await tenantMiddleware(request, subdomain);
	}
	return await appMiddleware(request, {} as any);
}
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
