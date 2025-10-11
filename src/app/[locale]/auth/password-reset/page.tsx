import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleParams } from "@/types/ITypes";

const ForgotPassword = async ({
	params,
}: {
	params: LocaleParams;
}) => {
	const { locale } = await params;

	setRequestLocale(locale);
	const t = await getTranslations("auth.forgot");

	return (
		<div className="flex-1 flex items-center justify-center px-6 py-12">
			<Card className="w-full max-w-md bg-gradient-card border-0 shadow-elegant">
				<CardHeader className="text-center space-y-2">
					<div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
						<Mail className="h-8 w-8 text-primary-foreground" />
					</div>
					<CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
					<CardDescription className="text-muted-foreground">
						{t("subtitle")}
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="email">{t("email")}</Label>
						<Input
							id="email"
							type="text"
							placeholder={t("emailPlaceholder")}
							className="bg-background/50"
						/>
					</div>

					<Button variant="hero" className="w-full">
						{t("button")}
					</Button>

					<div className="text-center">
						<Link
							href="/auth/login"
							className="inline-flex items-center text-sm text-primary hover:underline"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							{t("backToLogin")}
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ForgotPassword;
