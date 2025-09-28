import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// locales: ["en", "fr", "ar", "es", "lv", "ru"],
  locales: ["en", "ar"],
	defaultLocale: "en",
	localePrefix: "always",
	localeCookie: true,
	localeDetection: true,
});

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  // { code: 'fr', name: 'Français', flag: '🇫🇷' },
  // { code: 'es', name: 'Español', flag: '🇪🇸' },
  // { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  // { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export type Locale = (typeof routing.locales)[number];