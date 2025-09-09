export const isBlank = (str: string | String | null | undefined): boolean => {
	return !str || str.trim().length == 0;
};

export function isArrayEmpty<T>(arr: T[] | null | undefined): boolean {
	return !arr || arr.length === 0;
}

export function isValidDateString(dateStr: string): boolean {
	// 1. Check format using regex (YYYY-MM-DD)
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(dateStr)) {
		return false;
	}

	// 2. Parse components
	const [year, month, day] = dateStr.split("-").map(Number);

	// 3. Validate ranges
	if (month < 1 || month > 12) return false;
	if (day < 1 || day > 31) return false;

	return true;
}
