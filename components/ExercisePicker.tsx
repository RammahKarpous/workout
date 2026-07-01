"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

export function ExercisePicker({
	onSelect,
}: {
	onSelect: (exercise: Doc<"exercises">) => void;
}) {
	const [term, setTerm] = useState("");
	const allExercises = useQuery(api.exercises.list, {});
	const searchResults = useQuery(
		api.exercises.search,
		term.trim() ? { term } : "skip",
	);

	const results = term.trim() ? searchResults : allExercises;

	return (
		<div className="border border-black/10 dark:border-white/15 rounded-lg p-3">
			<input
				type="text"
				value={term}
				onChange={(e) => setTerm(e.target.value)}
				placeholder="Search exercises…"
				className="w-full rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1 text-sm"
			/>
			<ul className="mt-2 max-h-60 overflow-y-auto divide-y divide-black/5 dark:divide-white/10">
				{results === undefined && (
					<li className="py-2 text-sm opacity-60">Loading…</li>
				)}
				{results?.length === 0 && (
					<li className="py-2 text-sm opacity-60">No exercises found</li>
				)}
				{results?.map((exercise) => (
					<li key={exercise._id}>
						<button
							type="button"
							onClick={() => onSelect(exercise)}
							className="w-full text-left py-2 text-sm hover:opacity-70"
						>
							<span className="font-medium">{exercise.name}</span>
							<span className="ml-2 text-xs opacity-60">
								{exercise.muscleGroups.join(", ")}
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
