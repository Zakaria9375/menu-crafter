import { WebsiteTheme } from "@/types/website";

export const WEBSITE_THEMES: {
	id: WebsiteTheme;
	name: string;
	preview: string;
}[] = [
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
	{
		id: "bold",
		name: "Bold",
		preview: "/bold-theme.jpg",
	},
	{
		id: "nature",
		name: "Nature",
		preview: "/nature-theme.jpg",
	},
	{
		id: "cozy",
		name: "Cozy",
		preview: "/cozy-theme.jpg",
	},
];
