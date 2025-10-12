"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
	createChangePasswordSchema,
	IChangePasswordSchema,
} from "@/lib/validation/change-password-schema";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import { changePasswordAction } from "@/lib/auth/actions/change-password";
import { useRouter } from "@/i18n/navigation";

const ChangePassword = ({ token }: { token: string }) => {
	const t = useTranslations("auth.changePassword");
	const tValidation = useTranslations();
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");
	const router = useRouter();
	const changePasswordSchema = useMemo(
		() => createChangePasswordSchema(tValidation),
		[tValidation]
	);

	const form = useForm<IChangePasswordSchema>({
		resolver: zodResolver(changePasswordSchema),
		mode: "onSubmit",
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: IChangePasswordSchema) => {
		setIsLoading(true);
		setServerError("");
		setSuccessMessage("");

		try {
			const result = await changePasswordAction(data, token);
			if (result.succeeded) {
				setSuccessMessage("Password updated successfully!, redirecting to login page...");
				setTimeout(() => {
					router.push(`/login`);
				}, 2000);
				
			} else {
				setServerError("Failed to update password. Please try again.");
			}
		} catch {
			setServerError("Failed to update password. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (

			<div className="flex-1 flex items-center justify-center px-6 py-12">
				<Card className="w-full max-w-md bg-gradient-card border-0 shadow-elegant">
					<CardHeader className="text-center space-y-2">
						<div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
							<Lock className="h-8 w-8 text-primary-foreground" />
						</div>
						<CardTitle className="text-2xl font-bold">
							{t("title")}
						</CardTitle>
						<CardDescription className="text-muted-foreground">
							{t("subtitle")}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="space-y-2">
								<Label>{t("password")}</Label>
								<Controller
									control={form.control}
									name="password"
									render={({ field }) => (
										<>
											<Input
												{...field}
												type="password"
												placeholder={t("passwordPlaceholder")}
												className="bg-background/50"
											/>
											<ErrorMessage
												error={form.formState.errors.password?.message}
											/>
										</>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Label>{t("confirmPassword")}</Label>
								<Controller
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<>
											<Input
												{...field}
												type="password"
												placeholder={t("confirmPasswordPlaceholder")}
												className="bg-background/50"
											/>
											<ErrorMessage
												error={form.formState.errors.confirmPassword?.message}
											/>
										</>
									)}
								/>
							</div>
							<ErrorMessage error={serverError} />
							<SuccessMessage message={successMessage} />
							<Button
								type="submit"
								variant="hero"
								className="w-full"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{t("updating")}
									</>
								) : (
									t("button")
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
	);
};

export default ChangePassword;
