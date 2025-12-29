"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Eye,
	EyeOff,
	Monitor,
	Smartphone,
	Tablet,
	Save,
	Pencil,
	Trash2,
	Plus,
} from "lucide-react";
import { cn } from "@/utils/cn";
import WebsiteRenderer from "@/components/website/WebsiteRenderer";
import {
	IWebsiteContent as WebsiteContent,
	WebsiteTheme,
	IWhyUsFeature,
	IFooterLink,
} from "@/types/website";
import { updateWebsiteConfig } from "@/lib/db/actions/website";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { WEBSITE_THEMES } from "@/constants/website-themes";
import FeatureDialog from "./FeatureDialog";
import FooterLinkDialog from "./FooterLinkDialog";

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

interface WebsiteEditorProps {
	tenantId: string;
	initialContent: WebsiteContent;
	initialTheme?: WebsiteTheme;
	languages?: string[];
	initialTranslations?: { [langCode: string]: any };
	initialPrimaryColor?: string;
	initialSecondaryColor?: string;
}

export default function WebsiteEditor({
	tenantId,
	initialContent,
	initialTheme = "modern",
	languages = ["en"],
	initialTranslations = {},
	initialPrimaryColor,
	initialSecondaryColor,
}: WebsiteEditorProps) {
	const [selectedTheme, setSelectedTheme] = useState<WebsiteTheme>(
		initialTheme || "modern"
	);
	const [showPreview, setShowPreview] = useState(true);
	const [previewDevice, setPreviewDevice] = useState<
		"desktop" | "tablet" | "mobile"
	>("desktop");
	const [content, setContent] = useState<WebsiteContent>(initialContent || {});
	const [activeSection, setActiveSection] = useState("hero");
	const [isSaving, setIsSaving] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState<string>(
		languages[0] || "en"
	);
	const [translations, setTranslations] = useState(initialTranslations);
	const [primaryColor, setPrimaryColor] = useState<string>(
		initialPrimaryColor || "#000000"
	);
	const [secondaryColor, setSecondaryColor] = useState<string>(
		initialSecondaryColor || "#ffffff"
	);
	const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
	const [currentFeature, setCurrentFeature] = useState<
		IWhyUsFeature | undefined
	>();
	const [currentFeatureIndex, setCurrentFeatureIndex] = useState(-1);
	const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
	const [currentLink, setCurrentLink] = useState<IFooterLink | undefined>();
	const [currentLinkIndex, setCurrentLinkIndex] = useState(-1);

	const getLanguageName = (code: string) => {
		const lang = LANGUAGE_OPTIONS.find((l) => l.code === code);
		return lang ? `${lang.nativeName} (${lang.name})` : code;
	};

	const updateContent = (
		section: keyof WebsiteContent,
		field: string,
		value: any
	) => {
		setContent((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const result = await updateWebsiteConfig(tenantId, {
				content,
				theme: selectedTheme,
				primaryColor,
				secondaryColor,
				translations,
			});
			if (result.success) {
				toast.success("Website configuration saved successfully");
			} else {
				toast.error("Failed to save configuration");
			}
		} catch (error) {
			toast.error("An error occurred while saving");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const updateTranslation = (
		section: keyof WebsiteContent,
		field: string,
		value: any
	) => {
		setTranslations((prev) => ({
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

	const getCurrentContent = (section: keyof WebsiteContent, field: string) => {
		if (selectedLanguage === languages[0]) {
			return (content[section] as any)?.[field] || "";
		}
		return (translations[selectedLanguage] as any)?.[section]?.[field] || "";
	};

	const handleContentChange = (
		section: keyof WebsiteContent,
		field: string,
		value: any
	) => {
		if (selectedLanguage === languages[0]) {
			updateContent(section, field, value);
		} else {
			updateTranslation(section, field, value);
		}
	};

	const handleSaveFeature = (feature: IWhyUsFeature) => {
		if (!content.whyUs) return;

		const features = content.whyUs.features || [];

		if (currentFeatureIndex >= 0) {
			// Edit existing
			const updated = [...features];
			updated[currentFeatureIndex] = feature;
			updateContent("whyUs", "features", updated);
		} else {
			// Add new
			updateContent("whyUs", "features", [...features, feature]);
		}

		setCurrentFeature(undefined);
		setCurrentFeatureIndex(-1);
	};

	const handleSaveLink = (link: IFooterLink) => {
		if (!content.footer) return;

		const links = content.footer.links || [];

		if (currentLinkIndex >= 0) {
			// Edit existing
			const updated = [...links];
			updated[currentLinkIndex] = link;
			updateContent("footer", "links", updated);
		} else {
			// Add new
			updateContent("footer", "links", [...links, link]);
		}

		setCurrentLink(undefined);
		setCurrentLinkIndex(-1);
	};

	const getPreviewWidth = () => {
		switch (previewDevice) {
			case "mobile":
				return "max-w-[375px]";
			case "tablet":
				return "max-w-[768px]";
			default:
				return "w-full";
		}
	};

	return (
		<div className="flex h-[calc(100vh-5rem)] gap-6">
			<div
				className={cn("flex flex-col", showPreview ? "w-[480px]" : "flex-1")}
			>
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Website Editor</h1>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowPreview(!showPreview)}
							className="gap-2"
						>
							{showPreview ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
							{showPreview ? "Hide" : "Show"} Preview
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={isSaving}
							className="gap-2"
						>
							<Save className="h-4 w-4" />
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</div>

				<Tabs defaultValue="content" className="flex-1">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="theme">Theme</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
					</TabsList>

					{/* Theme Selection Tab */}
					<TabsContent
						value="theme"
						className="mt-4 space-y-4 overflow-y-auto pr-2"
						style={{ maxHeight: "calc(100vh - 14rem)" }}
					>
						<div className="space-y-3">
							<Label className="text-base font-semibold">Choose a theme</Label>
							<p className="text-sm text-muted-foreground">
								Select a theme that best represents your restaurant's style
							</p>

							<div className="space-y-3">
								{WEBSITE_THEMES.map((theme) => (
									<Card
										key={theme.id}
										className={cn(
											"cursor-pointer overflow-hidden border-2 transition-all hover:border-primary/50",
											selectedTheme === theme.id
												? "border-primary ring-2 ring-primary/20"
												: "border-border"
										)}
										onClick={() => setSelectedTheme(theme.id)}
									>
										<div className="flex items-center gap-4 p-4">
											<div className="flex h-5 w-5 items-center justify-center">
												<div
													className={cn(
														"h-4 w-4 rounded-full border-2",
														selectedTheme === theme.id
															? "border-primary bg-primary"
															: "border-muted-foreground"
													)}
												>
													{selectedTheme === theme.id && (
														<div className="h-full w-full rounded-full bg-background scale-50" />
													)}
												</div>
											</div>
											<div className="flex-1">
												<h3 className="font-semibold">{theme.name}</h3>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						{/* Color Customization */}
						<div className="space-y-3 pt-4 border-t">
							<Label className="text-base font-semibold">Custom Colors</Label>
							<p className="text-sm text-muted-foreground">
								Override theme colors with your brand colors
							</p>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="primary-color">Primary Color</Label>
									<div className="flex gap-3 items-center">
										<Input
											id="primary-color"
											type="color"
											value={primaryColor}
											onChange={(e) => setPrimaryColor(e.target.value)}
											className="w-20 h-10 cursor-pointer"
										/>
										<Input
											value={primaryColor}
											onChange={(e) => setPrimaryColor(e.target.value)}
											placeholder="#000000"
											className="flex-1"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="secondary-color">Secondary Color</Label>
									<div className="flex gap-3 items-center">
										<Input
											id="secondary-color"
											type="color"
											value={secondaryColor}
											onChange={(e) => setSecondaryColor(e.target.value)}
											className="w-20 h-10 cursor-pointer"
										/>
										<Input
											value={secondaryColor}
											onChange={(e) => setSecondaryColor(e.target.value)}
											placeholder="#ffffff"
											className="flex-1"
										/>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					{/* Content Editing Tab */}
					<TabsContent
						value="content"
						className="mt-4 space-y-4 overflow-y-auto pr-2"
						style={{ maxHeight: "calc(100vh - 14rem)" }}
					>
						<div className="space-y-2">
							<Label>Page Section</Label>
							<Select value={activeSection} onValueChange={setActiveSection}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="hero">Hero Section</SelectItem>
									<SelectItem value="about">About Section</SelectItem>
									<SelectItem value="whyUs">Why Us Section</SelectItem>
									<SelectItem value="footer">Footer Section</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{languages.length > 1 && (
							<div className="space-y-2">
								<Label>Language</Label>
								<Select
									value={selectedLanguage}
									onValueChange={setSelectedLanguage}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{languages.map((lang) => (
											<SelectItem key={lang} value={lang}>
												{getLanguageName(lang)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{/* Hero Section Editor */}
						{activeSection === "hero" && content.hero && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="hero-heading">Heading</Label>
									<Input
										id="hero-heading"
										value={getCurrentContent("hero", "title")}
										onChange={(e) =>
											handleContentChange("hero", "title", e.target.value)
										}
										placeholder="Enter hero heading"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-description">Subtitle</Label>
									<Textarea
										id="hero-description"
										value={getCurrentContent("hero", "subtitle")}
										onChange={(e) =>
											handleContentChange("hero", "subtitle", e.target.value)
										}
										placeholder="Enter hero subtitle"
										rows={3}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-cta">CTA Text</Label>
									<Input
										id="hero-cta"
										value={getCurrentContent("hero", "ctaText")}
										onChange={(e) =>
											handleContentChange("hero", "ctaText", e.target.value)
										}
										placeholder="Enter CTA button text"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-cta-link">CTA Link</Label>
									<Input
										id="hero-cta-link"
										value={getCurrentContent("hero", "ctaLink")}
										onChange={(e) =>
											handleContentChange("hero", "ctaLink", e.target.value)
										}
										placeholder="e.g., /menu or #menu"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-bg">Background Image URL</Label>
									<Input
										id="hero-bg"
										value={getCurrentContent("hero", "backgroundImage")}
										onChange={(e) =>
											handleContentChange(
												"hero",
												"backgroundImage",
												e.target.value
											)
										}
										placeholder="Enter image URL"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-overlay">
										Overlay Opacity:{" "}
										{Math.round((content.hero.overlayOpacity ?? 0.5) * 100)}%
									</Label>
									<Slider
										id="hero-overlay"
										min={0}
										max={100}
										step={5}
										value={[(content.hero.overlayOpacity ?? 0.5) * 100]}
										onValueChange={(values) => {
											updateContent("hero", "overlayOpacity", values[0] / 100);
										}}
										className="w-full"
									/>
									<p className="text-xs text-muted-foreground">
										Controls the darkness of the overlay on the background image
									</p>
								</div>
							</div>
						)}

						{/* About Section Editor */}
						{activeSection === "about" && content.about && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="about-heading">Heading</Label>
									<Input
										id="about-heading"
										value={getCurrentContent("about", "title")}
										onChange={(e) =>
											handleContentChange("about", "title", e.target.value)
										}
										placeholder="Enter about heading"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="about-description">Description</Label>
									<Textarea
										id="about-description"
										value={getCurrentContent("about", "description")}
										onChange={(e) =>
											handleContentChange(
												"about",
												"description",
												e.target.value
											)
										}
										placeholder="Enter about description"
										rows={4}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="about-image">Image URL</Label>
									<Input
										id="about-image"
										value={getCurrentContent("about", "image")}
										onChange={(e) =>
											handleContentChange("about", "image", e.target.value)
										}
										placeholder="Enter image URL"
									/>
								</div>

								<div className="space-y-2">
									<Label>Image Position</Label>
									<div className="flex gap-4">
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="imagePosition"
												value="left"
												checked={content.about.imagePosition === "left"}
												onChange={() =>
													updateContent("about", "imagePosition", "left")
												}
												className="cursor-pointer"
											/>
											<span>Left</span>
										</label>
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="radio"
												name="imagePosition"
												value="right"
												checked={content.about.imagePosition === "right"}
												onChange={() =>
													updateContent("about", "imagePosition", "right")
												}
												className="cursor-pointer"
											/>
											<span>Right</span>
										</label>
									</div>
								</div>
							</div>
						)}

						{/* Why Us Section Editor */}
						{activeSection === "whyUs" && content.whyUs && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="whyus-heading">Heading</Label>
									<Input
										id="whyus-heading"
										value={getCurrentContent("whyUs", "title")}
										onChange={(e) =>
											handleContentChange("whyUs", "title", e.target.value)
										}
										placeholder="Enter heading"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="whyus-description">
										Description (optional)
									</Label>
									<Textarea
										id="whyus-description"
										value={getCurrentContent("whyUs", "description")}
										onChange={(e) =>
											handleContentChange("whyUs", "description", e.target.value)
										}
										placeholder="Enter section description"
										rows={2}
									/>
								</div>

								{/* Features List */}
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label className="text-base">Features</Label>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												setCurrentFeature(undefined);
												setIsFeatureDialogOpen(true);
											}}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Feature
										</Button>
									</div>

									{content.whyUs.features && content.whyUs.features.length > 0 ? (
										<div className="space-y-2">
											{content.whyUs.features.map((feature, index) => (
												<Card key={index} className="p-3">
													<div className="flex items-start justify-between gap-3">
														<div className="flex-1">
															<h4 className="font-semibold text-sm">
																{feature.title}
															</h4>
															<p className="text-xs text-muted-foreground mt-1">
																{feature.description}
															</p>
															{feature.icon && (
																<p className="text-xs text-muted-foreground mt-1">
																	Icon: {feature.icon}
																</p>
															)}
														</div>
														<div className="flex gap-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => {
																	setCurrentFeature(feature);
																	setCurrentFeatureIndex(index);
																	setIsFeatureDialogOpen(true);
																}}
															>
																<Pencil className="h-3 w-3" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => {
																	const newFeatures =
																		content.whyUs?.features?.filter(
																			(_, i) => i !== index
																		) || [];
																	updateContent("whyUs", "features", newFeatures);
																}}
															>
																<Trash2 className="h-3 w-3 text-destructive" />
															</Button>
														</div>
													</div>
												</Card>
											))}
										</div>
									) : (
										<p className="text-sm text-muted-foreground">
											No features added yet. Click "Add Feature" to get started.
										</p>
									)}
								</div>
							</div>
						)}

						{/* Footer Section Editor */}
						{activeSection === "footer" && content.footer && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="footer-text">Footer Text</Label>
									<Input
										id="footer-text"
										value={getCurrentContent("footer", "text")}
										onChange={(e) =>
											handleContentChange("footer", "text", e.target.value)
										}
										placeholder="Enter footer text"
									/>
								</div>

								{/* Footer Links */}
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label className="text-base">Footer Links</Label>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												setCurrentLink(undefined);
												setIsLinkDialogOpen(true);
											}}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Link
										</Button>
									</div>

									{content.footer.links && content.footer.links.length > 0 ? (
										<div className="space-y-2">
											{content.footer.links.map((link, index) => (
												<Card key={index} className="p-3">
													<div className="flex items-center justify-between gap-3">
														<div className="flex-1">
															<p className="font-medium text-sm">{link.label}</p>
															<p className="text-xs text-muted-foreground">
																{link.url}
															</p>
														</div>
														<div className="flex gap-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => {
																	setCurrentLink(link);
																	setCurrentLinkIndex(index);
																	setIsLinkDialogOpen(true);
																}}
															>
																<Pencil className="h-3 w-3" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => {
																	const newLinks = content.footer?.links?.filter(
																		(_, i) => i !== index
																	);
																	updateContent("footer", "links", newLinks);
																}}
															>
																<Trash2 className="h-3 w-3 text-destructive" />
															</Button>
														</div>
													</div>
												</Card>
											))}
										</div>
									) : (
										<p className="text-sm text-muted-foreground">
											No links added yet.
										</p>
									)}
								</div>

								{/* Social Links */}
								<div className="space-y-3 pt-4 border-t">
									<div className="flex items-center justify-between">
										<Label htmlFor="show-social">Show Social Links</Label>
										<Switch
											id="show-social"
											checked={content.footer.showSocialLinks || false}
											onCheckedChange={(checked) =>
												updateContent("footer", "showSocialLinks", checked)
											}
										/>
									</div>

									{content.footer.showSocialLinks && (
										<div className="space-y-3 pl-4 border-l-2">
											<div className="space-y-2">
												<Label htmlFor="social-facebook">Facebook URL</Label>
												<Input
													id="social-facebook"
													value={content.footer?.socialLinks?.facebook || ""}
													onChange={(e) =>
														updateContent("footer", "socialLinks", {
															...content.footer?.socialLinks,
															facebook: e.target.value,
														})
													}
													placeholder="https://facebook.com/yourpage"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="social-instagram">Instagram URL</Label>
												<Input
													id="social-instagram"
													value={content.footer?.socialLinks?.instagram || ""}
													onChange={(e) =>
														updateContent("footer", "socialLinks", {
															...content.footer?.socialLinks,
															instagram: e.target.value,
														})
													}
													placeholder="https://instagram.com/yourpage"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="social-twitter">Twitter URL</Label>
												<Input
													id="social-twitter"
													value={content.footer?.socialLinks?.twitter || ""}
													onChange={(e) =>
														updateContent("footer", "socialLinks", {
															...content.footer?.socialLinks,
															twitter: e.target.value,
														})
													}
													placeholder="https://twitter.com/yourpage"
												/>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>

			{/* Preview Panel */}
			{showPreview && (
				<div className="flex flex-1 flex-col rounded-lg border border-border bg-muted/30">
					<div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-muted-foreground">
								Preview
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant={previewDevice === "desktop" ? "default" : "ghost"}
								size="sm"
								onClick={() => setPreviewDevice("desktop")}
							>
								<Monitor className="h-4 w-4" />
							</Button>
							<Button
								variant={previewDevice === "tablet" ? "default" : "ghost"}
								size="sm"
								onClick={() => setPreviewDevice("tablet")}
							>
								<Tablet className="h-4 w-4" />
							</Button>
							<Button
								variant={previewDevice === "mobile" ? "default" : "ghost"}
								size="sm"
								onClick={() => setPreviewDevice("mobile")}
							>
								<Smartphone className="h-4 w-4" />
							</Button>
						</div>
					</div>

					<div className="flex flex-1 items-start justify-center overflow-y-auto bg-gray-100 p-6">
						<div
							className={cn(
								"transition-all duration-300 bg-white shadow-xl overflow-hidden min-h-[800px]",
								getPreviewWidth()
							)}
						>
							<WebsiteRenderer
								content={content}
								theme={selectedTheme}
								primaryColor={primaryColor}
								secondaryColor={secondaryColor}
								preview={true}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Feature Dialog */}
			<FeatureDialog
				isOpen={isFeatureDialogOpen}
				onClose={() => {
					setIsFeatureDialogOpen(false);
					setCurrentFeature(undefined);
					setCurrentFeatureIndex(-1);
				}}
				onSave={handleSaveFeature}
				feature={currentFeature}
			/>

			{/* Footer Link Dialog */}
			<FooterLinkDialog
				isOpen={isLinkDialogOpen}
				onClose={() => {
					setIsLinkDialogOpen(false);
					setCurrentLink(undefined);
					setCurrentLinkIndex(-1);
				}}
				onSave={handleSaveLink}
				link={currentLink}
			/>
		</div>
	);
}
