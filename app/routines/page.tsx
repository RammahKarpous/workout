"use client";

import Link from "next/link";
import { useRoutines } from "@/lib/data/useRoutines";

export default function RoutinesPage() {
	const { routines, isLoading, source } = useRoutines();

	return (
		<div className="max-w-2xl mx-auto w-full p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-semibold">Your Routines</h1>
				{(source === "convex" || routines.length === 0) && (
					<Link
						href="/routines/new"
						className="rounded bg-foreground text-background px-3 py-1.5 text-sm font-medium"
					>
						New Routine
					</Link>
				)}
			</div>

			{isLoading && <p className="text-sm opacity-60">Loading…</p>}

			{!isLoading && routines.length === 0 && (
				<p className="text-sm opacity-70">No routines yet.</p>
			)}

			<ul className="flex flex-col gap-2">
				{routines.map((routine) => (
					<li key={routine.id}>
						<Link
							href={`/routines/${routine.id}`}
							className="block rounded-lg border border-black/10 dark:border-white/15 px-4 py-3 hover:bg-black/[.03] dark:hover:bg-white/[.05]"
						>
							<div className="font-medium">{routine.name}</div>
							{routine.description && (
								<div className="text-sm opacity-60">{routine.description}</div>
							)}
						</Link>
					</li>
				))}
			</ul>

			{source === "guest" && routines.length >= 1 && (
				<p className="mt-4 text-sm opacity-70">
					Guests can save one routine.{" "}
					<Link href="/sign-up" className="underline">
						Sign up
					</Link>{" "}
					to create more and track your progress.
				</p>
			)}
		</div>
	);
}
