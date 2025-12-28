import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import {
	IWebsiteContent,
	IWhyUsFeature,
	IFooterLink,
	IMenuCategoryWithItems,
} from "@/types/website";

interface WebsiteRendererProps {
	content: IWebsiteContent;
	theme: string; // 'modern', 'classic', 'minimal'
	menuCategories?: IMenuCategoryWithItems[];
	preview?: boolean;
}

export default function WebsiteRenderer({
	content,
	theme,
	menuCategories,
	preview = false,
}: WebsiteRendererProps) {
	const { hero, about, whyUs, footer } = content || {};

	// Theme-based styles
	const themeStyles: Record<
		string,
		{ hero: string; section: string; heading: string }
	> = {
		modern: {
			hero: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
			section: "py-16",
			heading: "text-4xl font-bold mb-4",
		},
		classic: {
			hero: "bg-slate-900 text-white",
			section: "py-20",
			heading: "text-5xl font-serif mb-6",
		},
		minimal: {
			hero: "bg-white text-gray-900 border-b",
			section: "py-12",
			heading: "text-3xl font-light mb-3",
		},
	};

	const currentTheme = themeStyles[theme] || themeStyles.modern;

	return (
		<div
			className={cn(
				"w-full min-h-screen flex flex-col",
				preview ? "pointer-events-none select-none" : ""
			)}
		>
			{/* Hero Section */}
			{hero && (
				<section
					className={cn(
						"relative flex items-center justify-center text-center px-4",
						currentTheme.hero,
						"min-h-[500px]"
					)}
					style={
						hero.backgroundImage
							? {
									backgroundImage: `url(${hero.backgroundImage})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
							  }
							: {}
					}
				>
					{hero.backgroundImage && (
						<div
							className="absolute inset-0 bg-black/50"
							style={{ opacity: hero.overlayOpacity ?? 0.5 }}
						/>
					)}
					<div className="relative z-10 max-w-3xl mx-auto">
						<h1 className={currentTheme.heading}>{hero.title || "Welcome"}</h1>
						<p className="text-xl mb-8 opacity-90">
							{hero.subtitle || "We serve the best food in town."}
						</p>
						{hero.ctaText && (
							<Button
								size="lg"
								variant={theme === "classic" ? "outline" : "default"}
								className={
									theme === "classic"
										? "border-white text-white hover:bg-white hover:text-black"
										: ""
								}
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
				<section className={cn("container mx-auto px-4", currentTheme.section)}>
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
							<h2 className="text-3xl font-bold mb-6">
								{about.title || "About Us"}
							</h2>
							<p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
								{about.description || "Tell your story here."}
							</p>
						</div>
						{about.image && (
							<div
								className={cn(
									"relative h-[400px] rounded-lg overflow-hidden shadow-xl",
									about.imagePosition === "right" ? "order-2" : "order-1"
								)}
							>
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
				<section className={cn("bg-muted/30", currentTheme.section)}>
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-bold text-center mb-12">
							{whyUs.title || "Why Choose Us"}
						</h2>
						{whyUs.description && (
							<p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
								{whyUs.description}
							</p>
						)}
						<div className="grid md:grid-cols-3 gap-8">
							{whyUs.features.map((feature: IWhyUsFeature, index: number) => (
								<div
									key={index}
									className="bg-background p-6 rounded-lg shadow-sm text-center"
								>
									<h3 className="text-xl font-semibold mb-3">
										{feature.title}
									</h3>
									<p className="text-muted-foreground">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Menu Section */}
			{content?.menu && menuCategories && menuCategories.length > 0 && (
				<section className={cn("container mx-auto px-4", currentTheme.section)}>
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
								<h3 className="text-2xl font-semibold mb-6 border-b pb-2">
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
																className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize"
															>
																{d}
															</span>
														))}
													</div>
												)}
											</div>
											<div className="font-semibold whitespace-nowrap">
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
			<footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
				<div className="container mx-auto px-4 text-center">
					<p className="mb-4">
						{footer?.text || "© 2024 All rights reserved."}
					</p>
					{footer?.links && (
						<div className="flex justify-center gap-6">
							{footer.links.map((link: IFooterLink, i: number) => (
								<a
									key={i}
									href={link.url}
									className="hover:text-white transition-colors"
								>
									{link.label}
								</a>
							))}
						</div>
					)}
					{footer?.showSocialLinks && footer.socialLinks && (
						<div className="flex justify-center gap-4 mt-6">
							{/* Placeholder for social icons - can be replaced with real icons later */}
							{footer.socialLinks.facebook && (
								<a
									href={footer.socialLinks.facebook}
									className="hover:text-white"
								>
									Facebook
								</a>
							)}
							{footer.socialLinks.instagram && (
								<a
									href={footer.socialLinks.instagram}
									className="hover:text-white"
								>
									Instagram
								</a>
							)}
							{footer.socialLinks.twitter && (
								<a
									href={footer.socialLinks.twitter}
									className="hover:text-white"
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
