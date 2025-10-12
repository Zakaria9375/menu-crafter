import { Locale } from "@/i18n/routing";

export interface PasswordResetEmailData {
	userName: string;
	resetLink: string;
	locale: Locale;
	translations: {
		subject: string;
		greeting: string;
		title: string;
		description: string;
		button: string;
		linkExpiry: string;
		notRequested: string;
		noReply: string;
		support: string;
		footer: string;
		copyright: string;
		troubleButton: string;
		securityTip: string;
	};
}

export function generatePasswordResetEmail(data: PasswordResetEmailData): {
	subject: string;
	html: string;
	text: string;
} {
	const { userName, resetLink, locale, translations: t } = data;
	const isRTL = locale === "ar";
	const direction = isRTL ? "rtl" : "ltr";
	const textAlign = isRTL ? "right" : "left";

	const html = `
<!DOCTYPE html>
<html lang="${locale}" dir="${direction}">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>${t.subject}</title>
	<!--[if mso]>
	<style type="text/css">
		body, table, td {font-family: Arial, sans-serif !important;}
	</style>
	<![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
	
	<!-- Email Container -->
	<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
		<tr>
			<td style="padding: 40px 20px;">
				
				<!-- Main Content Card -->
				<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					
					<!-- Header with Logo -->
					<tr>
						<td style="padding: 40px 40px 30px 40px; text-align: ${textAlign}; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); border-radius: 12px 12px 0 0;">
							<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
								<tr>
									<td style="text-align: ${textAlign};">
										<div style="display: inline-flex; align-items: center; gap: 12px;">
											<!-- Chef Hat Icon -->
											<div style="width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;">
												<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
													<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
													<line x1="6" y1="17" x2="18" y2="17"></line>
												</svg>
											</div>
											<span style="color: #ffffff; font-size: 28px; font-weight: bold; vertical-align: middle;">Menu Crafter</span>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					
					<!-- Main Content -->
					<tr>
						<td style="padding: 40px 40px 30px 40px; text-align: ${textAlign};">
							<h1 style="margin: 0 0 16px 0; color: #111827; font-size: 28px; font-weight: bold; line-height: 1.3;">
								${t.title}
							</h1>
							
							<p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
								${t.greeting} ${userName || ''},
							</p>
							
							<p style="margin: 0 0 32px 0; color: #374151; font-size: 16px; line-height: 1.6;">
								${t.description}
							</p>
							
							<!-- Reset Button -->
							<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
								<tr>
									<td style="text-align: ${textAlign};">
										<a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
											${t.button}
										</a>
									</td>
								</tr>
							</table>
							
							<!-- Link Expiry Warning -->
							<div style="margin: 32px 0 24px 0; padding: 16px; background-color: #fef3c7; border-${isRTL ? 'right' : 'left'}: 4px solid #f59e0b; border-radius: 6px;">
								<p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
									⏰ ${t.linkExpiry}
								</p>
							</div>
							
							<!-- Security Tip -->
							<div style="margin: 0 0 24px 0; padding: 16px; background-color: #dbeafe; border-${isRTL ? 'right' : 'left'}: 4px solid #3b82f6; border-radius: 6px;">
								<p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
									🔒 ${t.securityTip}
								</p>
							</div>
							
							<!-- Troubleshooting Link -->
							<div style="margin: 0 0 24px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
								<p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
									${t.troubleButton}
								</p>
								<p style="margin: 0; color: #3b82f6; font-size: 13px; word-break: break-all; line-height: 1.5;">
									<a href="${resetLink}" style="color: #3b82f6; text-decoration: underline;">${resetLink}</a>
								</p>
							</div>
							
							<!-- Not Requested Notice -->
							<p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
								${t.notRequested}
							</p>
							
							<!-- Support Contact -->
							<p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
								${t.support} <a href="mailto:support@menucrafter.com" style="color: #0ea5e9; text-decoration: none;">support@menucrafter.com</a>
							</p>
						</td>
					</tr>
					
					<!-- Footer -->
					<tr>
						<td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb; text-align: ${textAlign};">
							<p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
								${t.noReply}
							</p>
							<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; line-height: 1.5; font-weight: 500;">
								${t.footer}
							</p>
							<p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
								${t.copyright}
							</p>
						</td>
					</tr>
					
				</table>
				
				<!-- Spacer -->
				<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
					<tr>
						<td style="padding: 20px 0; text-align: center;">
							<p style="margin: 0; color: #9ca3af; font-size: 12px;">
								Menu Crafter • Modern Restaurant Menu Management
							</p>
						</td>
					</tr>
				</table>
				
			</td>
		</tr>
	</table>
	
</body>
</html>
	`.trim();

	// Plain text version for email clients that don't support HTML
	const text = `
${t.title}

${t.greeting} ${userName || ''},

${t.description}

${t.button}: ${resetLink}

${t.linkExpiry}

${t.notRequested}

${t.securityTip}

---
${t.support} support@menucrafter.com

${t.footer}
${t.copyright}
	`.trim();

	return {
		subject: t.subject,
		html,
		text,
	};
}

