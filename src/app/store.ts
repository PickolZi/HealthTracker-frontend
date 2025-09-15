import { WorkoutEntry } from "@/dto/workouts";
import { create } from "zustand";

type WorkoutEntriesState = {
	workoutEntries: WorkoutEntry[];
	setWorkoutEntries: (workoutEntries: WorkoutEntry[]) => void;
};

export const useWorkoutEntriesStore = create<WorkoutEntriesState>((set) => ({
	workoutEntries: [],
	setWorkoutEntries: (newWorkoutEntries) =>
		set({ workoutEntries: newWorkoutEntries }),
}));

type SelectedDateState = {
	selectedDate: Date | undefined;
	setSelectedDate: (selectedDate: Date | undefined) => void;
};

export const useSelectedDateStore = create<SelectedDateState>((set) => ({
	selectedDate: new Date(),
	setSelectedDate: (newSelectedDate) =>
		set({ selectedDate: newSelectedDate }),
}));
