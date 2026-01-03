import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import {
	IWebsiteContent,
	IWhyUsFeature,
	IFooterLink,
	IMenuCategoryWithItems,
} from "@/types/website";
import * as LucideIcons from "lucide-react";

interface WebsiteRendererProps {
	content: IWebsiteContent;
	theme: string; // 'modern', 'classic', 'minimal', 'bold', 'nature', 'cozy'
	menuCategories?: IMenuCategoryWithItems[];
	preview?: boolean;
	primaryColor?: string;
	secondaryColor?: string;
}

// Helper to determine if a color is light or dark
const isLightColor = (hex?: string): boolean => {
	if (!hex) return false;
	const color = hex.replace("#", "");
	const r = parseInt(color.substring(0, 2), 16);
	const g = parseInt(color.substring(2, 4), 16);
	const b = parseInt(color.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5;
};

// Helper to render Lucide icons dynamically
const renderIcon = (iconName?: string, color?: string) => {
	if (!iconName) return null;

	const IconComponent = (LucideIcons as any)[iconName];
	if (!IconComponent) return null;

	return (
		<IconComponent
			className="h-8 w-8 mb-4 mx-auto"
			style={color ? { color } : undefined}
		/>
	);
};

// Theme configurations with distinct visual characteristics
const themeConfigs = {
	modern: {
		heroClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
		heroTextClass: "text-white",
		sectionClass: "py-16",
		headingClass: "text-4xl font-bold mb-4 tracking-tight",
		cardClass:
			"bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-0",
		fontFamily: "'Inter', sans-serif",
		accentStyle: "rounded-lg",
		footerClass: "bg-slate-900 text-slate-300",
	},
	classic: {
		heroClass: "bg-stone-800",
		heroTextClass: "text-stone-100",
		sectionClass: "py-20",
		headingClass: "text-5xl font-serif mb-6 tracking-normal",
		cardClass: "bg-stone-50 rounded-none border-2 border-stone-200 shadow-sm",
		fontFamily: "'Merriweather', Georgia, serif",
		accentStyle: "border-b-2",
		footerClass: "bg-stone-900 text-stone-400",
	},
	minimal: {
		heroClass: "bg-white border-b border-gray-100",
		heroTextClass: "text-gray-900",
		sectionClass: "py-12",
		headingClass: "text-3xl font-light mb-3 tracking-wide",
		cardClass:
			"bg-gray-50 rounded-md border border-gray-100 shadow-none hover:border-gray-200 transition-colors",
		fontFamily: "'Inter', sans-serif",
		accentStyle: "rounded-sm",
		footerClass: "bg-gray-100 text-gray-600",
	},
	bold: {
		heroClass: "bg-black",
		heroTextClass: "text-white",
		sectionClass: "py-24",
		headingClass: "text-6xl font-black mb-8 uppercase tracking-tighter",
		cardClass:
			"bg-zinc-900 text-white rounded-none shadow-2xl border-4 border-white",
		fontFamily: "'Oswald', Impact, sans-serif",
		accentStyle: "rounded-none",
		footerClass: "bg-black text-zinc-400 border-t-4 border-white",
	},
	nature: {
		heroClass: "bg-gradient-to-b from-emerald-800 via-emerald-700 to-green-600",
		heroTextClass: "text-white",
		sectionClass: "py-16",
		headingClass: "text-4xl font-semibold mb-6",
		cardClass: "bg-emerald-50 rounded-2xl shadow-md border border-emerald-100",
		fontFamily: "'Nunito', sans-serif",
		accentStyle: "rounded-2xl",
		footerClass: "bg-emerald-950 text-emerald-200",
	},
	cozy: {
		heroClass: "bg-gradient-to-br from-amber-800 via-amber-700 to-orange-700",
		heroTextClass: "text-amber-50",
		sectionClass: "py-14",
		headingClass: "text-4xl font-medium mb-5",
		cardClass: "bg-amber-50 rounded-xl shadow-md border border-amber-100",
		fontFamily: "'Lora', Georgia, serif",
		accentStyle: "rounded-xl",
		footerClass: "bg-amber-950 text-amber-200",
	},
};

export default function WebsiteRenderer({
	content,
	theme,
	menuCategories,
	preview = false,
	primaryColor,
	secondaryColor,
}: WebsiteRendererProps) {
	const { hero, about, whyUs, footer } = content || {};
	const currentTheme =
		themeConfigs[theme as keyof typeof themeConfigs] || themeConfigs.modern;

	// Determine text color based on primary color brightness
	const primaryTextColor = primaryColor
		? isLightColor(primaryColor)
			? "#1a1a1a"
			: "#ffffff"
		: undefined;

	// Generate CSS custom properties for theming
	const cssVariables = {
		"--primary-color": primaryColor || "#3b82f6",
		"--secondary-color": secondaryColor || "#f59e0b",
		"--primary-text": primaryTextColor || "#ffffff",
	} as React.CSSProperties;

	return (
		<div
			className={cn(
				"w-full min-h-screen flex flex-col",
				preview ? "pointer-events-none select-none" : ""
			)}
			style={cssVariables}
		>
			{/* Hero Section */}
			{hero && (
				<section
					className={cn(
						"relative flex items-center justify-center text-center px-4 min-h-[500px]",
						!primaryColor && !hero.backgroundImage && currentTheme.heroClass,
						!primaryColor && !hero.backgroundImage && currentTheme.heroTextClass
					)}
					style={{
						...(hero.backgroundImage
							? {
									backgroundImage: `url(${hero.backgroundImage})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									color: "#ffffff",
							  }
							: primaryColor
							? {
									background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}bb 100%)`,
									color: primaryTextColor,
							  }
							: {}),
					}}
				>
					{hero.backgroundImage && (
						<div
							className="absolute inset-0 bg-black"
							style={{ opacity: hero.overlayOpacity ?? 0.5 }}
						/>
					)}
					<div className="relative z-10 max-w-3xl mx-auto">
						<h1
							className={currentTheme.headingClass}
							style={hero.backgroundImage ? { color: "#ffffff" } : undefined}
						>
							{hero.title || "Welcome"}
						</h1>
						<p
							className="text-xl mb-8 opacity-90"
							style={hero.backgroundImage ? { color: "#ffffff" } : undefined}
						>
							{hero.subtitle || "We serve the best food in town."}
						</p>
						{hero.ctaText && (
							<Button
								size="lg"
								className={cn(
									"font-semibold px-8 py-3 transition-all duration-300 hover:scale-105",
									currentTheme.accentStyle
								)}
								style={{
									backgroundColor: secondaryColor || "#f59e0b",
									color: isLightColor(secondaryColor) ? "#1a1a1a" : "#ffffff",
									borderColor: secondaryColor || "#f59e0b",
								}}
								asChild={!!hero.ctaLink}
							>
								{hero.ctaLink ? (
									<a href={hero.ctaLink}>{hero.ctaText}</a>
								) : (
									hero.ctaText
								)}
							</Button>
						)}
					</div>
				</section>
			)}

			{/* About Section */}
			{about && (
				<section
					className={cn("container mx-auto px-4", currentTheme.sectionClass)}
				>
					<div
						className={cn(
							"grid gap-12 items-center",
							about.image ? "md:grid-cols-2" : ""
						)}
					>
						<div
							className={cn(
								about.imagePosition === "right" ? "order-1" : "order-2"
							)}
						>
							<h2
								className={cn(
									"text-3xl font-bold mb-6",
									currentTheme.accentStyle === "border-b-2" && "pb-3"
								)}
								style={{
									borderColor: primaryColor,
									...(currentTheme.accentStyle === "border-b-2" && {
										borderBottomWidth: 3,
										borderBottomColor: primaryColor || "#3b82f6",
									}),
								}}
							>
								{about.title || "About Us"}
							</h2>
							<p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
								{about.description || "Tell your story here."}
							</p>
						</div>
						{about.image && (
							<div
								className={cn(
									"relative h-[400px] overflow-hidden shadow-xl",
									currentTheme.accentStyle,
									about.imagePosition === "right" ? "order-2" : "order-1"
								)}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={about.image}
									alt="About Us"
									className="object-cover w-full h-full"
								/>
							</div>
						)}
					</div>
				</section>
			)}

			{/* Why Us Section */}
			{whyUs && whyUs.features && whyUs.features.length > 0 && (
				<section
					className={cn(currentTheme.sectionClass)}
					style={{
						backgroundColor:
							theme === "bold"
								? "#18181b"
								: primaryColor
								? `${primaryColor}10`
								: "rgba(0,0,0,0.02)",
					}}
				>
					<div className="container mx-auto px-4">
						<h2
							className="text-3xl font-bold text-center mb-4"
							style={{ color: theme === "bold" ? "#ffffff" : undefined }}
						>
							{whyUs.title || "Why Choose Us"}
						</h2>
						{whyUs.description && (
							<p
								className="text-center max-w-2xl mx-auto mb-12"
								style={{
									color: theme === "bold" ? "#a1a1aa" : "rgb(107 114 128)",
								}}
							>
								{whyUs.description}
							</p>
						)}
						<div className="grid md:grid-cols-3 gap-8">
							{whyUs.features.map((feature: IWhyUsFeature, index: number) => (
								<div
									key={index}
									className={cn("p-6 text-center", currentTheme.cardClass)}
								>
									{renderIcon(feature.icon, primaryColor)}
									<h3
										className="text-xl font-semibold mb-3"
										style={{ color: theme === "bold" ? "#ffffff" : undefined }}
									>
										{feature.title}
									</h3>
									<p
										style={{
											color: theme === "bold" ? "#a1a1aa" : "rgb(107 114 128)",
										}}
									>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Menu Section */}
			{content?.menu && menuCategories && menuCategories.length > 0 && (
				<section
					className={cn("container mx-auto px-4", currentTheme.sectionClass)}
				>
					<div className="max-w-4xl mx-auto">
						<h2 className="text-3xl font-bold text-center mb-12">
							{content.menu.title || "Our Menu"}
						</h2>
						{content.menu.description && (
							<p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
								{content.menu.description}
							</p>
						)}
						{menuCategories.map((category) => (
							<div key={category.id} className="mb-12">
								<h3
									className="text-2xl font-semibold mb-6 pb-2"
									style={{
										borderBottomWidth: 2,
										borderBottomStyle: "solid",
										borderBottomColor: primaryColor || "#e5e7eb",
									}}
								>
									{category.name}
								</h3>
								<div className="space-y-6">
									{category.items.map((item) => (
										<div
											key={item.id}
											className="flex justify-between items-start"
										>
											<div className="flex-1 mr-4">
												<h4 className="text-lg font-medium">{item.name}</h4>
												{item.description && (
													<p className="text-muted-foreground text-sm mt-1">
														{item.description}
													</p>
												)}
												{item.dietary && item.dietary.length > 0 && (
													<div className="flex gap-2 mt-2">
														{item.dietary.map((d: string) => (
															<span
																key={d}
																className="text-xs px-2 py-0.5 rounded-full capitalize"
																style={{
																	backgroundColor: primaryColor
																		? `${primaryColor}20`
																		: "rgb(243 244 246)",
																	color: primaryColor || "rgb(55 65 81)",
																}}
															>
																{d}
															</span>
														))}
													</div>
												)}
											</div>
											<div
												className="font-semibold whitespace-nowrap"
												style={{ color: primaryColor }}
											>
												{item.price}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Footer */}
			<footer
				className={cn("py-12 mt-auto", currentTheme.footerClass)}
				style={
					primaryColor
						? {
								backgroundColor: primaryColor,
								color: primaryTextColor,
						  }
						: undefined
				}
			>
				<div className="container mx-auto px-4 text-center">
					<p className="mb-4" style={{ opacity: 0.9 }}>
						{footer?.text || "© 2024 All rights reserved."}
					</p>
					{footer?.links && (
						<div className="flex justify-center gap-6">
							{footer.links.map((link: IFooterLink, i: number) => (
								<a
									key={i}
									href={link.url}
									className="hover:opacity-100 transition-opacity"
									style={{
										opacity: 0.7,
										color: secondaryColor || "inherit",
									}}
								>
									{link.label}
								</a>
							))}
						</div>
					)}
					{footer?.showSocialLinks && footer.socialLinks && (
						<div className="flex justify-center gap-4 mt-6">
							{footer.socialLinks.facebook && (
								<a
									href={footer.socialLinks.facebook}
									className="hover:opacity-100 transition-opacity"
									style={{ opacity: 0.7 }}
								>
									Facebook
								</a>
							)}
							{footer.socialLinks.instagram && (
								<a
									href={footer.socialLinks.instagram}
									className="hover:opacity-100 transition-opacity"
									style={{ opacity: 0.7 }}
								>
									Instagram
								</a>
							)}
							{footer.socialLinks.twitter && (
								<a
									href={footer.socialLinks.twitter}
									className="hover:opacity-100 transition-opacity"
									style={{ opacity: 0.7 }}
								>
									Twitter
								</a>
							)}
						</div>
					)}
				</div>
			</footer>
		</div>
	);
}
