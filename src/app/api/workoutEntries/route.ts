import logger from "@/lib/logger";
import { callBackendEndpoint } from "@/utils/apis/apis";
import { isBlank, isValidDateString } from "@/utils/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const WORKOUT_ENTRIES_ENDPOINT = "/v1/workoutentries";

	logger.info("[api/workoutEntries] fetching workoutEntries from backend");

	const date = req.nextUrl.searchParams.get("date");

	if (isBlank(date)) {
		return await callBackendEndpoint(WORKOUT_ENTRIES_ENDPOINT, "GET");
	} else {
		logger.info(
			`[api/workoutEntries] fetching workoutEntries with date entry: ${date}`
		);

		if (date != null && isValidDateString(date)) {
			return await callBackendEndpoint(
				`${WORKOUT_ENTRIES_ENDPOINT}?date=${date}`,
				"GET"
			);
		} else {
			logger.error(
				`[api/workoutEntries] user passed an invalid date: ${date}`
			);
			return NextResponse.json(
				{ error: `Invalid request body: ${date}` },
				{ status: 400 }
			);
		}
	}
}
