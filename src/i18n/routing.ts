import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "fr", "ar", "es"],
	defaultLocale: "en",
	localePrefix: "as-needed",
	localeCookie: true,
	localeDetection: true,
});

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

export type Locale = (typeof routing.locales)[number];