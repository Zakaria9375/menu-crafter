import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import ProductLayout from "./product/layout";
import { setRequestLocale } from 'next-intl/server';

export default function Home({params}: {params: {locale: string}}) {
  const { locale } = params;

  setRequestLocale(locale);

	return (
		<ProductLayout params={params}>
			<Hero />
			<Features />
		</ProductLayout>
	);
}
