"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useGuestState } from "@/lib/guest/useGuestState";
import { GUEST_ROUTINE_ID } from "./types";
import type { RoutineDTO } from "./types";

export function useRoutines(): {
	routines: RoutineDTO[];
	isLoading: boolean;
	source: "guest" | "convex";
} {
	const { isSignedIn, isLoaded } = useUser();
	const { isAuthenticated } = useConvexAuth();
	const convexRoutines = useQuery(api.routines.list, isAuthenticated ? {} : "skip");
	const guestState = useGuestState();

	if (!isLoaded) {
		return { routines: [], isLoading: true, source: "guest" };
	}

	if (isSignedIn) {
		return {
			routines: (convexRoutines ?? []).map((r) => ({
				id: r._id,
				name: r.name,
				description: r.description,
				createdAt: r._creationTime,
			})),
			isLoading: convexRoutines === undefined,
			source: "convex",
		};
	}

	return {
		routines: guestState.routine
			? [
					{
						id: GUEST_ROUTINE_ID,
						name: guestState.routine.name,
						description: guestState.routine.description,
						createdAt: guestState.routine.createdAt,
					},
				]
			: [],
		isLoading: false,
		source: "guest",
	};
}
