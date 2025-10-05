import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import ProductLayout from "./product/layout";
import { setRequestLocale } from 'next-intl/server';
import { LocaleParams } from "@/types/ITypes";
import { auth } from "@/lib/auth";

export default async function Home({params}: {params: LocaleParams}) {
  const { locale } = await params;
	const session  =await auth()
  console.log(session)
  setRequestLocale(locale);

	return (
		<ProductLayout params={params}>
			{ session ? (
				<pre>{JSON.stringify(session, null, 2)}</pre>
			) : (
				<pre>No session</pre>
			)}
			<Hero />
			<Features />
		</ProductLayout>
	);
}
