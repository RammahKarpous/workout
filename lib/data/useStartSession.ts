"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { guestStore } from "@/lib/guest/guestStore";
import { GUEST_ROUTINE_ID } from "./types";

export function useStartSession() {
	const convexStart = useMutation(api.workoutSessions.start);

	return async (routineId: string): Promise<string> => {
		if (routineId === GUEST_ROUTINE_ID) {
			return guestStore.actions.startSession();
		}
		return await convexStart({ routineId: routineId as Id<"routines"> });
	};
}
