"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function NewRoutinePage() {
	return (
		<div className="max-w-md mx-auto w-full p-6">
			<h1 className="text-xl font-semibold mb-4">New Routine</h1>
			<SignedIn>
				<NewRoutineForm />
			</SignedIn>
			<SignedOut>
				<p className="text-sm opacity-70">Sign in to create a routine.</p>
			</SignedOut>
		</div>
	);
}

function NewRoutineForm() {
	const router = useRouter();
	const createRoutine = useMutation(api.routines.create);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim() || submitting) return;
		setSubmitting(true);
		const routineId = await createRoutine({
			name: name.trim(),
			description: description.trim() || undefined,
		});
		router.push(`/routines/${routineId}`);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<label className="flex flex-col gap-1 text-sm">
				Name
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className="rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1.5"
				/>
			</label>
			<label className="flex flex-col gap-1 text-sm">
				Description (optional)
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={2}
					className="rounded border border-black/10 dark:border-white/15 bg-transparent px-2 py-1.5"
				/>
			</label>
			<button
				type="submit"
				disabled={submitting}
				className="rounded bg-foreground text-background px-3 py-1.5 text-sm font-medium disabled:opacity-50"
			>
				Create Routine
			</button>
		</form>
	);
}
