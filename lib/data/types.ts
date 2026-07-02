export interface RoutineDTO {
	id: string;
	name: string;
	description?: string;
	createdAt: number;
}

export interface RoutineExerciseDTO {
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

export interface RoutineDetailDTO extends RoutineDTO {
	exercises: RoutineExerciseDTO[];
}

export const GUEST_ROUTINE_ID = "guest";

export interface SetEntryDTO {
	id: string;
	exerciseId: string;
	exerciseName: string;
	weight: number;
	reps: number;
	rpe?: number;
	notes?: string;
	completedAt: number;
}

export interface SessionDTO {
	id: string;
	routineId: string;
	routineName: string;
	startedAt: number;
	completedAt?: number;
	durationSeconds?: number;
	notes?: string;
	sets: SetEntryDTO[];
}
