export type LocaleParams = Promise<{ locale: string }>;

export interface IActionResult<T> {
	success: boolean;
	message: string;
	data?: T;
	error?: Error;
}

