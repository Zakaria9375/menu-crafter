"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	const t = useTranslations("notFound");

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-12">
			<div className="text-center max-w-2xl">
				<div className="mb-8">
					<h1 className="text-9xl font-bold text-primary mb-4">404</h1>
					<h2 className="text-3xl font-semibold mb-4">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg mb-8">
						{t("description")}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild variant="default" size="lg">
						<Link href="/" className="flex items-center gap-2">
							<Home className="h-5 w-5" />
							{t("goHome")}
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" onClick={() => window.history.back()}>
						<button className="flex items-center gap-2">
							<ArrowLeft className="h-5 w-5" />
							{t("goBack")}
						</button>
					</Button>
				</div>
			</div>
		</div>
	);
}

