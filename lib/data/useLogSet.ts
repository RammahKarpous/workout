"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { guestStore } from "@/lib/guest/guestStore";

export interface LogSetInput {
	exerciseId: string;
	exerciseName: string;
	weight: number;
	reps: number;
	rpe?: number;
	notes?: string;
}

export function useLogSet() {
	const convexLog = useMutation(api.setEntries.log);

	return async (
		sessionId: string,
		source: "guest" | "convex",
		input: LogSetInput,
	) => {
		if (source === "guest") {
			guestStore.actions.logSet(sessionId, {
				exerciseId: input.exerciseId,
				exerciseNameSnapshot: input.exerciseName,
				weight: input.weight,
				reps: input.reps,
				rpe: input.rpe,
				notes: input.notes,
			});
			return;
		}
		await convexLog({
			sessionId: sessionId as Id<"workoutSessions">,
			exerciseId: input.exerciseId as Id<"exercises">,
			weight: input.weight,
			reps: input.reps,
			rpe: input.rpe,
			notes: input.notes,
		});
	};
}
