import { z } from "zod";
import { TranslationFunction } from "@/types/ITypes";


export const createRegisterSchema = (t: TranslationFunction) => z
	.object({
		name: z
			.string()
			.trim()
			.min(1, t("validation.name.required"))
			.regex(
				/^[a-zA-Z]+ [a-zA-Z]+/,
				t("validation.name.pattern")
			),
		email: z
			.string()
			.trim()
			.min(1, t("validation.email.required"))
			.email(t("validation.email.invalid")),
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

export type IRegisterSchema = z.infer<ReturnType<typeof createRegisterSchema>>;

// For backwards compatibility
export const registerSchema = createRegisterSchema((key) => key);
