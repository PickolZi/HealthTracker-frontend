import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Calories</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						1000 kcal
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Protein</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						123g
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Workout Entries</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						456 workouts
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Days Tracked</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						365 days
					</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
}
