import { IActionResult } from "@/types/ITypes";
import { generatePasswordResetEmail } from "./templates/passwordReset";
import { failure, success } from "@/utils/actionResult";
import { mailer } from ".";
import { Locale } from "@/i18n/routing";

/**
 * Send password reset email
 * @param email - User email address
 * @param userName - User's name
 * @param resetToken - Password reset token
 * @param locale - User's locale (en or ar)
 * @returns Promise with success status
 */
export async function sendPasswordResetEmail(
	email: string,
	userName: string,
	token: string,
	locale: Locale
): Promise<IActionResult<undefined>> {
	try {
		// Load translations dynamically based on locale
		const messages = await import(`../../../messages/${locale}.json`);
		const translations = messages.default.email.passwordReset;

		// Generate reset link
		const baseUrl = process.env.APP_URL || "http://localhost:3000";
		const resetLink = `${baseUrl}/${locale}/change-password?token=${token}`;

		// Generate email content
		const emailContent = generatePasswordResetEmail({
			userName,
			resetLink,
			locale,
			translations,
		});

		await mailer.sendMail({
			from: "onboarding@resend.dev",
			to: email,
			subject: emailContent.subject,
			html: emailContent.html,
		});

		return success("Password reset email sent successfully");
	} catch (error) {
		return failure("Error sending password reset email", error as Error);
	}
}

