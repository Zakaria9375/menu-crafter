import { Link } from "@/i18n/navigation";
import { ChefHat } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { LanguageSelector } from "../i18n/LanguageSelector";

export default function AuthNavBar() {
	return (
		<header className="p-6">
		<div className="flex items-center justify-between">
			<Link
				href="/"
				className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
			>
				<ArrowLeft className="h-5 w-5" />
				<ChefHat className="h-6 w-6" />
				<span className="text-lg font-semibold">Menu Crafter</span>
			</Link>
			<LanguageSelector />
		</div>
	</header>
	)
}