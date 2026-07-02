"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { guestStore } from "@/lib/guest/guestStore";

export function useCompleteSession() {
	const convexComplete = useMutation(api.workoutSessions.complete);

	return async (
		sessionId: string,
		source: "guest" | "convex",
		notes?: string,
	) => {
		if (source === "guest") {
			guestStore.actions.completeSession(sessionId, notes);
			return;
		}
		await convexComplete({
			sessionId: sessionId as Id<"workoutSessions">,
			notes,
		});
	};
}
