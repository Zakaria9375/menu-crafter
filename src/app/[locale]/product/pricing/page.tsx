import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Check, Star, Zap, Crown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

const Pricing = async ({params}: {params: Promise<{locale: string}>}) => {
	const { locale } = await params;

	setRequestLocale(locale);

	const t = await getTranslations("pricing");

	return (
		<main className="container mx-auto px-6 py-12">
			<div className="text-center mb-16">
				<h1 className="text-4xl lg:text-5xl font-bold mb-4">{t("title")}</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					{t("subtitle")}
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{/* Starter Plan */}
				<Card className="bg-gradient-card border-0 shadow-soft hover:shadow-elegant transition-all duration-300">
					<CardHeader className="text-center">
						<div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
							<Star className="h-8 w-8 text-primary-foreground" />
						</div>
						<CardTitle className="text-2xl">{t("starter.name")}</CardTitle>
						<CardDescription>{t("starter.desc")}</CardDescription>
						<div className="text-3xl font-bold mt-4">{t("starter.price")}</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<ul className="space-y-2">
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("starter.feature1")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("starter.feature2")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("starter.feature3")}
							</li>
						</ul>
						<Link href="/auth/register" className="block">
							<Button variant="outline" className="w-full">
								{t("getStarted")}
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Professional Plan */}
				<Card className="bg-gradient-card border-2 border-primary shadow-elegant relative">
					<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
						<span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
							{t("popular")}
						</span>
					</div>
					<CardHeader className="text-center">
						<div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
							<Zap className="h-8 w-8 text-primary-foreground" />
						</div>
						<CardTitle className="text-2xl">{t("pro.name")}</CardTitle>
						<CardDescription>{t("pro.desc")}</CardDescription>
						<div className="text-3xl font-bold mt-4">{t("pro.price")}</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<ul className="space-y-2">
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("pro.feature1")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("pro.feature2")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("pro.feature3")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("pro.feature4")}
							</li>
						</ul>
						<Link href="/auth/register" className="block">
							<Button variant="hero" className="w-full">
								{t("getStarted")}
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* Enterprise Plan */}
				<Card className="bg-gradient-card border-0 shadow-soft hover:shadow-elegant transition-all duration-300">
					<CardHeader className="text-center">
						<div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
							<Crown className="h-8 w-8 text-primary-foreground" />
						</div>
						<CardTitle className="text-2xl">{t("enterprise.name")}</CardTitle>
						<CardDescription>{t("enterprise.desc")}</CardDescription>
						<div className="text-3xl font-bold mt-4">
							{t("enterprise.price")}
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<ul className="space-y-2">
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("enterprise.feature1")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("enterprise.feature2")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("enterprise.feature3")}
							</li>
							<li className="flex items-center">
								<Check className="h-4 w-4 text-primary mr-2" />
								{t("enterprise.feature4")}
							</li>
						</ul>
						<Link href="/product/contact" className="block">
							<Button variant="outline" className="w-full">
								{t("contactUs")}
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</main>
	);
};

export default Pricing;
