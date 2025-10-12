"use client";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	createRegisterSchema,
	IRegisterSchema,
} from "@/lib/validation/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { registerAction } from "@/lib/auth/actions/register";
import React from "react";
import {ErrorMessage} from "@/components/ui/error-message";
import {SuccessMessage} from "@/components/ui/success-message";
import { useRouter } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterForm() {
	const t = useTranslations("auth.register");
	const tValidation = useTranslations();
	const router = useRouter();
	const [serverError, setServerError] = React.useState<string>("");
	const [successMessage, setSuccessMessage] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	
	const registerSchema = React.useMemo(() => createRegisterSchema(tValidation), [tValidation]);
	
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IRegisterSchema>({
		resolver: zodResolver(registerSchema),
		delayError: 1000,
		mode: "onSubmit",
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = handleSubmit(async (data) => {
		setIsLoading(true);
		setServerError("");
		setSuccessMessage("");

		const result = await registerAction(data);
		if (result.succeeded) {
			setSuccessMessage("Registration successful! Redirecting to login...");
			setTimeout(() => router.push("/login"), 2000);
		} else {
			setServerError(result.message);
		}

		setIsLoading(false);
	});
	return (
		<form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
			<div className="space-y-2">
				<Label htmlFor="name">{t("name")}</Label>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<>
							<Input
								id="name"
								type="text"
								autoComplete="name"
								className="transition-all focus:shadow-soft"
								{...field}
							/>
							<ErrorMessage error={errors.name?.message} />
						</>
					)}
				/>
			</div>

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
				<Label htmlFor="phone">{t("password")}</Label>
				<Controller
					control={control}
					name="password"
					render={({ field }) => (
						<>
							<Input
								id="password"
								type="password"
								className="transition-all focus:shadow-soft"
								{...field}
							/>
							<ErrorMessage error={errors.password?.message} />
						</>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="address">{t("confirmPassword")}</Label>
				<Controller
					control={control}
					name="confirmPassword"
					render={({ field }) => (
						<>
							<Input
								id="confirmPassword"
								type="password"
								className="transition-all focus:shadow-soft"
								{...field}
							/>
							<ErrorMessage error={errors.confirmPassword?.message} />
						</>
					)}
				/>
			</div>
		<ErrorMessage error={serverError} />
		<SuccessMessage message={successMessage} />
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
