"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, ILoginSchema } from "@/lib/validation/login-schema";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { getUserByEmail, signInAction } from "@/lib/auth/actions";
import ErrorMessage from "../ui/error-message";

export default function LoginForm() {
	const t = useTranslations("auth.login");
	const [serverError, setServerError] = useState<string>("");
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginSchema>({
		resolver: zodResolver(loginSchema),
		delayError: 1000,
		mode: "onSubmit",
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const onSubmit = handleSubmit(async (data) => {
		setServerError("");
		const credentials = {
			email: data.username,
			password: data.password,
		};
		const existedUser = await getUserByEmail(credentials.email);
		if (existedUser.success) {
			const result = await signInAction(credentials.email, data.password);
			if (result.success) {
				router.push("/onboarding");
			} else {
				setServerError(result.message);
			}
		} else {
			setServerError(existedUser.message);
		}
	});
	return (
		<form onSubmit={onSubmit} className="space-y-4">

			<div className="space-y-2">
				<Label htmlFor="email">{t("email")}</Label>
				<Controller
					control={control}
					name="username"
					render={({ field }) => (
						<>
							<Input
								id="username"
								type="email"
								required
								autoComplete="username"
								className="transition-all focus:shadow-soft"
								{...field}
							/>
							<ErrorMessage error={errors.username?.message} />
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
								required
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
			<Button type="submit" className="w-full" variant="hero">
				{t("button")}
			</Button>
		</form>
	);
}
