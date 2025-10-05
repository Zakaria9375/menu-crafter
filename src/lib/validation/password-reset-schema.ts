import * as yup from "yup";


export const passwordResetSchema = yup.object({
	email: yup.string().trim().required("Email is required").email("Invalid email")
});

export type IPasswordResetSchema = yup.InferType<typeof passwordResetSchema>;