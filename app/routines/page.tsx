"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function RoutinesPage() {
	return (
		<div className="max-w-2xl mx-auto w-full p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-semibold">Your Routines</h1>
				<Link
					href="/routines/new"
					className="rounded bg-foreground text-background px-3 py-1.5 text-sm font-medium"
				>
					New Routine
				</Link>
			</div>
			<SignedIn>
				<RoutineList />
			</SignedIn>
			<SignedOut>
				<p className="text-sm opacity-70">
					Sign in to build and track workout routines.
				</p>
			</SignedOut>
		</div>
	);
}

function RoutineList() {
	const routines = useQuery(api.routines.list, {});

	if (routines === undefined) {
		return <p className="text-sm opacity-60">Loading…</p>;
	}
	if (routines.length === 0) {
		return <p className="text-sm opacity-70">No routines yet.</p>;
	}

	return (
		<ul className="flex flex-col gap-2">
			{routines.map((routine) => (
				<li key={routine._id}>
					<Link
						href={`/routines/${routine._id}`}
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
	);
}
