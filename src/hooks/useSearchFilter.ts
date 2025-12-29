import { useMemo } from "react";

/**
 * Generic hook for filtering items based on a search term
 * @param items - Array of items to filter
 * @param searchTerm - The search term to filter by
 * @param filterFn - Function that determines if an item matches the search term
 * @returns Filtered array of items
 */
export function useSearchFilter<T>(
	items: T[],
	searchTerm: string,
	filterFn: (item: T, term: string) => boolean
): T[] {
	return useMemo(
		() => items.filter((item) => filterFn(item, searchTerm)),
		[items, searchTerm, filterFn]
	);
}
