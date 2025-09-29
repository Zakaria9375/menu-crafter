import AuthNavBar from "@/components/nav/AuthNavBar";
import { setRequestLocale } from "next-intl/server";
import { LocaleParams } from "@/types/ITypes";

export default async function AuthLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: LocaleParams;
}) {
	const { locale } = await params;

	setRequestLocale(locale);

	return (
		<div className="min-h-screen bg-gradient-hero flex flex-col">
			<AuthNavBar />
			{children}
		</div>
	);
}
