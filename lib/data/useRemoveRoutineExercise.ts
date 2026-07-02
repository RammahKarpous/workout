"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { guestStore } from "@/lib/guest/guestStore";
import { GUEST_ROUTINE_ID } from "./types";

export function useRemoveRoutineExercise() {
	const convexRemove = useMutation(api.routineExercises.remove);

	return async (routineId: string, routineExerciseId: string) => {
		if (routineId === GUEST_ROUTINE_ID) {
			guestStore.actions.removeRoutineExercise(routineExerciseId);
			return;
		}
		await convexRemove({
			routineExerciseId: routineExerciseId as Id<"routineExercises">,
		});
	};
}
