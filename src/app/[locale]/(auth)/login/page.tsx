import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LoginForm from "./LoginForm";
import { LocaleParams } from "@/types/ITypes";
import GoogleBtn from "@/components/ui/google-btn";
import ContinueWithSeparator from "@/components/ui/provider-separator";

const Login = async ({ params }: { params: LocaleParams }) => {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("auth.login");

	return (
		<div className="flex-1 flex items-center justify-center p-6">
			<Card className="w-full max-w-md bg-card/80 backdrop-blur-sm shadow-elegant border-0">
				<CardHeader className="space-y-2 text-center">
					<div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
						<ChefHat className="h-6 w-6 text-primary-foreground" />
					</div>
					<CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
					<p className="text-muted-foreground">{t("subtitle")}</p>
				</CardHeader>

				<CardContent>
					<GoogleBtn />
					<ContinueWithSeparator />
					<LoginForm />

					<div className="mt-6 text-center space-y-3">
						<Link
							href="/password-reset"
							className="text-sm text-primary hover:text-primary-glow transition-colors block"
						>
							{t("forgot")}
						</Link>
						<p className="text-sm text-muted-foreground">
							{t("noAccount")}{" "}
							<Link
								href="/register"
								className="text-primary hover:text-primary-glow font-semibold transition-colors"
							>
								{t("signUp")}
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
