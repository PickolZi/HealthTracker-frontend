import LogoutButton from "@/components/authentication/logout-button";

export default function Home() {
	return (
		<div className="bg-background">
			<h1>Welcome to the home page!</h1>
			<LogoutButton />
		</div>
	);
}
