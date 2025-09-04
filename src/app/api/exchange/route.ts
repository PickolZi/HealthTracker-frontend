import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!(session as any)?.idToken) {
		return new Response("Not authenticated", { status: 401 });
	}

	const res = await fetch("http://localhost:8080/api/auth/google", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ idToken: (session as any).idToken }),
	});

	const data = await res.json();
	return Response.json(data);
}
