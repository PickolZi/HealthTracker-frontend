"use client";
import { useSession, signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";

interface LoginProps {
	heading?: string;
	logo?: {
		url: string;
		src: string;
		alt: string;
		title?: string;
	};
	buttonText?: string;
	googleText?: string;
	signupText?: string;
	signupUrl?: string;
}

const UsernameAndPasswordSection = ({
	buttonText,
	visible,
}: {
	buttonText: String;
	visible: boolean;
}) => {
	if (!visible) return <></>;
	return (
		<>
			<Input
				type="email"
				placeholder="Email"
				className="text-sm"
				required
			/>
			<Input
				type="password"
				placeholder="Password"
				className="text-sm"
				required
			/>
			<Button type="submit" className="w-full">
				{buttonText}
			</Button>
		</>
	);
};

const LoginWithGoogleSection = () => {
	return (
		<Button
			variant="outline"
			className="hover:cursor-pointer"
			onClick={() => {
				signIn("google");
			}}
		>
			<FcGoogle />
			Login with Google
		</Button>
	);
};

const NeedAnAccountSection = ({
	signupText,
	signupUrl,
	visible,
}: {
	signupText: String;
	signupUrl: string;
	visible: boolean;
}) => {
	if (!visible) return <></>;
	return (
		<div className="text-muted-foreground flex justify-center gap-1 text-sm">
			<p>{signupText}</p>
			<a
				href={signupUrl}
				className="text-primary font-medium hover:underline"
			>
				Sign up
			</a>
		</div>
	);
};

const LoginSection = ({
	heading = "Login to HealthTracker",
	logo = {
		url: "https://google.com",
		src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
		alt: "logo",
		title: "Health Tracker",
	},
	buttonText = "Login",
	signupText = "Need an account?",
	signupUrl = "https://google.com",
}: LoginProps) => {
	const { data: session } = useSession();

	useEffect(() => {
		const callApi = async () => {
			const res = await fetch("/api/exchange");
			const { jwt } = await res.json();
		};
		callApi();
	}, []);

	return (
		<section className="bg-muted h-screen">
			<div className="flex h-full items-center justify-center">
				<div className="flex flex-col items-center gap-6 lg:justify-start">
					<a href={logo.url}>
						{/* Logo */}
						<img
							src={logo.src}
							alt={logo.alt}
							title={logo.title}
							className="h-10 dark:invert"
						/>
					</a>

					<div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
						{heading && (
							<h1 className="text-xl font-semibold">{heading}</h1>
						)}
						<UsernameAndPasswordSection
							buttonText={buttonText}
							visible={false}
						/>

						<LoginWithGoogleSection />
					</div>

					<NeedAnAccountSection
						signupText={signupText}
						signupUrl={signupUrl}
						visible={false}
					/>
				</div>
			</div>
		</section>
	);
};

export { LoginSection };
