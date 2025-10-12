import Footer from "@/components/nav/Footer";
import HomeNavBar from "@/components/nav/HomeNavBar";
import { setRequestLocale } from "next-intl/server";
import { LocaleParams } from "@/types/ITypes";

export default async function ProductLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: LocaleParams;
}) {
	const { locale } = await params;

	setRequestLocale(locale);


	return (
		<div className="min-h-screen bg-background">
			<HomeNavBar />
			{children}
			<Footer />
		</div>
	);
}
