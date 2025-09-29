import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import ProductLayout from "./product/layout";
import { setRequestLocale } from 'next-intl/server';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
	
  setRequestLocale(locale);

	return (
		<ProductLayout params={params}>
			<Hero />
			<Features />
		</ProductLayout>
	);
}
