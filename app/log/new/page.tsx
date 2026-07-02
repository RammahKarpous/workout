"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRoutines } from "@/lib/data/useRoutines";
import { useStartSession } from "@/lib/data/useStartSession";

export default function NewSessionPage() {
	return (
		<Suspense
			fallback={
				<div className="max-w-md mx-auto w-full p-6 text-sm opacity-60">
					Loading…
				</div>
			}
		>
			<NewSessionContent />
		</Suspense>
	);
}

function NewSessionContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { routines, isLoading } = useRoutines();
	const startSession = useStartSession();
	const [starting, setStarting] = useState(false);
	const preselectedRoutineId = searchParams.get("routineId");
	const hasStarted = useRef(false);

	async function handleStart(routineId: string) {
		if (hasStarted.current) return;
		hasStarted.current = true;
		setStarting(true);
		const sessionId = await startSession(routineId);
		router.push(`/log/${sessionId}`);
	}

	useEffect(() => {
		if (preselectedRoutineId) {
			handleStart(preselectedRoutineId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedRoutineId]);

	if (preselectedRoutineId || starting) {
		return (
			<div className="max-w-md mx-auto w-full p-6 text-sm opacity-60">
				Starting workout…
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto w-full p-6">
			<h1 className="text-xl font-semibold mb-4">Start a Workout</h1>
			{isLoading && <p className="text-sm opacity-60">Loading…</p>}
			{!isLoading && routines.length === 0 && (
				<p className="text-sm opacity-70">
					You need a routine first.{" "}
					<Link href="/routines/new" className="underline">
						Create one
					</Link>
					.
				</p>
			)}
			<ul className="flex flex-col gap-2">
				{routines.map((routine) => (
					<li key={routine.id}>
						<button
							onClick={() => handleStart(routine.id)}
							disabled={starting}
							className="w-full text-left rounded-lg border border-black/10 dark:border-white/15 px-4 py-3 hover:bg-black/[.03] dark:hover:bg-white/[.05] disabled:opacity-50"
						>
							{routine.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
