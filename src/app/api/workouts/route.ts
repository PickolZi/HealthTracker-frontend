import logger from "@/lib/logger";
import { callBackendEndpoint } from "@/utils/apis/apis";

const WORKOUTS_ENDPOINT = "/v1/workouts";

export async function GET() {
	logger.info("[api/workouts] fetching available workouts from backend");

	return await callBackendEndpoint(WORKOUTS_ENDPOINT, "GET");
}
