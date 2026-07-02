"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Show } from "@clerk/nextjs";
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";
import { api } from "@/convex/_generated/api";

export default function ProgressPage() {
	return (
		<div className="max-w-2xl mx-auto w-full p-6">
			<h1 className="text-xl font-semibold mb-6">Progress</h1>
			<Show when="signed-in">
				<Dashboard />
			</Show>
			<Show when="signed-out">
				<p className="text-sm opacity-70">
					<Link href="/sign-up" className="underline">
						Sign up
					</Link>{" "}
					to track your progress, personal records, and workout history.
				</p>
			</Show>
		</div>
	);
}

function Dashboard() {
	const volume = useQuery(api.progress.volumeOverTime, {});
	const streak = useQuery(api.progress.streak, {});
	const records = useQuery(api.personalRecords.list, {});
	const history = useQuery(api.workoutSessions.listRecent, { limit: 10 });

	const chartData = (volume ?? []).map((v) => ({
		week: v.week.slice(5),
		volume: Math.round(v.volume),
	}));

	return (
		<div className="flex flex-col gap-8">
			<section>
				<div className="flex items-baseline gap-2 mb-2">
					<h2 className="font-medium">Streak</h2>
					<span className="text-2xl font-semibold">{streak ?? "—"}</span>
					<span className="text-sm opacity-60">day(s)</span>
				</div>
			</section>

			<section>
				<h2 className="font-medium mb-2">Weekly Volume</h2>
				{volume === undefined ? (
					<p className="text-sm opacity-60">Loading…</p>
				) : chartData.length === 0 ? (
					<p className="text-sm opacity-60">No completed workouts yet.</p>
				) : (
					<div className="h-56">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
								<XAxis dataKey="week" fontSize={12} />
								<YAxis fontSize={12} />
								<Tooltip />
								<Bar dataKey="volume" fill="currentColor" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</section>

			<section>
				<h2 className="font-medium mb-2">Personal Records</h2>
				{records === undefined ? (
					<p className="text-sm opacity-60">Loading…</p>
				) : records.length === 0 ? (
					<p className="text-sm opacity-60">No records yet.</p>
				) : (
					<ul className="flex flex-col gap-1">
						{records.map((r) => (
							<li
								key={r._id}
								className="flex items-center justify-between text-sm rounded border border-black/10 dark:border-white/15 px-3 py-2"
							>
								<span>{r.exercise?.name}</span>
								<span className="opacity-70">
									{r.maxWeight} × {r.maxWeightReps} (est. 1RM{" "}
									{Math.round(r.estimated1RM)})
								</span>
							</li>
						))}
					</ul>
				)}
			</section>

			<section>
				<h2 className="font-medium mb-2">Recent Workouts</h2>
				{history === undefined ? (
					<p className="text-sm opacity-60">Loading…</p>
				) : history.length === 0 ? (
					<p className="text-sm opacity-60">No workouts logged yet.</p>
				) : (
					<ul className="flex flex-col gap-1">
						{history.map((s) => (
							<li
								key={s._id}
								className="flex items-center justify-between text-sm rounded border border-black/10 dark:border-white/15 px-3 py-2"
							>
								<span>{s.routineNameSnapshot}</span>
								<span className="opacity-70">
									{s.completedAt
										? new Date(s.completedAt).toLocaleDateString()
										: "—"}
								</span>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
