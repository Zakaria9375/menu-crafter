import { routing } from "@/i18n/routing";
import { Locale } from "next-intl";
import { cookies } from "next/headers";

export const getCurrentLocale = async (): Promise<Locale> => {
	const cookie = await cookies();
	const locale = cookie.get('NEXT_LOCALE');
	return locale?.value as Locale || routing.defaultLocale;
}