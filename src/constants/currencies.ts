// Currency options
export const CURRENCY_OPTIONS = [
	{ code: "USD", name: "US Dollar", symbol: "$" },
	{ code: "EUR", name: "Euro", symbol: "€" },
	{ code: "GBP", name: "British Pound", symbol: "£" },
	{ code: "JPY", name: "Japanese Yen", symbol: "¥" },
	{ code: "CAD", name: "Canadian Dollar", symbol: "C$" },
	{ code: "AUD", name: "Australian Dollar", symbol: "A$" },
	{ code: "CHF", name: "Swiss Franc", symbol: "CHF" },
	{ code: "CNY", name: "Chinese Yuan", symbol: "¥" },
	{ code: "INR", name: "Indian Rupee", symbol: "₹" },
	{ code: "BRL", name: "Brazilian Real", symbol: "R$" },
	{ code: "MXN", name: "Mexican Peso", symbol: "$" },
	{ code: "SGD", name: "Singapore Dollar", symbol: "S$" },
	{ code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
	{ code: "NOK", name: "Norwegian Krone", symbol: "kr" },
	{ code: "SEK", name: "Swedish Krona", symbol: "kr" },
	{ code: "DKK", name: "Danish Krone", symbol: "kr" },
	{ code: "PLN", name: "Polish Złoty", symbol: "zł" },
	{ code: "CZK", name: "Czech Koruna", symbol: "Kč" },
	{ code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
	{ code: "AED", name: "UAE Dirham", symbol: "د.إ" },
] as const;

export interface Currency {
	code: string;
	name: string;
	symbol: string;
}

export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number]["code"];
