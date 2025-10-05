import { z } from "zod";

export const loginSchema = z.object({
	username: z
		.email("Invalid email")
		.trim()
		.min(1, "Email is required"),
	password: z
		.string()
		.trim()
		.min(1, "Password is required"),
});

export type ILoginSchema = z.infer<typeof loginSchema>;
