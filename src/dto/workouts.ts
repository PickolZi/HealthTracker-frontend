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

export interface Workout {
	id: number;
	name: string;
	description: string;
	muscleGroups: [
		{
			id: number;
			name: string;
		},
		{
			id: number;
			name: string;
		},
		{
			id: number;
			name: string;
		}
	];
}
