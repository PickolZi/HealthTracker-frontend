import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import logger from "@/lib/logger";
import { cookies } from "next/headers";
import { callBackendEndpointWithoutJwtToken } from "@/utils/apis/apis";

interface JwtExchangeResponse {
	jwtToken: string;
}

export async function GET() {
	logger.info(
		"[api/exchange] initiating token swap. Sending google JWT for a custom backend JWT with userId"
	);

	const session = await getServerSession(authOptions);

	if (!(session as any)?.idToken) {
		logger.error(
			"[api/exchange] failed to find google token for session user. Therefore can not fetch custom JWT token"
		);
		return new Response("Not authenticated", { status: 401 });
	}
	logger.info("[api/exchange] successfully found google token for user");

	const body = {
		googleIdToken: (session as any).idToken,
	};

	const res: Response = await callBackendEndpointWithoutJwtToken(
		"/api/auth/google",
		"POST",
		body
	);

	// Need to clone the data in order to read or else race conditions will lock the returning data.
	const cloned = res.clone();
	await cloned.json().then(async (data) => {
		setJWTCookieForUser(data);
	});

	return res;
}

const setJWTCookieForUser = async (
	jwtExchangeResponse: JwtExchangeResponse
) => {
	// NextJS server saves and fetches cookie from user where we send the custom jwt to the backend through the authorizer bearer header
	logger.info(`[api/exchange] setting custom jwt inside cookie for jwt`);
	(await cookies()).set("jwt", jwtExchangeResponse.jwtToken, {
		path: "/",
		maxAge: 60 * 60 * 24,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
};
