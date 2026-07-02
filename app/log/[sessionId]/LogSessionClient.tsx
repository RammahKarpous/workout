"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/data/useSession";
import { useRoutine } from "@/lib/data/useRoutine";
import { useLogSet } from "@/lib/data/useLogSet";
import { useRemoveSet } from "@/lib/data/useRemoveSet";
import { useCompleteSession } from "@/lib/data/useCompleteSession";
import type { RoutineExerciseDTO, SetEntryDTO } from "@/lib/data/types";

export function LogSessionClient({ sessionId }: { sessionId: string }) {
	const { session, isLoading } = useSession(sessionId);
	const { routine } = useRoutine(session?.routineId ?? "");
	const completeSession = useCompleteSession();
	const router = useRouter();
	const [completing, setCompleting] = useState(false);

	if (isLoading || session === undefined) {
		return <div className="max-w-2xl mx-auto w-full p-6 text-sm opacity-60">Loading…</div>;
	}
	if (session === null) {
		return <div className="max-w-2xl mx-auto w-full p-6 text-sm opacity-60">Session not found.</div>;
	}

	const source = session.routineId === "guest" ? "guest" : "convex";

	async function handleComplete() {
		setCompleting(true);
		await completeSession(sessionId, source, undefined);
		router.push("/routines");
	}

	return (
		<div className="max-w-2xl mx-auto w-full p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-semibold">{session!.routineName}</h1>
				{!session!.completedAt && (
					<button
						onClick={handleComplete}
						disabled={completing}
						className="rounded bg-foreground text-background px-3 py-1.5 text-sm font-medium disabled:opacity-50"
					>
						Complete Workout
					</button>
				)}
			</div>

			{session!.completedAt && (
				<p className="text-sm opacity-60 mb-4">
					Completed in{" "}
					{session!.durationSeconds ? Math.round(session!.durationSeconds / 60) : 0}{" "}
					min.
				</p>
			)}

			<div className="flex flex-col gap-4">
				{routine?.exercises.map((re) => (
					<ExerciseLogCard
						key={re.id}
						sessionId={sessionId}
						source={source}
						routineExercise={re}
						loggedSets={session!.sets.filter((s) => s.exerciseId === re.exerciseId)}
						locked={!!session!.completedAt}
					/>
				))}
				{routine && routine.exercises.length === 0 && (
					<p className="text-sm opacity-60">This routine has no exercises yet.</p>
				)}
			</div>
		</div>
	);
}

function ExerciseLogCard({
	sessionId,
	source,
	routineExercise,
	loggedSets,
	locked,
}: {
	sessionId: string;
	source: "guest" | "convex";
	routineExercise: RoutineExerciseDTO;
	loggedSets: SetEntryDTO[];
	locked: boolean;
}) {
	const logSet = useLogSet();
	const removeSet = useRemoveSet();
	const re = routineExercise;
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");

	async function handleLog(e: React.FormEvent) {
		e.preventDefault();
		if (!weight.trim() || !reps.trim()) return;
		await logSet(sessionId, source, {
			exerciseId: re.exerciseId,
			exerciseName: re.exerciseName,
			weight: Number(weight),
			reps: Number(reps),
		});
		setWeight("");
		setReps("");
	}

	return (
		<div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
			<div className="flex items-baseline justify-between mb-2">
				<div className="font-medium">{re.exerciseName}</div>
				<div className="text-sm opacity-60">
					{loggedSets.length} / {re.targetSets} sets
				</div>
			</div>

			<ul className="flex flex-col gap-1 mb-3">
				{loggedSets.map((s, i) => (
					<li
						key={s.id}
						className="flex items-center justify-between text-sm opacity-80"
					>
						<span>
							Set {i + 1}: {s.weight} × {s.reps}
						</span>
						{!locked && (
							<button
								onClick={() => removeSet(sessionId, source, s.id)}
								className="opacity-60 hover:opacity-100"
							>
								Remove
							</button>
						)}
					</li>
				))}
			</ul>

			{!locked && (
				<form onSubmit={handleLog} className="flex gap-2 items-end">
					<label className="flex flex-col gap-1 text-xs">
						Weight
						<input
							type="number"
							value={weight}
							onChange={(e) => setWeight(e.target.value)}
							className="w-20 rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1"
						/>
					</label>
					<label className="flex flex-col gap-1 text-xs">
						Reps
						<input
							type="number"
							value={reps}
							onChange={(e) => setReps(e.target.value)}
							className="w-20 rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1"
						/>
					</label>
					<button
						type="submit"
						className="rounded border border-black/10 dark:border-white/15 px-3 py-1 text-sm"
					>
						Log Set
					</button>
				</form>
			)}
		</div>
	);
}
