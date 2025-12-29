import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import { setRequestLocale } from "next-intl/server";
import { LocaleParams } from "@/types/ITypes";
import ProductLayout from "./(public)/(product)/layout";

export default async function Home({ params }: { params: LocaleParams }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<ProductLayout params={params}>
			<Hero />
			<Features />
		</ProductLayout>
	);
}
