import { ChefHat, LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";
import { LanguageSelector } from "../i18n/LanguageSelector";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";
import { getUserTenants } from "@/lib/db/actions";

const HomeNavBar = async () => {
	const t = await getTranslations("nav");
	const session = await auth();
	const locale = await getLocale();
	const isLoggedIn = !!session?.user;

	let dashboardUrl = `/${locale}/onboarding`;
	let buttonLabel = "Onboarding";
	let showDashboardButton = false;

	if (isLoggedIn && session?.user?.id) {
		const tenantsResult = await getUserTenants(session.user.id);
		if (
			tenantsResult.succeeded &&
			tenantsResult.data &&
			tenantsResult.data.length > 0
		) {
			dashboardUrl = `/${locale}/${tenantsResult.data[0].slug}/admin/dashboard`;
			showDashboardButton = true;
			buttonLabel = "Dashboard";
		} else {
			showDashboardButton = false;
		}
	}

	return (
		<nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<ChefHat className="h-8 w-8 text-primary" />
						<span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
							{t("title")}
						</span>
					</Link>

					<div className="flex items-center space-x-4">
						<LanguageSelector />
						{!isLoggedIn ? (
							<>
								<Link href="/login">
									<Button variant="outline">{t("login")}</Button>
								</Link>
								<Link href="/register">
									<Button variant="hero">{t("register")}</Button>
								</Link>
							</>
						) : (
							<div className="flex items-center gap-4">
								{showDashboardButton && (
									<a href={dashboardUrl}>
										<Button variant="default" className="gap-2">
											<LayoutDashboard className="h-4 w-4" />
											{buttonLabel}
										</Button>
									</a>
								)}
								<UserMenu user={session?.user} />
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default HomeNavBar;
