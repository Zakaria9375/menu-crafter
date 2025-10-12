import { Link } from "@/i18n/navigation";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

interface PageProps {
	searchParams: Promise<{ tenant?: string }>;
	params: Promise<{ locale: string }>;
}

export default async function ForbiddenPage({
	searchParams,
	params,
}: PageProps) {
	const t = await getTranslations("forbidden");
	const { locale } = await params;
	const { tenant } = await searchParams;
	const session = await auth();

	// If not logged in, redirect to login
	if (!session?.user) {
		redirect({ href: `/${locale}/login`, locale });
	}

	// Get user's available tenants
	const memberships: Array<{ slug: string }> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(session?.user as any)?.memberships || [];

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-12">
			<div className="text-center max-w-2xl">
				<div className="mb-8">
					<div className="flex justify-center mb-6">
						<div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
							<ShieldAlert className="h-12 w-12 text-destructive" />
						</div>
					</div>
					<h1 className="text-6xl font-bold text-destructive mb-4">403</h1>
					<h2 className="text-3xl font-semibold mb-4">{t("title")}</h2>
					<p className="text-muted-foreground text-lg mb-2">
						{t("description")}
					</p>
					{tenant && (
						<p className="text-muted-foreground text-sm mb-8">
							{t("tenantMessage", { tenant })}
						</p>
					)}
				</div>

				{memberships.length > 0 && (
					<div className="mb-8 p-6 bg-muted rounded-lg">
						<h3 className="font-semibold mb-3">{t("yourTenants")}</h3>
						<div className="space-y-2">
							{memberships.map((m) => (
								<Link
									key={m.slug}
									href={`/${locale}/${m.slug}/admin`}
									className="block p-3 bg-background hover:bg-accent rounded-md transition-colors"
								>
									{m.slug}
								</Link>
							))}
						</div>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild variant="default" size="lg">
						<Link href="/" className="flex items-center gap-2">
							<Home className="h-5 w-5" />
							{t("goHome")}
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<form action={() => window.history.back()}>
							<button
								type="submit"
								className="flex items-center gap-2"
							>
								<ArrowLeft className="h-5 w-5" />
								{t("goBack")}
							</button>
						</form>
					</Button>
				</div>
			</div>
		</div>
	);
}
