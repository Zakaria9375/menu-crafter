import { z } from "zod";

export const registerSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, "Full Name is required")
			.regex(
				/^[a-zA-Z]+ [a-zA-Z]+/,
				"Please provide both first and last name(e.g. John Doe)"
			),
		email: z.email("Invalid email").trim().min(1, "Email is required"),
		password: z
			.string()
			.trim()
			.min(1, "Password is required")
			.min(8, "Password must be at least 8 characters")
			.max(32, "Password must be less than 32 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
				"Password must contain at least one uppercase letter, one lowercase letter, one number"
			),
		confirmPassword: z.string().trim().min(1, "Confirm Password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});

export type IRegisterSchema = z.infer<typeof registerSchema>;
