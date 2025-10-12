import { z } from "zod";
import { TranslationFunction } from "@/types/ITypes";


export const createLoginSchema = (t: TranslationFunction) => z.object({
	email: z
		.string()
		.trim()
		.min(1, t("validation.email.required"))
		.email(t("validation.email.invalid")),
	password: z
		.string()
		.trim()
		.min(1, t("validation.password.required")),
});

export type ILoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;

export const loginSchema = createLoginSchema((key) => key);