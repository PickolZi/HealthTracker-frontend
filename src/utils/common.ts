import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { jwtVerify } from "jose";
import { getServerSession } from "next-auth";

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

export async function isCustomJwtTokenValid(
	jwtToken: string
): Promise<boolean> {
	const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

	try {
		console.log("[utils/common] checking if custom JWT is valid");
		const encoder = new TextEncoder();
		await jwtVerify(jwtToken, encoder.encode(NEXTAUTH_SECRET));

		console.log("[utils/common] custom JWT is valid!");
		return true;
	} catch (err) {
		console.error("[utils/common] custom JWT is NOT valid!");
		console.error(err);
		return false;
	}
}
