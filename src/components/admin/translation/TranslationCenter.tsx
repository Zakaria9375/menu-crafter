"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Globe, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateCategory, updateMenuItem } from "@/lib/db/actions/menu";
import { updateWebsiteConfig } from "@/lib/db/actions/website";
import type { Category, MenuItem } from "@/lib/db/schema";
import type { IWebsiteContent } from "@/types/website";

interface TranslationCenterProps {
	tenantId: string;
	languages: string[];
	categories: (Category & { items: MenuItem[] })[];
	websiteContent: IWebsiteContent;
	websiteTranslations?: { [langCode: string]: any };
}

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

export default function TranslationCenter({
	tenantId,
	languages,
	categories,
	websiteContent,
	websiteTranslations = {},
}: TranslationCenterProps) {
	const [selectedLanguage, setSelectedLanguage] = useState<string>(
		languages[1] || languages[0] || "en"
	);
	const [isSaving, setIsSaving] = useState(false);

	// State for menu translations
	const [categoryTranslations, setCategoryTranslations] = useState<{
		[categoryId: string]: { [langCode: string]: any };
	}>({});
	const [menuItemTranslations, setMenuItemTranslations] = useState<{
		[itemId: string]: { [langCode: string]: any };
	}>({});

	// State for website translations
	const [websiteTranslationsState, setWebsiteTranslationsState] =
		useState(websiteTranslations);

	// Initialize translations from existing data
	useEffect(() => {
		const catTrans: any = {};
		const itemTrans: any = {};

		categories.forEach((cat) => {
			catTrans[cat.id] = (cat.translations as any) || {};
			cat.items.forEach((item) => {
				itemTrans[item.id] = (item.translations as any) || {};
			});
		});

		setCategoryTranslations(catTrans);
		setMenuItemTranslations(itemTrans);
	}, [categories]);

	const getLanguageName = (code: string) => {
		const lang = LANGUAGE_OPTIONS.find((l) => l.code === code);
		return lang ? `${lang.nativeName} (${lang.name})` : code;
	};

	const handleSaveMenuTranslations = async () => {
		setIsSaving(true);
		try {
			// Save category translations
			for (const catId in categoryTranslations) {
				await updateCategory(catId, {
					translations: categoryTranslations[catId],
				});
			}

			// Save menu item translations
			for (const itemId in menuItemTranslations) {
				await updateMenuItem(itemId, {
					translations: menuItemTranslations[itemId],
				});
			}

			toast.success("Menu translations saved successfully");
		} catch (error) {
			toast.error("Failed to save menu translations");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleSaveWebsiteTranslations = async () => {
		setIsSaving(true);
		try {
			await updateWebsiteConfig(tenantId, {
				translations: websiteTranslationsState,
			});
			toast.success("Website translations saved successfully");
		} catch (error) {
			toast.error("Failed to save website translations");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const updateCategoryTranslation = (
		categoryId: string,
		field: string,
		value: string
	) => {
		setCategoryTranslations((prev) => ({
			...prev,
			[categoryId]: {
				...prev[categoryId],
				[selectedLanguage]: {
					...(prev[categoryId]?.[selectedLanguage] || {}),
					[field]: value,
				},
			},
		}));
	};

	const updateMenuItemTranslation = (
		itemId: string,
		field: string,
		value: string
	) => {
		setMenuItemTranslations((prev) => ({
			...prev,
			[itemId]: {
				...prev[itemId],
				[selectedLanguage]: {
					...(prev[itemId]?.[selectedLanguage] || {}),
					[field]: value,
				},
			},
		}));
	};

	const updateWebsiteTranslation = (
		section: string,
		field: string,
		value: string
	) => {
		setWebsiteTranslationsState((prev) => ({
			...prev,
			[selectedLanguage]: {
				...(prev[selectedLanguage] || {}),
				[section]: {
					...((prev[selectedLanguage] as any)?.[section] || {}),
					[field]: value,
				},
			},
		}));
	};

	if (languages.length <= 1) {
		return (
			<div className="container mx-auto py-8">
				<Card>
					<CardHeader>
						<CardTitle>Translation Center</CardTitle>
						<CardDescription>
							You need to add additional languages in the Languages & Currencies
							settings before you can manage translations.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Translation Center</h1>
				<p className="text-muted-foreground mt-2">
					Manage translations for your menu items and website content
				</p>
			</div>

			<div className="mb-6">
				<Label className="text-base font-medium">Target Language</Label>
				<Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
					<SelectTrigger className="w-[300px] mt-2">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{languages
							.filter((lang) => lang !== languages[0])
							.map((lang) => (
								<SelectItem key={lang} value={lang}>
									<div className="flex items-center gap-2">
										<Globe className="h-4 w-4" />
										{getLanguageName(lang)}
									</div>
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			<Tabs defaultValue="menu" className="space-y-6">
				<TabsList>
					<TabsTrigger value="menu">Menu Items</TabsTrigger>
					<TabsTrigger value="website">Website Content</TabsTrigger>
				</TabsList>

				<TabsContent value="menu" className="space-y-6">
					<div className="flex justify-end">
						<Button onClick={handleSaveMenuTranslations} disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							<Save className="mr-2 h-4 w-4" />
							Save Menu Translations
						</Button>
					</div>

					{categories.map((category) => (
						<Card key={category.id}>
							<CardHeader>
								<CardTitle className="text-xl">{category.name}</CardTitle>
								<CardDescription>
									Translate category and its menu items
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Category Translation */}
								<div className="space-y-4 pb-4 border-b">
									<h3 className="font-semibold">Category Information</h3>
									<div className="grid gap-4">
										<div className="space-y-2">
											<Label>
												Category Name ({getLanguageName(selectedLanguage)})
											</Label>
											<Input
												value={
													categoryTranslations[category.id]?.[selectedLanguage]
														?.name || ""
												}
												onChange={(e) =>
													updateCategoryTranslation(
														category.id,
														"name",
														e.target.value
													)
												}
												placeholder={`Translate: ${category.name}`}
											/>
										</div>
										<div className="space-y-2">
											<Label>
												Description ({getLanguageName(selectedLanguage)})
											</Label>
											<Textarea
												value={
													categoryTranslations[category.id]?.[selectedLanguage]
														?.description || ""
												}
												onChange={(e) =>
													updateCategoryTranslation(
														category.id,
														"description",
														e.target.value
													)
												}
												placeholder={`Translate: ${
													category.description || "No description"
												}`}
												rows={2}
											/>
										</div>
									</div>
								</div>

								{/* Menu Items Translation */}
								<div className="space-y-4">
									<h3 className="font-semibold">Menu Items</h3>
									{category.items.map((item) => (
										<div
											key={item.id}
											className="p-4 border rounded-lg space-y-3 bg-muted/30"
										>
											<div className="font-medium text-sm text-muted-foreground">
												{item.name}
											</div>
											<div className="grid gap-3">
												<div className="space-y-2">
													<Label className="text-sm">
														Item Name ({getLanguageName(selectedLanguage)})
													</Label>
													<Input
														value={
															menuItemTranslations[item.id]?.[selectedLanguage]
																?.name || ""
														}
														onChange={(e) =>
															updateMenuItemTranslation(
																item.id,
																"name",
																e.target.value
															)
														}
														placeholder={`Translate: ${item.name}`}
													/>
												</div>
												<div className="space-y-2">
													<Label className="text-sm">
														Description ({getLanguageName(selectedLanguage)})
													</Label>
													<Textarea
														value={
															menuItemTranslations[item.id]?.[selectedLanguage]
																?.description || ""
														}
														onChange={(e) =>
															updateMenuItemTranslation(
																item.id,
																"description",
																e.target.value
															)
														}
														placeholder={`Translate: ${
															item.description || "No description"
														}`}
														rows={2}
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>

				<TabsContent value="website" className="space-y-6">
					<div className="flex justify-end">
						<Button onClick={handleSaveWebsiteTranslations} disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							<Save className="mr-2 h-4 w-4" />
							Save Website Translations
						</Button>
					</div>

					{/* Hero Section */}
					{websiteContent.hero && (
						<Card>
							<CardHeader>
								<CardTitle>Hero Section</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Title ({getLanguageName(selectedLanguage)})</Label>
									<Input
										value={
											(websiteTranslationsState[selectedLanguage] as any)?.hero
												?.title || ""
										}
										onChange={(e) =>
											updateWebsiteTranslation("hero", "title", e.target.value)
										}
										placeholder={`Translate: ${websiteContent.hero.title}`}
									/>
								</div>
								<div className="space-y-2">
									<Label>Subtitle ({getLanguageName(selectedLanguage)})</Label>
									<Textarea
										value={
											(websiteTranslationsState[selectedLanguage] as any)?.hero
												?.subtitle || ""
										}
										onChange={(e) =>
											updateWebsiteTranslation(
												"hero",
												"subtitle",
												e.target.value
											)
										}
										placeholder={`Translate: ${websiteContent.hero.subtitle}`}
										rows={3}
									/>
								</div>
								<div className="space-y-2">
									<Label>CTA Text ({getLanguageName(selectedLanguage)})</Label>
									<Input
										value={
											(websiteTranslationsState[selectedLanguage] as any)?.hero
												?.ctaText || ""
										}
										onChange={(e) =>
											updateWebsiteTranslation(
												"hero",
												"ctaText",
												e.target.value
											)
										}
										placeholder={`Translate: ${
											websiteContent.hero.ctaText || ""
										}`}
									/>
								</div>
							</CardContent>
						</Card>
					)}

					{/* About Section */}
					{websiteContent.about && (
						<Card>
							<CardHeader>
								<CardTitle>About Section</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Title ({getLanguageName(selectedLanguage)})</Label>
									<Input
										value={
											(websiteTranslationsState[selectedLanguage] as any)?.about
												?.title || ""
										}
										onChange={(e) =>
											updateWebsiteTranslation("about", "title", e.target.value)
										}
										placeholder={`Translate: ${websiteContent.about.title}`}
									/>
								</div>
								<div className="space-y-2">
									<Label>
										Description ({getLanguageName(selectedLanguage)})
									</Label>
									<Textarea
										value={
											(websiteTranslationsState[selectedLanguage] as any)?.about
												?.description || ""
										}
										onChange={(e) =>
											updateWebsiteTranslation(
												"about",
												"description",
												e.target.value
											)
										}
										placeholder={`Translate: ${websiteContent.about.description}`}
										rows={4}
									/>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Why Us Section */}
					{websiteContent.whyUs && (
						<Card>
							<CardHeader>
								<CardTitle>Why Us Section</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Title ({getLanguageName(selectedLanguage)})</Label>
									<Input
										value={
											(websiteTranslationsState[selectedLanguage] as any)?.whyUs
												?.title || ""
										}
										onChange={(e) =>
											updateWebsiteTranslation("whyUs", "title", e.target.value)
										}
										placeholder={`Translate: ${websiteContent.whyUs.title}`}
									/>
								</div>
								{websiteContent.whyUs.description && (
									<div className="space-y-2">
										<Label>
											Description ({getLanguageName(selectedLanguage)})
										</Label>
										<Textarea
											value={
												(websiteTranslationsState[selectedLanguage] as any)
													?.whyUs?.description || ""
											}
											onChange={(e) =>
												updateWebsiteTranslation(
													"whyUs",
													"description",
													e.target.value
												)
											}
											placeholder={`Translate: ${websiteContent.whyUs.description}`}
											rows={3}
										/>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* Footer Section */}
					{websiteContent.footer && (
						<Card>
							<CardHeader>
								<CardTitle>Footer Section</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>
										Footer Text ({getLanguageName(selectedLanguage)})
									</Label>
									<Input
										value={
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											(websiteTranslationsState[selectedLanguage] as any)
												?.footer?.text || ""
										}
										onChange={(e) =>
											updateWebsiteTranslation("footer", "text", e.target.value)
										}
										placeholder={`Translate: ${websiteContent.footer.text}`}
									/>
								</div>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
