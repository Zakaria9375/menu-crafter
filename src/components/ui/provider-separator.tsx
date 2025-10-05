import { useTranslations } from "next-intl";
export default function ContinueWithSeparator() {
	const t = useTranslations("auth.continueWith");
	return (
		<div className="relative my-6">
			<div className="absolute inset-0 flex items-center">
				<span className="w-full border-t" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-card px-2 text-muted-foreground">
					{t("credential")}
				</span>
			</div>
		</div>
	);
}
