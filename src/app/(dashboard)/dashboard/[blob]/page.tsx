"use client";

import { SectionCards } from "@/components/section-cards";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { WorkoutEntry } from "@/dto/workouts";
import { isBlank } from "@/utils/common";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);

	useEffect(() => {
		const LIST_WORKOUT_ENTRIES_ENDPOINT = "/api/workoutEntries";
		let endpoint = LIST_WORKOUT_ENTRIES_ENDPOINT;

		const resolvedDate = toIsoDate(date?.toLocaleDateString());
		console.log(`Date changed to: ${resolvedDate}`);

		if (!isBlank(resolvedDate)) {
			endpoint += `?date=${resolvedDate}`;
		}

		const callGetWorkoutsApi = async () => {
			const res = await fetch(endpoint);
			const data: WorkoutEntry[] = await res.json();

			if (res.ok) {
				setWorkouts(data);
			}
		};

		callGetWorkoutsApi();
	}, [date]);

	return (
		<>
			<SectionCards />

			<div className="flex justify-center">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
					captionLayout="dropdown"
					buttonVariant="ghost"
				/>
			</div>

			<div className="px-4 lg:px-6">
				<Table>
					<TableCaption>Your Workout Entries</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Date</TableHead>
							<TableHead>Workout Name</TableHead>
							<TableHead>Sets</TableHead>
							<TableHead>Reps</TableHead>
							<TableHead>Weight</TableHead>
							<TableHead>Duration</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{workouts.map((workout: WorkoutEntry) => {
							return (
								<TableRow key={workout.id}>
									<TableCell className="font-medium">
										{workout.date}
									</TableCell>
									<TableCell>{workout.workoutName}</TableCell>
									<TableCell>{workout.sets}</TableCell>
									<TableCell>{workout.reps}</TableCell>
									<TableCell>{workout.weight}</TableCell>
									<TableCell>{workout.duration}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Create Workout Entry button */}
			<Button className="rounded-full w-10 h-10 p-0">
				<Plus className="h-4 w-4" />
			</Button>
		</>
	);
};

function toIsoDate(dateStr: string | undefined): string | null {
	if (isBlank(dateStr) || dateStr == undefined) return null;
	// Expecting format like "9/29/2025"
	const parts = dateStr.split("/");
	if (parts.length !== 3) return null;

	const [monthStr, dayStr, yearStr] = parts;

	const year = parseInt(yearStr, 10);
	const month = parseInt(monthStr, 10);
	const day = parseInt(dayStr, 10);

	// Basic validation
	if (
		isNaN(year) ||
		isNaN(month) ||
		isNaN(day) ||
		month < 1 ||
		month > 12 ||
		day < 1 ||
		day > 31
	) {
		return null;
	}

	// Pad month/day with leading zeros
	const mm = month.toString().padStart(2, "0");
	const dd = day.toString().padStart(2, "0");

	return `${year}-${mm}-${dd}`;
}

export default Page;
