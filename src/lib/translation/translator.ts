/**
 * Translation service
 * Supports multiple translation providers
 */

export type TranslationProvider = "google" | "deepl" | "libre" | "openai";

interface TranslationOptions {
	text: string;
	targetLanguage: string;
	sourceLanguage?: string;
	provider?: TranslationProvider;
}

interface TranslationResult {
	translatedText: string;
	provider: TranslationProvider;
	detectedSourceLanguage?: string;
}

/**
 * Translate text using Google Translate API
 */
async function translateWithGoogle(
	text: string,
	targetLanguage: string,
	sourceLanguage?: string
): Promise<TranslationResult> {
	const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

	if (!apiKey) {
		throw new Error("GOOGLE_TRANSLATE_API_KEY is not set");
	}

	const url = new URL(
		"https://translation.googleapis.com/language/translate/v2"
	);
	url.searchParams.set("key", apiKey);
	url.searchParams.set("q", text);
	url.searchParams.set("target", targetLanguage);
	if (sourceLanguage) {
		url.searchParams.set("source", sourceLanguage);
	}

	const response = await fetch(url.toString(), {
		method: "POST",
	});

	if (!response.ok) {
		throw new Error(`Translation failed: ${response.statusText}`);
	}

	const data = await response.json();

	return {
		translatedText: data.data.translations[0].translatedText,
		provider: "google",
		detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage,
	};
}

/**
 * Translate text using LibreTranslate (free, self-hosted option)
 */
async function translateWithLibre(
	text: string,
	targetLanguage: string,
	sourceLanguage: string = "en"
): Promise<TranslationResult> {
	const apiUrl =
		process.env.LIBRETRANSLATE_API_URL || "https://libretranslate.com";
	const apiKey = process.env.LIBRETRANSLATE_API_KEY;

	const response = await fetch(`${apiUrl}/translate`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
		body: JSON.stringify({
			q: text,
			source: sourceLanguage,
			target: targetLanguage,
			format: "text",
		}),
	});

	if (!response.ok) {
		throw new Error(`Translation failed: ${response.statusText}`);
	}

	const data = await response.json();

	return {
		translatedText: data.translatedText,
		provider: "libre",
	};
}

/**
 * Translate text using OpenAI (best quality, more expensive)
 */
async function translateWithOpenAI(
	text: string,
	targetLanguage: string,
	sourceLanguage: string = "English"
): Promise<TranslationResult> {
	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		throw new Error("OPENAI_API_KEY is not set");
	}

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, nothing else.`,
				},
				{
					role: "user",
					content: text,
				},
			],
			temperature: 0.3,
		}),
	});

	if (!response.ok) {
		throw new Error(`Translation failed: ${response.statusText}`);
	}

	const data = await response.json();

	return {
		translatedText: data.choices[0].message.content,
		provider: "openai",
	};
}

/**
 * Main translation function
 */
export async function translateText(
	options: TranslationOptions
): Promise<TranslationResult> {
	const { text, targetLanguage, sourceLanguage, provider = "google" } = options;

	if (!text || text.trim() === "") {
		return {
			translatedText: text,
			provider,
		};
	}

	try {
		switch (provider) {
			case "google":
				return await translateWithGoogle(text, targetLanguage, sourceLanguage);
			case "libre":
				return await translateWithLibre(
					text,
					targetLanguage,
					sourceLanguage || "en"
				);
			case "openai":
				return await translateWithOpenAI(
					text,
					targetLanguage,
					sourceLanguage || "English"
				);
			default:
				throw new Error(`Unsupported translation provider: ${provider}`);
		}
	} catch (error) {
		console.error("Translation error:", error);
		throw error;
	}
}

/**
 * Translate an entire object recursively
 */
export async function translateObject<T extends Record<string, any>>(
	obj: T,
	targetLanguage: string,
	sourceLanguage?: string,
	provider?: TranslationProvider
): Promise<T> {
	const result: any = {};

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "string" && value.trim() !== "") {
			try {
				const translation = await translateText({
					text: value,
					targetLanguage,
					sourceLanguage,
					provider,
				});
				result[key] = translation.translatedText;
			} catch (error) {
				console.error(`Failed to translate field ${key}:`, error);
				result[key] = value; // Keep original on error
			}
		} else if (typeof value === "object" && value !== null) {
			result[key] = await translateObject(
				value,
				targetLanguage,
				sourceLanguage,
				provider
			);
		} else {
			result[key] = value;
		}
	}

	return result as T;
}

/**
 * Language code mappings (ISO 639-1)
 */
export const LANGUAGE_CODES: Record<string, string> = {
	en: "English",
	ar: "Arabic",
	zh: "Chinese",
	fr: "French",
	de: "German",
	hi: "Hindi",
	it: "Italian",
	ja: "Japanese",
	ko: "Korean",
	pt: "Portuguese",
	ru: "Russian",
	es: "Spanish",
	tr: "Turkish",
	nl: "Dutch",
	sv: "Swedish",
	no: "Norwegian",
	da: "Danish",
	fi: "Finnish",
	pl: "Polish",
	cs: "Czech",
};
