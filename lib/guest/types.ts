export interface GuestState {
	schemaVersion: 1;
	guestBatchId: string;
	routine: GuestRoutine | null;
	customExercises: GuestCustomExercise[];
	sessions: GuestWorkoutSession[];
}

export interface GuestCustomExercise {
	id: string;
	name: string;
	muscleGroups: string[];
	equipment?: string;
}

export interface GuestRoutine {
	id: string;
	name: string;
	description?: string;
	exercises: GuestRoutineExercise[];
	createdAt: number;
}

export interface GuestRoutineExercise {
	id: string;
	exerciseId: string;
	exerciseName: string;
	order: number;
	targetSets: number;
	targetRepsMin?: number;
	targetRepsMax?: number;
	targetWeight?: number;
	targetRestSeconds?: number;
	notes?: string;
}

export interface GuestWorkoutSession {
	id: string;
	routineNameSnapshot: string;
	startedAt: number;
	completedAt?: number;
	durationSeconds?: number;
	notes?: string;
	sets: GuestSetEntry[];
}

export interface GuestSetEntry {
	id: string;
	exerciseId: string;
	exerciseNameSnapshot: string;
	setIndex: number;
	weight: number;
	reps: number;
	rpe?: number;
	notes?: string;
	completedAt: number;
}

export class GuestLimitError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GuestLimitError";
	}
}
