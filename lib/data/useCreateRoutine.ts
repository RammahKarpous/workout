"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { guestStore } from "@/lib/guest/guestStore";
import { GUEST_ROUTINE_ID } from "./types";

export function useCreateRoutine() {
	const { isAuthenticated } = useConvexAuth();
	const convexCreate = useMutation(api.routines.create);

	return async (input: {
		name: string;
		description?: string;
	}): Promise<string> => {
		if (isAuthenticated) {
			return await convexCreate(input);
		}
		guestStore.actions.createRoutine(input);
		return GUEST_ROUTINE_ID;
	};
}
