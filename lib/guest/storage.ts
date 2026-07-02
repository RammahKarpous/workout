import type { GuestState } from "./types";

const STORAGE_KEY = "workout:guestState:v1";

function emptyState(): GuestState {
	return {
		schemaVersion: 1,
		guestBatchId: crypto.randomUUID(),
		routine: null,
		customExercises: [],
		sessions: [],
	};
}

export function readGuestState(): GuestState {
	if (typeof window === "undefined") return emptyState();
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptyState();
		const parsed = JSON.parse(raw) as GuestState;
		if (parsed.schemaVersion !== 1) return emptyState();
		return parsed;
	} catch {
		return emptyState();
	}
}

export function writeGuestState(state: GuestState) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearGuestState() {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(STORAGE_KEY);
}

export function hasGuestData(state: GuestState): boolean {
	return state.routine !== null || state.sessions.length > 0;
}

export { STORAGE_KEY };
