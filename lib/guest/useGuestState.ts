"use client";

import { useSyncExternalStore } from "react";
import { guestStore } from "./guestStore";

export function useGuestState() {
	return useSyncExternalStore(
		guestStore.subscribe,
		guestStore.getSnapshot,
		guestStore.getServerSnapshot,
	);
}
