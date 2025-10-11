import { z } from "zod";
import { TranslationFunction } from "@/types/ITypes";


export const createPasswordResetSchema = (t: TranslationFunction) => z.object({
	email: z
		.string()
		.trim()
		.min(1, t("validation.email.required"))
		.email(t("validation.email.invalid"))
});

export type IPasswordResetSchema = z.infer<ReturnType<typeof createPasswordResetSchema>>;

// For backwards compatibility
export const passwordResetSchema = createPasswordResetSchema((key) => key);