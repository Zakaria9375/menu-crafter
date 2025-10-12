import { IActionResult } from "@/types/ITypes";

/**
 * Create a successful action result
 * @param message - Success message
 * @param data - Optional data to return
 * @returns IActionResult with success: true
 */
export function success<T>(message: string, data?: T): IActionResult<T> {
	return {
		succeeded: true,
		message,
		data,
	};
}

/**
 * Create a failed action result
 * @param message - Error message
 * @param error - Optional error object
 * @returns IActionResult with success: false
 */
export function failure<T>(message: string, error?: Error): IActionResult<T> {
	// Automatically log errors server-side
	if (error) {
		console.error(`[Error] ${message}:`, error);
	}
	
	return {
		succeeded: false,
		message,
		error,
	};
}

/**
 * Create a validation error result
 * @param error - Validation error object
 * @returns IActionResult with success: false
 */
export function validationError<T>(error: Error): IActionResult<T> {
	return {
		succeeded: false,
		message: "Validation failed",
		error,
	};
}

