import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LocaleParams } from "@/types/ITypes";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

type Props = {
	children: React.ReactNode;
	params: LocaleParams;
	session: Session;
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
	session,
}: Readonly<Props>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	// Enable static rendering
	setRequestLocale(locale);

	const messages = await getMessages({ locale });
	return (
		<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextIntlClientProvider messages={messages}>
					<SessionProvider session={session}>{children}</SessionProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
