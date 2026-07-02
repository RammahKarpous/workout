"use client";

import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { readGuestState, clearGuestState, hasGuestData } from "@/lib/guest/storage";

export function GuestMigrationWatcher() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const migrateGuestData = useMutation(api.migration.migrateGuestData);
	const hasRun = useRef(false);

	useEffect(() => {
		if (isLoading || !isAuthenticated || hasRun.current) return;

		const guestState = readGuestState();
		if (!hasGuestData(guestState)) return;

		hasRun.current = true;
		migrateGuestData({
			guestBatchId: guestState.guestBatchId,
			routine: guestState.routine
				? {
						name: guestState.routine.name,
						description: guestState.routine.description,
						exercises: guestState.routine.exercises.map((re) => ({
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
			customExercises: guestState.customExercises,
			sessions: guestState.sessions.map((s) => ({
				routineNameSnapshot: s.routineNameSnapshot,
				startedAt: s.startedAt,
				completedAt: s.completedAt,
				durationSeconds: s.durationSeconds,
				notes: s.notes,
				sets: s.sets.map((set) => ({
					exerciseId: set.exerciseId,
					exerciseNameSnapshot: set.exerciseNameSnapshot,
					setIndex: set.setIndex,
					weight: set.weight,
					reps: set.reps,
					rpe: set.rpe,
					notes: set.notes,
					completedAt: set.completedAt,
				})),
			})),
		})
			.then((result) => {
				if (result.status === "completed" || result.status === "already_migrated") {
					clearGuestState();
				}
			})
			.catch((err) => {
				console.error("Guest data migration failed", err);
				hasRun.current = false;
			});
	}, [isLoading, isAuthenticated, migrateGuestData]);

	return null;
}
