"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateRoutine } from "@/lib/data/useCreateRoutine";
import { GuestLimitError } from "@/lib/guest/types";

export default function NewRoutinePage() {
	const router = useRouter();
	const createRoutine = useCreateRoutine();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [limitError, setLimitError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim() || submitting) return;
		setSubmitting(true);
		setLimitError(null);
		try {
			const routineId = await createRoutine({
				name: name.trim(),
				description: description.trim() || undefined,
			});
			router.push(`/routines/${routineId}`);
		} catch (err) {
			if (err instanceof GuestLimitError) {
				setLimitError(err.message);
			} else {
				throw err;
			}
		} finally {
			setSubmitting(false);
		}
	}

	if (limitError) {
		return (
			<div className="max-w-md mx-auto w-full p-6">
				<h1 className="text-xl font-semibold mb-4">New Routine</h1>
				<p className="text-sm opacity-70 mb-4">{limitError}</p>
				<Link
					href="/sign-up"
					className="inline-block rounded bg-foreground text-background px-3 py-1.5 text-sm font-medium"
				>
					Sign up
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto w-full p-6">
			<h1 className="text-xl font-semibold mb-4">New Routine</h1>
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
		</div>
	);
}
