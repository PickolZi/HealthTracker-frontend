export interface WorkoutEntry {
	id: number;
	workoutName: string;
	workoutDescription: string;
	sets: number;
	reps: number;
	weight: number;
	duration: number;
	date: string;
	createdAt: Date;
}
