import { Workout } from "@/dto/workouts";
import { Dispatch, SetStateAction } from "react";

export interface IDashboardSectionCard {
	calories: number;
	protein: number;
	numberOfWorkoutEntries: number;
	numberOfDaysTracked: number;
}

export type WorkoutEntryModalType = "Create" | "Edit";

export interface IWorkoutEntryModalForm {
	isFormModalOpen: boolean;
	setIsFormModalOpen: Dispatch<SetStateAction<boolean>>;
	workoutEntryModalType: WorkoutEntryModalType;
	workouts: Workout[];
	editWorkoutId?: number;
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
