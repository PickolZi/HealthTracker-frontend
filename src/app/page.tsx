"use client";

import { useSession, signIn, signOut } from "next-auth/react";

import { LoginSection } from "@/components/authentication/loginSection";

export default function Home() {
	const { data: session } = useSession();

	if (!session) {
		console.log("session not found");
	} else {
		console.log("session found: " + session.user?.email);
	}

	return (
		<div className="bg-background">
			<LoginSection></LoginSection>
			{session && <button onClick={() => signOut()}>Sign out</button>}
		</div>
	);
}
