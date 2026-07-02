"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useGuestState } from "@/lib/guest/useGuestState";
import { GUEST_ROUTINE_ID } from "./types";
import type { RoutineDetailDTO } from "./types";

export function useRoutine(routineId: string): {
	routine: RoutineDetailDTO | null | undefined;
	isLoading: boolean;
	source: "guest" | "convex";
} {
	const { isAuthenticated } = useConvexAuth();
	const isGuestRoute = routineId === GUEST_ROUTINE_ID;
	const convexRoutine = useQuery(
		api.routines.get,
		isAuthenticated && !isGuestRoute
			? { routineId: routineId as Id<"routines"> }
			: "skip",
	);
	const guestState = useGuestState();

	if (isGuestRoute) {
		const r = guestState.routine;
		return {
			routine: r
				? {
						id: GUEST_ROUTINE_ID,
						name: r.name,
						description: r.description,
						createdAt: r.createdAt,
						exercises: [...r.exercises]
							.sort((a, b) => a.order - b.order)
							.map((re) => ({
								id: re.id,
								exerciseId: re.exerciseId,
								exerciseName: re.exerciseName,
								order: re.order,
								targetSets: re.targetSets,
								targetRepsMin: re.targetRepsMin,
								targetRepsMax: re.targetRepsMax,
								targetWeight: re.targetWeight,
								targetRestSeconds: re.targetRestSeconds,
								notes: re.notes,
							})),
					}
				: null,
			isLoading: false,
			source: "guest",
		};
	}

	if (convexRoutine === undefined) {
		return { routine: undefined, isLoading: true, source: "convex" };
	}
	if (convexRoutine === null) {
		return { routine: null, isLoading: false, source: "convex" };
	}
	return {
		routine: {
			id: convexRoutine._id,
			name: convexRoutine.name,
			description: convexRoutine.description,
			createdAt: convexRoutine._creationTime,
			exercises: convexRoutine.exercises
				.filter((re) => re.exercise !== null)
				.map((re) => ({
					id: re._id,
					exerciseId: re.exerciseId,
					exerciseName: re.exercise!.name,
					order: re.order,
					targetSets: re.targetSets,
					targetRepsMin: re.targetRepsMin,
					targetRepsMax: re.targetRepsMax,
					targetWeight: re.targetWeight,
					targetRestSeconds: re.targetRestSeconds,
					notes: re.notes,
				})),
		},
		isLoading: false,
		source: "convex",
	};
}
