import { Workout, WorkoutEntry as WorkoutEntryDto } from "@/dto/workouts";
import { Dispatch, ReactNode, SetStateAction } from "react";

export interface IDashboardSectionCard {
	calories: number;
	protein: number;
	numberOfWorkoutEntries: number;
	numberOfDaysTracked: number;
}

export interface IWorkoutEntryModalForm {
	button: ReactNode;
	dialogTitle: string;
	dialogDescription: string;
	buttonSubmitText: string;
	workouts: Workout[];
	workoutEntries: WorkoutEntryDto[];
	setWorkoutEntries: Dispatch<SetStateAction<WorkoutEntryDto[]>>;
	setError: Dispatch<SetStateAction<string>>;
	error: string;
}

export interface WorkoutEntryRequest {
	workoutId: number;
	workoutEntry: WorkoutEntry;
}

interface WorkoutEntry {
	sets: number;
	reps: number;
	weight: number;
	duration: number;
	date?: Date;
}
