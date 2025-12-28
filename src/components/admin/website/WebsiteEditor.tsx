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
import { Eye, EyeOff, Monitor, Smartphone, Tablet, Save } from "lucide-react";
import { cn } from "@/utils/cn";
import WebsiteRenderer, {
	WebsiteContent,
} from "@/components/website/WebsiteRenderer";
import { updateWebsiteConfig } from "@/lib/db/actions/website";
import { toast } from "sonner";

const themes = [
	{
		id: "modern",
		name: "Modern",
		preview: "/modern-theme.jpg",
	},
	{
		id: "classic",
		name: "Classic",
		preview: "/classic-theme.jpg",
	},
	{
		id: "minimal",
		name: "Minimal",
		preview: "/minimal-theme.jpg",
	},
];

interface WebsiteEditorProps {
	tenantId: string;
	initialContent: WebsiteContent;
	initialTheme?: string;
}

export default function WebsiteEditor({
	tenantId,
	initialContent,
	initialTheme = "modern",
}: WebsiteEditorProps) {
	const [selectedTheme, setSelectedTheme] = useState(initialTheme);
	const [showPreview, setShowPreview] = useState(true);
	const [previewDevice, setPreviewDevice] = useState<
		"desktop" | "tablet" | "mobile"
	>("desktop");
	const [content, setContent] = useState<WebsiteContent>(initialContent || {});
	const [activeSection, setActiveSection] = useState("hero");
	const [isSaving, setIsSaving] = useState(false);

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
				...content,
				theme: selectedTheme,
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
								{themes.map((theme) => (
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

						{/* Hero Section Editor */}
						{activeSection === "hero" && content.hero && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="hero-heading">Heading</Label>
									<Input
										id="hero-heading"
										value={content.hero.title}
										onChange={(e) =>
											updateContent("hero", "title", e.target.value)
										}
										placeholder="Enter hero heading"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-description">Subtitle</Label>
									<Textarea
										id="hero-description"
										value={content.hero.subtitle}
										onChange={(e) =>
											updateContent("hero", "subtitle", e.target.value)
										}
										placeholder="Enter hero subtitle"
										rows={3}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-cta">CTA Text</Label>
									<Input
										id="hero-cta"
										value={content.hero.ctaText}
										onChange={(e) =>
											updateContent("hero", "ctaText", e.target.value)
										}
										placeholder="Enter CTA button text"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="hero-bg">Background Image URL</Label>
									<Input
										id="hero-bg"
										value={content.hero.backgroundImage}
										onChange={(e) =>
											updateContent("hero", "backgroundImage", e.target.value)
										}
										placeholder="Enter image URL"
									/>
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
										value={content.about.title}
										onChange={(e) =>
											updateContent("about", "title", e.target.value)
										}
										placeholder="Enter about heading"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="about-description">Description</Label>
									<Textarea
										id="about-description"
										value={content.about.description}
										onChange={(e) =>
											updateContent("about", "description", e.target.value)
										}
										placeholder="Enter about description"
										rows={4}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="about-image">Image URL</Label>
									<Input
										id="about-image"
										value={content.about.image}
										onChange={(e) =>
											updateContent("about", "image", e.target.value)
										}
										placeholder="Enter image URL"
									/>
								</div>
							</div>
						)}

						{/* Why Us Section Editor - Simplified for now */}
						{activeSection === "whyUs" && content.whyUs && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="whyus-heading">Heading</Label>
									<Input
										id="whyus-heading"
										value={content.whyUs.title}
										onChange={(e) =>
											updateContent("whyUs", "title", e.target.value)
										}
										placeholder="Enter heading"
									/>
								</div>
								{/* Feature editing would go here */}
								<p className="text-sm text-muted-foreground">
									Feature editing coming soon.
								</p>
							</div>
						)}

						{/* Footer Section Editor */}
						{activeSection === "footer" && content.footer && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="footer-text">Footer Text</Label>
									<Input
										id="footer-text"
										value={content.footer.text}
										onChange={(e) =>
											updateContent("footer", "text", e.target.value)
										}
										placeholder="Enter footer text"
									/>
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
								preview={true}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
