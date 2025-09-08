import logger from "@/lib/logger";
import { callBackendEndpoint } from "@/utils/apis/apis";

export async function GET() {
	logger.info("[api/workoutEntries] fetching workoutEntries from backend");

	return await callBackendEndpoint("/v1/workoutentries", "GET");
}
