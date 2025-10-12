"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/components/ui/error-message";
import { SuccessMessage } from "@/components/ui/success-message";
import {
	createPasswordResetSchema,
	IPasswordResetSchema,
} from "@/lib/validation/password-reset-schema";
import { Loader2 } from "lucide-react";
import { passwordResetAction } from "@/lib/auth/actions/password-reset";

export default function PasswordResetForm() {
	const t = useTranslations("auth.forgot");
	const tValidation = useTranslations();

	const [serverError, setServerError] = React.useState<string>("");
	const [successMessage, setSuccessMessage] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const passwordResetSchema = React.useMemo(
		() => createPasswordResetSchema(tValidation),
		[tValidation]
	);

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<IPasswordResetSchema>({
		resolver: zodResolver(passwordResetSchema),
		mode: "onSubmit",
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = handleSubmit(async (data) => {
		setIsLoading(true);
		setServerError("");
		setSuccessMessage("");

		const result = await passwordResetAction(data);

		if (result.succeeded) {
			setSuccessMessage(result.message);
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
								className="bg-background/50"
								{...field}
							/>
							<ErrorMessage error={errors.email?.message} />
						</>
					)}
				/>
			</div>
			<ErrorMessage error={serverError} />
			<SuccessMessage message={successMessage} />
			<Button
				variant="hero"
				className="w-full"
				type="submit"
				disabled={isLoading}
			>
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
