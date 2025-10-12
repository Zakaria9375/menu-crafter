import { z } from "zod";
import { TranslationFunction } from "@/types/ITypes";

export const createChangePasswordSchema = (t: TranslationFunction) => z
	.object({
		password: z
			.string()
			.trim()
			.min(1, t("validation.password.required"))
			.min(8, t("validation.password.min", { min: 8 }))
			.max(32, t("validation.password.max", { max: 32 }))
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
				t("validation.password.pattern")
			),
		confirmPassword: z.string().trim().min(1, t("validation.confirmPassword.required")),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: t("validation.confirmPassword.match"),
		path: ["confirmPassword"],
	});

export type IChangePasswordSchema = z.infer<ReturnType<typeof createChangePasswordSchema>>;

// For backwards compatibility
export const changePasswordSchema = createChangePasswordSchema((key) => key);
