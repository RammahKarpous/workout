"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { guestStore } from "@/lib/guest/guestStore";

export function useRemoveSet() {
	const convexRemove = useMutation(api.setEntries.remove);

	return async (
		sessionId: string,
		source: "guest" | "convex",
		setEntryId: string,
	) => {
		if (source === "guest") {
			guestStore.actions.removeSet(sessionId, setEntryId);
			return;
		}
		await convexRemove({ setEntryId: setEntryId as Id<"setEntries"> });
	};
}
