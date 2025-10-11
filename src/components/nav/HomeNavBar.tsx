import { ChefHat } from "lucide-react";
import { Button } from "../ui/button";
import { LanguageSelector } from "../i18n/LanguageSelector";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";


const HomeNavBar = async () => {
	const t = await getTranslations("nav");
	const session = await auth();
	const isLoggedIn = !!session?.user;
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
								<Link href="/auth/login">
									<Button variant="outline">{t("login")}</Button>
								</Link>
								<Link href="/auth/register">
									<Button variant="hero">{t("register")}</Button>
								</Link>
							</>
						) : (
							<UserMenu user={session?.user} />
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default HomeNavBar;
