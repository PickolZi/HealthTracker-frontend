import logger from "@/lib/logger";
import { cookies } from "next/headers";
import { isBlank } from "../common";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface PayloadProp {
	method: HttpMethod;
	headers: { [key: string]: string };
	body?: string;
}

export const callBackendEndpoint = async (
	endpoint: string,
	httpMethod: HttpMethod,
	body?: { [key: string]: string }
): Promise<Response> => {
	const backendEndpoint = process.env.BACKEND_ENDPOINT;
	const fullUrlEndpoint = new URL(endpoint, backendEndpoint);

	const jwtToken = (await cookies()).get("jwt")?.value;
	if (isBlank(jwtToken)) {
		logger.info(
			`[utils/apis] failed to find a custom JWT, therefore failing backend request`
		);
		return Response.json(
			{
				error: "Failed to authorize this request",
			},
			{ status: 401 }
		);
	}
	logger.info(`[utils/apis] successfully found a custom JWT: ${jwtToken}`);

	return callBackendEndpointWithoutJwtToken(
		endpoint,
		httpMethod,
		body,
		jwtToken
	);
};

export const callBackendEndpointWithoutJwtToken = async (
	endpoint: string,
	httpMethod: HttpMethod,
	body?: { [key: string]: string },
	jwtToken?: string
): Promise<Response> => {
	const backendEndpoint = process.env.BACKEND_ENDPOINT;
	const fullUrlEndpoint = new URL(endpoint, backendEndpoint);

	const payload: PayloadProp = {
		method: httpMethod,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (!isBlank(jwtToken)) {
		payload.headers.authorization = `Bearer ${jwtToken}`;
	}

	if (body != undefined && body != null) {
		payload.body = JSON.stringify(body);
	}

	const res = await fetch(fullUrlEndpoint, payload)
		.then(async (data) => {
			const resData = await data.json();
			logger.info(
				"[utils/apis] successfully retrieved data from backend api"
			);
			return resData;
		})
		.catch((error) => {
			logger.error(
				`[utils/apis] failed to fetch data from backend because of: ${error}`
			);
			return { error: "failed to fetch data from the backend" };
		});

	return Response.json(res, { status: 200 });
};
