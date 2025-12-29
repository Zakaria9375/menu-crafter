"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Search, Globe, DollarSign, Loader2 } from "lucide-react";
import { updateTenantDetails } from "@/lib/db/actions";
import { toast } from "sonner";

// Language options with their native names
const LANGUAGE_OPTIONS = [
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
];

// Currency options
const CURRENCY_OPTIONS = [
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
];

interface Language {
	code: string;
	name: string;
	nativeName: string;
}

interface Currency {
	code: string;
	name: string;
	symbol: string;
}

interface LanguagesCurrenciesTabProps {
	tenantId?: string; // Optional to handle undefined in parent initially
	initialData?: any;
}

export default function LanguagesCurrenciesTab({
	tenantId,
	initialData,
}: LanguagesCurrenciesTabProps) {
	// Parse initial languages
	const initialLangs = (initialData?.languages || ["en"]).map(
		(code: string) =>
			LANGUAGE_OPTIONS.find((l) => l.code === code) || {
				code,
				name: code,
				nativeName: code,
			}
	);

	const initialCurrs = (initialData?.currencies || ["USD"]).map(
		(code: string) =>
			CURRENCY_OPTIONS.find((c) => c.code === code) || {
				code,
				name: code,
				symbol: code,
			}
	);

	const [defaultLanguage, setDefaultLanguage] = useState<Language>(
		initialLangs[0] || LANGUAGE_OPTIONS[0]
	);
	const [additionalLanguages, setAdditionalLanguages] = useState<Language[]>(
		initialLangs.slice(1)
	);
	const [defaultCurrency, setDefaultCurrency] = useState<Currency>(
		initialCurrs[0] || CURRENCY_OPTIONS[0]
	);
	const [additionalCurrencies, setAdditionalCurrencies] = useState<Currency[]>(
		initialCurrs.slice(1)
	);
	const [languageSearch, setLanguageSearch] = useState("");
	const [currencySearch, setCurrencySearch] = useState("");
	const [isSavingLangs, setIsSavingLangs] = useState(false);
	const [isSavingCurrs, setIsSavingCurrs] = useState(false);

	const filteredLanguages = LANGUAGE_OPTIONS.filter(
		(lang) =>
			lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
			lang.nativeName.toLowerCase().includes(languageSearch.toLowerCase()) ||
			lang.code.toLowerCase().includes(languageSearch.toLowerCase())
	);

	const filteredCurrencies = CURRENCY_OPTIONS.filter(
		(curr) =>
			curr.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
			curr.code.toLowerCase().includes(currencySearch.toLowerCase())
	);

	const addLanguage = (language: Language) => {
		if (
			!additionalLanguages.find((l) => l.code === language.code) &&
			language.code !== defaultLanguage.code
		) {
			setAdditionalLanguages([...additionalLanguages, language]);
		}
		setLanguageSearch("");
	};

	const removeLanguage = (languageCode: string) => {
		setAdditionalLanguages(
			additionalLanguages.filter((l) => l.code !== languageCode)
		);
	};

	const addCurrency = (currency: Currency) => {
		if (
			!additionalCurrencies.find((c) => c.code === currency.code) &&
			currency.code !== defaultCurrency.code
		) {
			setAdditionalCurrencies([...additionalCurrencies, currency]);
		}
		setCurrencySearch("");
	};

	const removeCurrency = (currencyCode: string) => {
		setAdditionalCurrencies(
			additionalCurrencies.filter((c) => c.code !== currencyCode)
		);
	};

	const handleSaveLanguages = async () => {
		if (!tenantId) return;
		setIsSavingLangs(true);
		try {
			const languages = [
				defaultLanguage.code,
				...additionalLanguages.map((l) => l.code),
			];
			const result = await updateTenantDetails(tenantId, { languages });
			if (result.succeeded) {
				toast.success("Language settings saved");
			} else {
				toast.error(
					result.error?.message || "Failed to save language settings"
				);
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsSavingLangs(false);
		}
	};

	const handleSaveCurrencies = async () => {
		if (!tenantId) return;
		setIsSavingCurrs(true);
		try {
			const currencies = [
				defaultCurrency.code,
				...additionalCurrencies.map((c) => c.code),
			];
			const result = await updateTenantDetails(tenantId, { currencies });
			if (result.succeeded) {
				toast.success("Currency settings saved");
			} else {
				toast.error(
					result.error?.message || "Failed to save currency settings"
				);
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsSavingCurrs(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold text-foreground">
					Languages & Currencies
				</h2>
				<p className="text-muted-foreground mt-1">
					Configure your restaurant&apos;s language and currency settings
				</p>
			</div>

			<Tabs defaultValue="languages" className="space-y-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="languages" className="flex items-center gap-2">
						<Globe className="h-4 w-4" />
						Languages
					</TabsTrigger>
					<TabsTrigger value="currencies" className="flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						Currencies
					</TabsTrigger>
				</TabsList>

				<TabsContent value="languages" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Language Settings</CardTitle>
							<CardDescription>
								Set your default language and additional supported languages
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Default Language */}
							<div className="space-y-3">
								<Label className="text-base font-medium">
									Default Language
								</Label>
								<Select
									value={defaultLanguage.code}
									onValueChange={(value) => {
										const lang = LANGUAGE_OPTIONS.find((l) => l.code === value);
										if (lang) {
											setDefaultLanguage(lang);
											// Remove from additional if selected as default
											setAdditionalLanguages(
												additionalLanguages.filter((l) => l.code !== value)
											);
										}
									}}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{LANGUAGE_OPTIONS.map((language) => (
											<SelectItem key={language.code} value={language.code}>
												{language.nativeName} ({language.name})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Additional Languages */}
							<div className="space-y-3">
								<Label className="text-base font-medium">
									Additional Languages
								</Label>

								{additionalLanguages.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{additionalLanguages.map((language) => (
											<Badge
												key={language.code}
												variant="secondary"
												className="flex items-center gap-2 px-3 py-1"
											>
												{language.nativeName} ({language.name})
												<Button
													variant="ghost"
													size="sm"
													className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
													onClick={() => removeLanguage(language.code)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>
								)}

								<div className="space-y-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search for a language..."
											value={languageSearch}
											onChange={(e) => setLanguageSearch(e.target.value)}
											className="pl-10"
										/>
									</div>

									{languageSearch && (
										<div className="max-h-48 overflow-y-auto border rounded-md">
											{filteredLanguages
												.filter(
													(lang) =>
														lang.code !== defaultLanguage.code &&
														!additionalLanguages.find(
															(l) => l.code === lang.code
														)
												)
												.map((language) => (
													<div
														key={language.code}
														className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer"
														onClick={() => addLanguage(language)}
													>
														<div>
															<div className="font-medium">
																{language.nativeName}
															</div>
															<div className="text-sm text-muted-foreground">
																{language.name}
															</div>
														</div>
														<Plus className="h-4 w-4 text-muted-foreground" />
													</div>
												))}
										</div>
									)}
								</div>
							</div>

							<Button onClick={handleSaveLanguages} disabled={isSavingLangs}>
								{isSavingLangs && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Save Language Settings
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="currencies" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Currency Settings</CardTitle>
							<CardDescription>
								Set your default currency and additional supported currencies
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Default Currency */}
							<div className="space-y-3">
								<Label className="text-base font-medium">
									Default Currency
								</Label>
								<Select
									value={defaultCurrency.code}
									onValueChange={(value) => {
										const currency = CURRENCY_OPTIONS.find(
											(c) => c.code === value
										);
										if (currency) {
											setDefaultCurrency(currency);
											setAdditionalCurrencies(
												additionalCurrencies.filter((c) => c.code !== value)
											);
										}
									}}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CURRENCY_OPTIONS.map((currency) => (
											<SelectItem key={currency.code} value={currency.code}>
												{currency.symbol} {currency.name} ({currency.code})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Additional Currencies */}
							<div className="space-y-3">
								<Label className="text-base font-medium">
									Additional Currencies
								</Label>

								{additionalCurrencies.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{additionalCurrencies.map((currency) => (
											<Badge
												key={currency.code}
												variant="secondary"
												className="flex items-center gap-2 px-3 py-1"
											>
												{currency.symbol} {currency.name} ({currency.code})
												<Button
													variant="ghost"
													size="sm"
													className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
													onClick={() => removeCurrency(currency.code)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>
								)}

								<div className="space-y-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search for a currency..."
											value={currencySearch}
											onChange={(e) => setCurrencySearch(e.target.value)}
											className="pl-10"
										/>
									</div>

									{currencySearch && (
										<div className="max-h-48 overflow-y-auto border rounded-md">
											{filteredCurrencies
												.filter(
													(currency) =>
														currency.code !== defaultCurrency.code &&
														!additionalCurrencies.find(
															(c) => c.code === currency.code
														)
												)
												.map((currency) => (
													<div
														key={currency.code}
														className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer"
														onClick={() => addCurrency(currency)}
													>
														<div>
															<div className="font-medium">
																{currency.symbol} {currency.name}
															</div>
															<div className="text-sm text-muted-foreground">
																{currency.code}
															</div>
														</div>
														<Plus className="h-4 w-4 text-muted-foreground" />
													</div>
												))}
										</div>
									)}
								</div>
							</div>

							<Button onClick={handleSaveCurrencies} disabled={isSavingCurrs}>
								{isSavingCurrs && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Save Currency Settings
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
