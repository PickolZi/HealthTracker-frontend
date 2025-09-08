export const isBlank = (str: string | String | null | undefined): boolean => {
	return !str || str.trim().length == 0;
};

export function isArrayEmpty<T>(arr: T[] | null | undefined): boolean {
	return !arr || arr.length === 0;
}
