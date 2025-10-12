export type LocaleParams = Promise<{ locale: string }>;

export interface IActionResult<T> {
	succeeded: boolean;
	message: string;
	data?: T;
	error?: Error;
}

export type TranslationFunction = (key: string, values?: Record<string, string | number>) => string;
