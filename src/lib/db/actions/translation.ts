"use server";

import { translateObject } from "@/lib/translation/translator";
import { getWebsiteConfig, updateWebsiteConfig } from "./website";
import { IWebsiteContent } from "@/types/website";
import type { TranslationProvider } from "@/lib/translation/translator";

interface AutoTranslateOptions {
	tenantId: string;
	targetLanguage: string;
	sourceLanguage?: string;
	provider?: TranslationProvider;
	sectionsToTranslate?: Array<keyof IWebsiteContent>; // Optional: translate specific sections only
}

interface AutoTranslateResult {
	success: boolean;
	translatedContent?: Partial<IWebsiteContent>;
	error?: string;
}

/**
 * Auto-translate website content to a target language
 */
export async function autoTranslateWebsiteContent(
	options: AutoTranslateOptions
): Promise<AutoTranslateResult> {
	try {
		const {
			tenantId,
			targetLanguage,
			sourceLanguage = "en",
			provider = "google",
			sectionsToTranslate,
		} = options;

		// Get current website config
		const configResult = await getWebsiteConfig(tenantId);

		if (!configResult.success || !configResult.data) {
			return {
				success: false,
				error: "Failed to fetch website configuration",
			};
		}

		const { content } = configResult.data;

		if (!content) {
			return {
				success: false,
				error: "No content to translate",
			};
		}

		// Determine which sections to translate
		const sectionsToProcess = sectionsToTranslate || [
			"hero",
			"about",
			"whyUs",
			"footer",
		];

		// Translate each section
		const translatedContent: Partial<IWebsiteContent> = {};

		for (const section of sectionsToProcess) {
			const sectionContent = content[section];

			if (sectionContent) {
				try {
					translatedContent[section] = await translateObject(
						sectionContent as any,
						targetLanguage,
						sourceLanguage,
						provider
					);
				} catch (error) {
					console.error(`Failed to translate ${section} section:`, error);
					// Continue with other sections even if one fails
				}
			}
		}

		// Get existing translations
		const existingTranslations = configResult.data.translations || {};

		// Merge with existing translations (don't overwrite if already exists)
		const updatedTranslations = {
			...existingTranslations,
			[targetLanguage]: {
				...existingTranslations[targetLanguage],
				...translatedContent,
			},
		};

		// Save updated translations
		const updateResult = await updateWebsiteConfig(tenantId, {
			translations: updatedTranslations,
		});

		if (!updateResult.success) {
			return {
				success: false,
				error: "Failed to save translations",
			};
		}

		return {
			success: true,
			translatedContent,
		};
	} catch (error) {
		console.error("Auto-translate error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Translation failed",
		};
	}
}

/**
 * Auto-translate a specific section
 */
export async function autoTranslateSection(
	tenantId: string,
	section: keyof IWebsiteContent,
	targetLanguage: string,
	sourceLanguage: string = "en",
	provider: TranslationProvider = "google"
): Promise<AutoTranslateResult> {
	return autoTranslateWebsiteContent({
		tenantId,
		targetLanguage,
		sourceLanguage,
		provider,
		sectionsToTranslate: [section],
	});
}

/**
 * Check if a language has translations
 */
export async function hasTranslations(
	tenantId: string,
	languageCode: string
): Promise<boolean> {
	const configResult = await getWebsiteConfig(tenantId);

	if (!configResult.success || !configResult.data) {
		return false;
	}

	const translations = configResult.data.translations || {};
	const languageTranslations = translations[languageCode];

	return !!languageTranslations && Object.keys(languageTranslations).length > 0;
}
