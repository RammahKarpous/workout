"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { guestStore } from "@/lib/guest/guestStore";
import { GUEST_ROUTINE_ID } from "./types";

export function useRemoveRoutine() {
	const convexRemove = useMutation(api.routines.remove);

	return async (routineId: string) => {
		if (routineId === GUEST_ROUTINE_ID) {
			guestStore.actions.removeRoutine();
			return;
		}
		await convexRemove({ routineId: routineId as Id<"routines"> });
	};
}
