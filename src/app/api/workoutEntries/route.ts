import logger from "@/lib/logger";
import { callBackendEndpoint } from "@/utils/apis/apis";
import { isBlank, isValidDateString } from "@/utils/common";
import { NextRequest, NextResponse } from "next/server";

const WORKOUT_ENTRIES_ENDPOINT = "/v1/workoutentries";

export async function GET(req: NextRequest) {
	const date = req.nextUrl.searchParams.get("date");

	if (isBlank(date)) {
		logger.info(
			"[api/workoutEntries] fetching workoutEntries from backend"
		);
		return await callBackendEndpoint(WORKOUT_ENTRIES_ENDPOINT, "GET");
	} else {
		logger.info(
			`[api/workoutEntries] fetching workoutEntries with date entry: ${date}`
		);

		if (date != null && isValidDateString(date)) {
			const res = await callBackendEndpoint(
				`${WORKOUT_ENTRIES_ENDPOINT}?date=${date}`,
				"GET"
			);

			const cloned = res.clone();
			const clonedRes = await cloned.json();
			if (clonedRes?.status >= 400) {
				logger.error(
					"[api/workoutEntries] failed request from the server, probably unauthorized"
				);
				return NextResponse.json(
					{ error: "Unauthorized User" },
					{ status: 401 }
				);
			}

			return res;
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

export async function POST(req: NextRequest) {
	logger.info(
		"[api/workoutEntries] creating a workoutEntry request for the backend"
	);

	const body = await req.json();

	return await callBackendEndpoint(WORKOUT_ENTRIES_ENDPOINT, "POST", body);
}

export async function PUT(req: NextRequest) {
	logger.info(
		"[api/workoutEntries] updating a workoutEntry request for the backend"
	);

	try {
		const workoutEntryId = getParamsElseThrowsError(req, "id");
		const body = await req.json();
		const endpoint = WORKOUT_ENTRIES_ENDPOINT + `/${workoutEntryId}`;

		return await callBackendEndpoint(endpoint, "PUT", body);
	} catch (err: any) {
		logger.info(
			`[api/workoutEntries] failed to update workoutEntry because of ${err?.message}`
		);
		return NextResponse.json(
			{ error: err?.message || "Bad Request" },
			{ status: 400 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	logger.info(
		"[api/workoutEntries] deleting a workoutEntry request for the backend"
	);

	try {
		const workoutEntryId = getParamsElseThrowsError(req, "id");
		const endpoint = WORKOUT_ENTRIES_ENDPOINT + `/${workoutEntryId}`;

		return await callBackendEndpoint(endpoint, "DELETE");
	} catch (err: any) {
		logger.info(
			`[api/workoutEntries] failed to delete workoutEntry because of ${err?.message}`
		);
		return NextResponse.json(
			{ error: err?.message || "Bad Request" },
			{ status: 400 }
		);
	}
}

const getParamsElseThrowsError = (
	req: NextRequest,
	queryName: string
): string => {
	const value = req.nextUrl.searchParams.get(queryName);

	if (!value) {
		throw new Error(`Missing required query parameter: ${queryName}`);
	}

	return value;
};
