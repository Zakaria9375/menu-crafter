import AuthNavBar from "@/components/nav/AuthNavBar";
import { setRequestLocale } from "next-intl/server";

export default async function AuthLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
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
