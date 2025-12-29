// Language options with their native names
export const LANGUAGE_OPTIONS = [
	{ code: "en", name: "English", nativeName: "English" },
	{ code: "ar", name: "Arabic", nativeName: "العربية" },
	{ code: "zh", name: "Chinese", nativeName: "中文" },
	{ code: "fr", name: "French", nativeName: "Français" },
	{ code: "de", name: "German", nativeName: "Deutsch" },
	{ code: "hi", name: "Hindi", nativeName: "हिन्दी" },
	{ code: "it", name: "Italian", nativeName: "Italiano" },
	{ code: "ja", name: "Japanese", nativeName: "日本語" },
	{ code: "ko", name: "Korean", nativeName: "한국어" },
	{ code: "pt", name: "Portuguese", nativeName: "Português" },
	{ code: "ru", name: "Russian", nativeName: "Русский" },
	{ code: "es", name: "Spanish", nativeName: "Español" },
	{ code: "tr", name: "Turkish", nativeName: "Türkçe" },
	{ code: "nl", name: "Dutch", nativeName: "Nederlands" },
	{ code: "sv", name: "Swedish", nativeName: "Svenska" },
	{ code: "no", name: "Norwegian", nativeName: "Norsk" },
	{ code: "da", name: "Danish", nativeName: "Dansk" },
	{ code: "fi", name: "Finnish", nativeName: "Suomi" },
	{ code: "pl", name: "Polish", nativeName: "Polski" },
	{ code: "cs", name: "Czech", nativeName: "Čeština" },
] as const;

export interface Language {
	code: string;
	name: string;
	nativeName: string;
}

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["code"];
