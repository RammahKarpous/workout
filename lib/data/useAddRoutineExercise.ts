"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { guestStore } from "@/lib/guest/guestStore";
import { GUEST_ROUTINE_ID } from "./types";

export interface AddRoutineExerciseInput {
	exerciseId: string;
	exerciseName: string;
	targetSets: number;
	targetRepsMin?: number;
	targetRepsMax?: number;
	targetWeight?: number;
	targetRestSeconds?: number;
	notes?: string;
}

export function useAddRoutineExercise() {
	const convexAdd = useMutation(api.routineExercises.add);

	return async (routineId: string, input: AddRoutineExerciseInput) => {
		if (routineId === GUEST_ROUTINE_ID) {
			guestStore.actions.addRoutineExercise(input);
			return;
		}
		await convexAdd({
			routineId: routineId as Id<"routines">,
			exerciseId: input.exerciseId as Id<"exercises">,
			targetSets: input.targetSets,
			targetRepsMin: input.targetRepsMin,
			targetRepsMax: input.targetRepsMax,
			targetWeight: input.targetWeight,
			targetRestSeconds: input.targetRestSeconds,
			notes: input.notes,
		});
	};
}
