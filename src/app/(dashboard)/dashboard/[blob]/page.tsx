"use client";

import { DashboardSectionCards } from "@/app/(dashboard)/dashboard/[blob]/dashboard-section-cards";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Workout, WorkoutEntry } from "@/dto/workouts";
import { isBlank } from "@/utils/common";
import { Plus } from "lucide-react";
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { IWorkoutEntryModalForm, WorkoutEntryModalType } from "./types";
import { Select } from "@/components/ui/select";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSelectedDateStore, useWorkoutEntriesStore } from "@/app/store";

const Page = () => {
	const { selectedDate, setSelectedDate } = useSelectedDateStore();
	const { workoutEntries, setWorkoutEntries } = useWorkoutEntriesStore();
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [editWorkoutId, setEditWorkoutId] = useState<number>(0);
	const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
	const [workoutEntryModalType, setWorkoutEntryModalType] =
		useState<WorkoutEntryModalType>("Create");

	useEffect(() => {
		const callGetWorkouts = async () => {
			const res = await fetch("/api/workouts");
			const data: Workout[] = await res.json();

			if (res.ok) {
				setWorkouts(data);
			}
		};

		callGetWorkouts();
	}, []);

	useEffect(() => {
		const LIST_WORKOUT_ENTRIES_ENDPOINT = "/api/workoutEntries";
		let endpoint = LIST_WORKOUT_ENTRIES_ENDPOINT;

		const resolvedDate = toIsoDate(selectedDate?.toLocaleDateString());

		if (!isBlank(resolvedDate)) {
			endpoint += `?date=${resolvedDate}`;
		}

		const callGetWorkoutsEntries = async () => {
			const res = await fetch(endpoint);
			const data: WorkoutEntry[] = await res.json();

			if (res.ok) {
				setWorkoutEntries(data);
			}
		};

		callGetWorkoutsEntries();
	}, [selectedDate]);

	return (
		<>
			<DashboardSectionCards
				calories={1234}
				protein={345}
				numberOfWorkoutEntries={workoutEntries.length}
				numberOfDaysTracked={365}
			/>

			<div className="flex justify-center">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={setSelectedDate}
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
						{workoutEntries.map((workout: WorkoutEntry) => {
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
									<TableCell>
										<WorkoutEntryModalFormDropdown
											workoutEntryId={String(workout.id)}
											setWorkoutEntryModalType={
												setWorkoutEntryModalType
											}
											setIsFormModalOpen={
												setIsFormModalOpen
											}
											setEditWorkoutId={setEditWorkoutId}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Create Workout-Entry button */}
			<Button
				className="absolute right-4 lg:right-6 bottom-4 lg:bottom-6 rounded-full w-10 h-10 p-0"
				onClick={() => {
					setIsFormModalOpen(!isFormModalOpen);
					setWorkoutEntryModalType("Create");
				}}
			>
				<Plus className="h-4 w-4" />
			</Button>

			{/* Modal that appears when a workout entry needs to be created or updated */}
			<WorkoutEntryModalForm
				isFormModalOpen={isFormModalOpen}
				setIsFormModalOpen={setIsFormModalOpen}
				workoutEntryModalType={workoutEntryModalType}
				workouts={workouts}
				editWorkoutId={editWorkoutId}
			/>
		</>
	);
};

const WorkoutEntryModalForm = ({
	isFormModalOpen,
	setIsFormModalOpen,
	workoutEntryModalType,
	workouts,
	editWorkoutId,
}: IWorkoutEntryModalForm) => {
	type HTTP_METHOD = "POST" | "PUT";

	const { selectedDate } = useSelectedDateStore();
	const { workoutEntries, setWorkoutEntries } = useWorkoutEntriesStore();
	const [error, setError] = useState<string>("");

	const WORKOUT_ENTRIES_ENDPOINT = "/api/workoutEntries";

	const [currentWorkout, setCurrentWorkout] = useState<
		WorkoutEntry | undefined
	>(undefined);

	useEffect(() => {
		setCurrentWorkout(
			workoutEntries
				.filter((workoutEntry) => {
					return workoutEntry.id == editWorkoutId;
				})
				.at(0)
		);
	}, [workoutEntries, editWorkoutId]);

	interface WorkoutEntryModalFormProp {
		dialogTitle: string;
		dialogDescription: string;
		buttonSubmitText: string;
	}

	interface WorkoutEntryModalFormDataProp {
		Create: WorkoutEntryModalFormProp;
		Edit: WorkoutEntryModalFormProp;
	}

	const workoutEntryModalTypeData: WorkoutEntryModalFormDataProp = {
		Create: {
			dialogTitle: "Create Workout Entry",
			dialogDescription:
				"Log a new workout entry. Click create when you're done.",
			buttonSubmitText: "Create",
		},
		Edit: {
			dialogTitle: "Edit Workout Entry",
			dialogDescription:
				"Edit an existing workout entry. Click update when you're done.",
			buttonSubmitText: "Update",
		},
	};

	const handleCreateWorkoutEntrySubmit = async (
		e: FormEvent<HTMLFormElement>
	) => {
		handleWorkoutEntrySubmit(
			e,
			WORKOUT_ENTRIES_ENDPOINT,
			"POST",
			(workoutEntries, res) => [...workoutEntries, res]
		);
	};

	const handleEditWorkoutEntrySubmit = async (
		e: FormEvent<HTMLFormElement>
	) => {
		const formData = new FormData(e.currentTarget);
		const workoutEntryId = formData.get("workoutEntryId");
		handleWorkoutEntrySubmit(
			e,
			WORKOUT_ENTRIES_ENDPOINT + `?id=${workoutEntryId}`,
			"PUT",
			(workoutEntries, res) => [
				...workoutEntries.filter(
					(workoutEntry) => workoutEntry.id != res.id
				),
				res,
			]
		);
	};

	const handleWorkoutEntrySubmit = async (
		e: FormEvent<HTMLFormElement>,
		endpoint: string,
		httpMethod: HTTP_METHOD,
		callback: (workoutEntries: WorkoutEntry[], res: any) => WorkoutEntry[]
	) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const workoutId = formData.get("workoutEntryWorkoutId");
		const sets = formData.get("workoutEntrySets");
		const reps = formData.get("workoutEntryReps");
		const weight = formData.get("workoutEntryWeight");
		const duration = formData.get("workoutEntryDuration");
		const date = formData.get("workoutEntryDate");

		const body = {
			workoutId: workoutId,
			workoutEntry: {
				sets: sets,
				reps: reps,
				weight: weight,
				duration: duration,
				date: date,
			},
		};

		try {
			setError("");
			const res = await fetch(endpoint, {
				method: httpMethod,
				body: JSON.stringify(body),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data?.error);
				throw new Error(`Request failed with status ${res.status}`);
			}

			setWorkoutEntries(callback(workoutEntries, data));
		} catch (err) {
			console.error("Error submitting form:", err);
		}
	};

	let dialogTitle: String = "";
	let dialogDescription: String = "";
	let buttonSubmitText: String = "";

	if (workoutEntryModalType == "Create") {
		dialogTitle = workoutEntryModalTypeData.Create.dialogTitle;
		dialogDescription = workoutEntryModalTypeData.Create.dialogDescription;
		buttonSubmitText = workoutEntryModalTypeData.Create.buttonSubmitText;
	} else {
		dialogTitle = workoutEntryModalTypeData.Edit.dialogTitle;
		dialogDescription = workoutEntryModalTypeData.Edit.dialogDescription;
		buttonSubmitText = workoutEntryModalTypeData.Edit.buttonSubmitText;
	}

	return (
		<Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogDescription>{dialogDescription}</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={
						workoutEntryModalType == "Create"
							? handleCreateWorkoutEntrySubmit
							: handleEditWorkoutEntrySubmit
					}
				>
					<div className="grid gap-4">
						<Input
							id="workoutEntryId"
							name="workoutEntryId"
							type="hidden"
							defaultValue={currentWorkout?.id}
						/>
						<div className="grid gap-3">
							<Label>Workout</Label>
							<Select
								name="workoutEntryWorkoutId"
								defaultValue={
									workoutEntryModalType == "Edit" &&
									currentWorkout != undefined
										? String(currentWorkout.workoutId)
										: undefined
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a workout" />
								</SelectTrigger>
								<SelectContent>
									{workouts.map((workout) => {
										return (
											<SelectItem
												key={workout.id}
												value={String(workout.id)}
											>
												{workout.name}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="workoutEntrySets">Sets</Label>
							<Input
								id="workoutEntrySets"
								name="workoutEntrySets"
								type="number"
								autoComplete="off"
								defaultValue={
									workoutEntryModalType == "Edit" &&
									currentWorkout != undefined
										? currentWorkout.sets
										: undefined
								}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="workoutEntryReps">Reps</Label>
							<Input
								id="workoutEntryReps"
								name="workoutEntryReps"
								type="number"
								autoComplete="off"
								defaultValue={
									workoutEntryModalType == "Edit" &&
									currentWorkout != undefined
										? currentWorkout.reps
										: undefined
								}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="workoutEntryWeight">Weight</Label>
							<Input
								id="workoutEntryWeight"
								name="workoutEntryWeight"
								type="number"
								autoComplete="off"
								defaultValue={
									workoutEntryModalType == "Edit" &&
									currentWorkout != undefined
										? currentWorkout.weight
										: undefined
								}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="workoutEntryDuration">
								Duration
							</Label>
							<Input
								id="workoutEntryDuration"
								name="workoutEntryDuration"
								type="number"
								autoComplete="off"
								defaultValue={
									workoutEntryModalType == "Edit" &&
									currentWorkout != undefined
										? currentWorkout.duration
										: "0"
								}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="workoutEntryDate">Date</Label>
							<Input
								id="workoutEntryDate"
								name="workoutEntryDate"
								type="date"
								defaultValue={
									toIsoDate(
										selectedDate?.toLocaleDateString()
									) || getTodaysDate()
								}
								autoComplete="off"
							/>
						</div>
						{error && (
							<Label className="text-red-400">{error}</Label>
						)}
					</div>
					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button type="submit">{buttonSubmitText}</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const WorkoutEntryModalFormDropdown = ({
	workoutEntryId,
	setWorkoutEntryModalType,
	setIsFormModalOpen,
	setEditWorkoutId,
}: {
	workoutEntryId: string;
	setWorkoutEntryModalType: Dispatch<SetStateAction<WorkoutEntryModalType>>;
	setIsFormModalOpen: Dispatch<SetStateAction<boolean>>;
	setEditWorkoutId: Dispatch<SetStateAction<number>>;
}) => {
	const { workoutEntries, setWorkoutEntries } = useWorkoutEntriesStore();

	const handleDeleteWorkoutEntry = async (workoutEntryId: string) => {
		try {
			const res = await fetch(
				`/api/workoutEntries?id=${workoutEntryId}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}
			setWorkoutEntries(
				workoutEntries.filter(
					(workoutEntry) => String(workoutEntry.id) != workoutEntryId
				)
			);
		} catch (err) {
			console.error("Error deleting workout entry:", err);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">...</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-28" align="end">
				<DropdownMenuItem
					onClick={() => {
						setEditWorkoutId(parseInt(workoutEntryId));
						setWorkoutEntryModalType("Edit");
						setIsFormModalOpen(true);
					}}
				>
					Edit
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						handleDeleteWorkoutEntry(workoutEntryId);
					}}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
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

const getTodaysDate = (): string => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
};

export default Page;
