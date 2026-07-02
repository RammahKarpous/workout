import {
	readGuestState,
	writeGuestState,
	clearGuestState as clearStorage,
	STORAGE_KEY,
} from "./storage";
import { GuestLimitError } from "./types";
import type {
	GuestState,
	GuestRoutineExercise,
	GuestSetEntry,
	GuestWorkoutSession,
} from "./types";

type Listener = () => void;

let state: GuestState | null = null;
const listeners = new Set<Listener>();

function getState(): GuestState {
	if (state === null) {
		state = readGuestState();
	}
	return state;
}

function setState(next: GuestState) {
	state = next;
	writeGuestState(next);
	listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot(): GuestState {
	return getState();
}

const SERVER_SNAPSHOT: GuestState = {
	schemaVersion: 1,
	guestBatchId: "",
	routine: null,
	customExercises: [],
	sessions: [],
};

function getServerSnapshot(): GuestState {
	return SERVER_SNAPSHOT;
}

if (typeof window !== "undefined") {
	window.addEventListener("storage", (e) => {
		if (e.key === STORAGE_KEY) {
			state = readGuestState();
			listeners.forEach((l) => l());
		}
	});
}

function createRoutine(input: { name: string; description?: string }): string {
	const current = getState();
	if (current.routine) {
		throw new GuestLimitError(
			"Guests can only create one routine. Sign up to create more.",
		);
	}
	const routine = {
		id: crypto.randomUUID(),
		name: input.name,
		description: input.description,
		exercises: [],
		createdAt: Date.now(),
	};
	setState({ ...current, routine });
	return routine.id;
}

function removeRoutine() {
	const current = getState();
	setState({ ...current, routine: null });
}

function addRoutineExercise(input: {
	exerciseId: string;
	exerciseName: string;
	targetSets: number;
	targetRepsMin?: number;
	targetRepsMax?: number;
	targetWeight?: number;
	targetRestSeconds?: number;
	notes?: string;
}): string {
	const current = getState();
	if (!current.routine) throw new Error("No guest routine exists");
	const routineExercise: GuestRoutineExercise = {
		id: crypto.randomUUID(),
		order: current.routine.exercises.length,
		...input,
	};
	setState({
		...current,
		routine: {
			...current.routine,
			exercises: [...current.routine.exercises, routineExercise],
		},
	});
	return routineExercise.id;
}

function removeRoutineExercise(routineExerciseId: string) {
	const current = getState();
	if (!current.routine) return;
	setState({
		...current,
		routine: {
			...current.routine,
			exercises: current.routine.exercises.filter(
				(re) => re.id !== routineExerciseId,
			),
		},
	});
}

function startSession(): string {
	const current = getState();
	if (!current.routine) throw new Error("No guest routine exists");
	const session: GuestWorkoutSession = {
		id: crypto.randomUUID(),
		routineNameSnapshot: current.routine.name,
		startedAt: Date.now(),
		sets: [],
	};
	setState({ ...current, sessions: [session, ...current.sessions] });
	return session.id;
}

function logSet(
	sessionId: string,
	input: {
		exerciseId: string;
		exerciseNameSnapshot: string;
		weight: number;
		reps: number;
		rpe?: number;
		notes?: string;
	},
): string {
	const current = getState();
	const session = current.sessions.find((s) => s.id === sessionId);
	if (!session) throw new Error("Session not found");
	const setEntry: GuestSetEntry = {
		id: crypto.randomUUID(),
		setIndex: session.sets.filter((s) => s.exerciseId === input.exerciseId)
			.length,
		completedAt: Date.now(),
		...input,
	};
	const updatedSession = { ...session, sets: [...session.sets, setEntry] };
	setState({
		...current,
		sessions: current.sessions.map((s) =>
			s.id === sessionId ? updatedSession : s,
		),
	});
	return setEntry.id;
}

function removeSet(sessionId: string, setEntryId: string) {
	const current = getState();
	const session = current.sessions.find((s) => s.id === sessionId);
	if (!session) return;
	const updatedSession = {
		...session,
		sets: session.sets.filter((s) => s.id !== setEntryId),
	};
	setState({
		...current,
		sessions: current.sessions.map((s) =>
			s.id === sessionId ? updatedSession : s,
		),
	});
}

function completeSession(sessionId: string, notes?: string) {
	const current = getState();
	const session = current.sessions.find((s) => s.id === sessionId);
	if (!session) return;
	const completedAt = Date.now();
	const updatedSession = {
		...session,
		completedAt,
		durationSeconds: Math.round((completedAt - session.startedAt) / 1000),
		notes,
	};
	setState({
		...current,
		sessions: current.sessions.map((s) =>
			s.id === sessionId ? updatedSession : s,
		),
	});
}

function addCustomExercise(input: {
	name: string;
	muscleGroups: string[];
	equipment?: string;
}): string {
	const current = getState();
	const id = `guest-custom:${crypto.randomUUID()}`;
	setState({
		...current,
		customExercises: [...current.customExercises, { id, ...input }],
	});
	return id;
}

function clearAll() {
	clearStorage();
	state = null;
	listeners.forEach((l) => l());
}

export const guestStore = {
	subscribe,
	getSnapshot,
	getServerSnapshot,
	actions: {
		createRoutine,
		removeRoutine,
		addRoutineExercise,
		removeRoutineExercise,
		startSession,
		logSet,
		removeSet,
		completeSession,
		addCustomExercise,
		clearAll,
	},
};
