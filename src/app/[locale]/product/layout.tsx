import Footer from "@/components/nav/Footer";
import HomeNavBar from "@/components/nav/HomeNavBar";
import { setRequestLocale } from "next-intl/server";

export default function ProductLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const { locale } = params;

	setRequestLocale(locale);


	return (
		<div className="min-h-screen bg-background">
			<HomeNavBar />
			{children}
			<Footer />
		</div>
	);
}
