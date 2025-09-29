import AuthNavBar from "@/components/nav/AuthNavBar";
import { setRequestLocale } from "next-intl/server";

export default function AuthLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const { locale } = params;

	setRequestLocale(locale);

	return (
		<div className="min-h-screen bg-gradient-hero flex flex-col">
			<AuthNavBar />
			{children}
		</div>
	);
}
