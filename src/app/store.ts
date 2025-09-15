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
