export type WebsiteTheme =
	| "modern"
	| "classic"
	| "minimal"
	| "bold"
	| "nature"
	| "cozy";

export interface IWebsiteConfig {
	theme: WebsiteTheme;
	primaryColor?: string;
	secondaryColor?: string;
	content: IWebsiteContent;
	translations?: { [langCode: string]: DeepPartial<IWebsiteContent> };
}

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface IWebsiteContent {
	hero?: IHeroSection;
	about?: IAboutSection;
	whyUs?: IWhyUsSection;
	gallery?: IGallerySection;
	menu?: IMenuSection;
	footer?: IFooterSection;
}

export interface IHeroSection {
	title: string;
	subtitle: string;
	ctaText?: string;
	ctaLink?: string;
	backgroundImage?: string;
	overlayOpacity?: number; // 0 to 1
}

export interface IAboutSection {
	title: string;
	description: string;
	image?: string;
	imagePosition?: "left" | "right";
}

export interface IWhyUsFeature {
	title: string;
	description: string;
	icon?: string; // Lucide icon name or URL
}

export interface IWhyUsSection {
	title: string;
	description?: string;
	features: IWhyUsFeature[];
}

export interface IGalleryImage {
	url: string;
	alt?: string;
	caption?: string;
}

export interface IGallerySection {
	title: string;
	description?: string;
	images: IGalleryImage[];
}

export interface IMenuSection {
	title: string;
	description?: string;
	featuredCategories?: string[]; // IDs of categories to highlight
	showImages?: boolean;
}

export interface IFooterLink {
	label: string;
	url: string;
}

export interface IFooterSection {
	text: string;
	links?: IFooterLink[];
	showSocialLinks?: boolean;
	socialLinks?: {
		facebook?: string;
		instagram?: string;
		twitter?: string;
	};
}

import { Category, MenuItem } from "@/lib/db/schema";

export type IMenuCategoryWithItems = Category & {
	items: MenuItem[];
};
