import withAuth from "next-auth/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isBlank, isCustomJwtTokenValid } from "./utils/common";

export default withAuth(
	async function middleware(req: NextRequest) {
		console.log(
			"[middleware] running middleware scanning for authorized custom JWT"
		);

		// If session is valid. Exchanges google JWT for custom JWT from spring boot and sets the jwt cookie.

		const jwtToken = (await cookies()).get("jwt")?.value;
		console.log(`[middleware] Checking if JWT cookie exists: ${jwtToken}`);
		if (isBlank(jwtToken) || jwtToken == undefined) {
			console.log("[middleware] JWT cookie is empty!");
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		} else if (!(await isCustomJwtTokenValid(jwtToken))) {
			console.log("[middleware] JWT cookie was not valid");
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}
	},
	{
		pages: {
			signIn: "/auth/signin",
		},
	}
);

export const config = {
	// Match everything except /api/* and /auth/*
	matcher: ["/((?!api|auth).*)"],
};
