"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useGuestState } from "@/lib/guest/useGuestState";
import { GUEST_ROUTINE_ID } from "./types";
import type { SessionDTO } from "./types";

export function useSession(sessionId: string): {
	session: SessionDTO | null | undefined;
	isLoading: boolean;
	source: "guest" | "convex";
} {
	const { isAuthenticated } = useConvexAuth();
	const guestState = useGuestState();
	const guestSession = guestState.sessions.find((s) => s.id === sessionId);

	const convexSession = useQuery(
		api.workoutSessions.get,
		isAuthenticated && !guestSession
			? { sessionId: sessionId as Id<"workoutSessions"> }
			: "skip",
	);

	if (guestSession) {
		return {
			session: {
				id: guestSession.id,
				routineId: GUEST_ROUTINE_ID,
				routineName: guestSession.routineNameSnapshot,
				startedAt: guestSession.startedAt,
				completedAt: guestSession.completedAt,
				durationSeconds: guestSession.durationSeconds,
				notes: guestSession.notes,
				sets: guestSession.sets.map((s) => ({
					id: s.id,
					exerciseId: s.exerciseId,
					exerciseName: s.exerciseNameSnapshot,
					weight: s.weight,
					reps: s.reps,
					rpe: s.rpe,
					notes: s.notes,
					completedAt: s.completedAt,
				})),
			},
			isLoading: false,
			source: "guest",
		};
	}

	if (convexSession === undefined) {
		return { session: undefined, isLoading: true, source: "convex" };
	}
	if (convexSession === null) {
		return { session: null, isLoading: false, source: "convex" };
	}
	return {
		session: {
			id: convexSession._id,
			routineId: convexSession.routineId ?? "",
			routineName: convexSession.routineNameSnapshot,
			startedAt: convexSession.startedAt,
			completedAt: convexSession.completedAt,
			durationSeconds: convexSession.durationSeconds,
			notes: convexSession.notes,
			sets: convexSession.sets.map((s) => ({
				id: s._id,
				exerciseId: s.exerciseId,
				exerciseName: s.exerciseNameSnapshot,
				weight: s.weight,
				reps: s.reps,
				rpe: s.rpe,
				notes: s.notes,
				completedAt: s.completedAt,
			})),
		},
		isLoading: false,
		source: "convex",
	};
}
