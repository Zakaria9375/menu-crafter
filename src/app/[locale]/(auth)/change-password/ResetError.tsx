import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ResetError = () => {
	const t = useTranslations("auth.resetError");

	return (
		<div className="flex-1 flex items-center justify-center px-6 py-12">
			<Card className="w-full max-w-md bg-gradient-card border-0 shadow-elegant">
				<CardHeader className="text-center space-y-2">
					<div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
						<AlertCircle className="h-8 w-8 text-destructive" />
					</div>
					<CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
					<CardDescription className="text-muted-foreground">
						{t("subtitle")}
					</CardDescription>
				</CardHeader>
				
				<CardContent className="space-y-6">
					<p className="text-center text-sm text-muted-foreground">
						{t("description")}
					</p>
					
					<Link href="/password-reset" className="block">
						<Button variant="hero" className="w-full">
							{t("button")}
						</Button>
					</Link>

					<div className="text-center">
						<Link 
							href="/login" 
							className="text-sm text-muted-foreground hover:text-primary hover:underline"
						>
							{t("backToLogin")}
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetError;
