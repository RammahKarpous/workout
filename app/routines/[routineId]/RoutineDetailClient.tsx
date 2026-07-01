"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { ExercisePicker } from "@/components/ExercisePicker";

export function RoutineDetailClient({ routineId }: { routineId: string }) {
	const id = routineId as Id<"routines">;
	const routine = useQuery(api.routines.get, { routineId: id });
	const removeRoutine = useMutation(api.routines.remove);
	const router = useRouter();
	const [addingExercise, setAddingExercise] = useState(false);

	if (routine === undefined) {
		return <div className="max-w-2xl mx-auto w-full p-6 text-sm opacity-60">Loading…</div>;
	}
	if (routine === null) {
		return <div className="max-w-2xl mx-auto w-full p-6 text-sm opacity-60">Routine not found.</div>;
	}

	async function handleDelete() {
		if (!confirm(`Delete "${routine!.name}"? This cannot be undone.`)) return;
		await removeRoutine({ routineId: id });
		router.push("/routines");
	}

	return (
		<div className="max-w-2xl mx-auto w-full p-6">
			<div className="flex items-start justify-between mb-6">
				<div>
					<h1 className="text-xl font-semibold">{routine.name}</h1>
					{routine.description && (
						<p className="text-sm opacity-60">{routine.description}</p>
					)}
				</div>
				<button
					onClick={handleDelete}
					className="text-sm text-red-600 dark:text-red-400 hover:underline"
				>
					Delete
				</button>
			</div>

			<ul className="flex flex-col gap-2 mb-6">
				{routine.exercises.map((re) => (
					<RoutineExerciseRow key={re._id} routineExercise={re} />
				))}
				{routine.exercises.length === 0 && (
					<li className="text-sm opacity-60">No exercises added yet.</li>
				)}
			</ul>

			{addingExercise ? (
				<AddExerciseFlow
					routineId={id}
					onDone={() => setAddingExercise(false)}
				/>
			) : (
				<button
					onClick={() => setAddingExercise(true)}
					className="rounded border border-black/10 dark:border-white/15 px-3 py-1.5 text-sm"
				>
					+ Add Exercise
				</button>
			)}
		</div>
	);
}

function RoutineExerciseRow({
	routineExercise,
}: {
	routineExercise: Doc<"routineExercises"> & { exercise: Doc<"exercises"> | null };
}) {
	const removeExercise = useMutation(api.routineExercises.remove);
	const re = routineExercise;

	const repsLabel =
		re.targetRepsMin && re.targetRepsMax
			? re.targetRepsMin === re.targetRepsMax
				? `${re.targetRepsMin}`
				: `${re.targetRepsMin}-${re.targetRepsMax}`
			: re.targetRepsMin ?? re.targetRepsMax ?? "—";

	return (
		<li className="flex items-center justify-between rounded-lg border border-black/10 dark:border-white/15 px-4 py-3">
			<div>
				<div className="font-medium">{re.exercise?.name ?? "Unknown exercise"}</div>
				<div className="text-sm opacity-60">
					{re.targetSets} sets × {repsLabel} reps
					{re.targetWeight !== undefined ? ` @ ${re.targetWeight}` : ""}
				</div>
			</div>
			<button
				onClick={() => removeExercise({ routineExerciseId: re._id })}
				className="text-sm opacity-60 hover:opacity-100"
			>
				Remove
			</button>
		</li>
	);
}

function AddExerciseFlow({
	routineId,
	onDone,
}: {
	routineId: Id<"routines">;
	onDone: () => void;
}) {
	const [selected, setSelected] = useState<Doc<"exercises"> | null>(null);
	const addExercise = useMutation(api.routineExercises.add);
	const [targetSets, setTargetSets] = useState(3);
	const [repsMin, setRepsMin] = useState(8);
	const [repsMax, setRepsMax] = useState(12);
	const [weight, setWeight] = useState<string>("");

	if (!selected) {
		return (
			<div className="flex flex-col gap-2">
				<ExercisePicker onSelect={setSelected} />
				<button onClick={onDone} className="self-start text-sm opacity-60 hover:opacity-100">
					Cancel
				</button>
			</div>
		);
	}

	async function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		await addExercise({
			routineId,
			exerciseId: selected!._id,
			targetSets,
			targetRepsMin: repsMin,
			targetRepsMax: repsMax,
			targetWeight: weight.trim() ? Number(weight) : undefined,
		});
		onDone();
	}

	return (
		<form
			onSubmit={handleAdd}
			className="flex flex-col gap-3 rounded-lg border border-black/10 dark:border-white/15 p-4"
		>
			<div className="font-medium">{selected.name}</div>
			<div className="flex gap-3">
				<label className="flex flex-col gap-1 text-sm">
					Sets
					<input
						type="number"
						min={1}
						value={targetSets}
						onChange={(e) => setTargetSets(Number(e.target.value))}
						className="w-20 rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1"
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					Reps min
					<input
						type="number"
						min={0}
						value={repsMin}
						onChange={(e) => setRepsMin(Number(e.target.value))}
						className="w-20 rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1"
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					Reps max
					<input
						type="number"
						min={0}
						value={repsMax}
						onChange={(e) => setRepsMax(Number(e.target.value))}
						className="w-20 rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1"
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					Weight
					<input
						type="number"
						value={weight}
						onChange={(e) => setWeight(e.target.value)}
						placeholder="optional"
						className="w-24 rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1"
					/>
				</label>
			</div>
			<div className="flex gap-2">
				<button
					type="submit"
					className="rounded bg-foreground text-background px-3 py-1.5 text-sm font-medium"
				>
					Add to Routine
				</button>
				<button
					type="button"
					onClick={() => setSelected(null)}
					className="text-sm opacity-60 hover:opacity-100"
				>
					Back
				</button>
			</div>
		</form>
	);
}
