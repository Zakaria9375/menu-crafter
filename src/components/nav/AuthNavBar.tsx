import { Link } from "@/i18n/navigation";
import { ChefHat } from "lucide-react";
import { LanguageSelector } from "../i18n/LanguageSelector";
import { useTranslations } from "next-intl";

export default function AuthNavBar() {
	const t = useTranslations("nav");
	return (
		<nav className="border-b border-border bg-background/80 backdrop-blur-sm">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<ChefHat className="h-8 w-8 text-primary" />
						<span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
							{t("title")}
						</span>
					</Link>
					<LanguageSelector />
				</div>
			</div>
		</nav>
	);
}
