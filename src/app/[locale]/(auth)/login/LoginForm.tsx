"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLoginSchema, ILoginSchema } from "@/lib/validation/login-schema";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { signInAction } from "@/lib/auth/actions";
import { getUserTenants } from "@/lib/db/actions";
import { ErrorMessage } from "@/components/ui/error-message";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
	const t = useTranslations("auth.login");
	const tValidation = useTranslations();
	const [serverError, setServerError] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	
	const loginSchema = useMemo(() => createLoginSchema(tValidation), [tValidation]);
	
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginSchema>({
		resolver: zodResolver(loginSchema),
		delayError: 1000,
		mode: "onSubmit",
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = handleSubmit(async (data) => {
		setIsLoading(true);
		setServerError("");
		const result = await signInAction(data);
		if (result.succeeded && result.data) {
			const userTenants = await getUserTenants(result.data.id);
			if (userTenants.succeeded && userTenants.data && userTenants.data.length > 0) {
				router.push(`/${userTenants.data[0].slug}/admin`);
			} else {
				router.push("/onboarding");
			}
		} else {
			setServerError(result.message);
		}
		setIsLoading(false);
	});
	return (
		<form onSubmit={onSubmit} className="space-y-4">

			<div className="space-y-2">
				<Label htmlFor="email">{t("email")}</Label>
				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<>
							<Input
								id="email"
								type="text"
								autoComplete="email"
								className="transition-all focus:shadow-soft"
								{...field}
							/>
							<ErrorMessage error={errors.email?.message} />
						</>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">{t("password")}</Label>
				<Controller
					control={control}
					name="password"
					render={({ field }) => (
						<>
							<Input
								id="password"
								type="password"
								autoComplete="current-password"
								className="transition-all focus:shadow-soft"
								{...field}
							/>
							<ErrorMessage error={errors.password?.message} />
						</>
					)}
				/>
			</div>

		<ErrorMessage error={serverError} />
		<Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 w-4 h-4 animate-spin" /> {t("button")}
				</>
			) : (
				t("button")
			)}
		</Button>
		</form>
	);
}
