import { query } from "./_generated/server";
import { requireUser } from "./users";

function weekStartKey(ts: number): string {
	const d = new Date(ts);
	const diffToMonday = (d.getUTCDay() + 6) % 7;
	d.setUTCDate(d.getUTCDate() - diffToMonday);
	d.setUTCHours(0, 0, 0, 0);
	return d.toISOString().slice(0, 10);
}

function dateKey(ts: number): string {
	return new Date(ts).toISOString().slice(0, 10);
}

export const volumeOverTime = query({
	args: {},
	handler: async (ctx) => {
		const user = await requireUser(ctx);
		const twelveWeeksAgo = Date.now() - 12 * 7 * 24 * 60 * 60 * 1000;
		const sessions = await ctx.db
			.query("workoutSessions")
			.withIndex("by_user_completedAt", (q) =>
				q.eq("userId", user._id).gte("completedAt", twelveWeeksAgo),
			)
			.collect();

		const weekVolumes = new Map<string, number>();
		for (const session of sessions) {
			if (!session.completedAt) continue;
			const sets = await ctx.db
				.query("setEntries")
				.withIndex("by_session", (q) => q.eq("sessionId", session._id))
				.collect();
			const volume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
			const week = weekStartKey(session.completedAt);
			weekVolumes.set(week, (weekVolumes.get(week) ?? 0) + volume);
		}

		return Array.from(weekVolumes.entries())
			.map(([week, volume]) => ({ week, volume }))
			.sort((a, b) => a.week.localeCompare(b.week));
	},
});

export const streak = query({
	args: {},
	handler: async (ctx) => {
		const user = await requireUser(ctx);
		const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
		const sessions = await ctx.db
			.query("workoutSessions")
			.withIndex("by_user_completedAt", (q) =>
				q.eq("userId", user._id).gte("completedAt", ninetyDaysAgo),
			)
			.collect();

		const days = new Set(
			sessions
				.filter((s) => s.completedAt !== undefined)
				.map((s) => dateKey(s.completedAt!)),
		);

		const cursor = new Date();
		cursor.setUTCHours(0, 0, 0, 0);
		if (!days.has(dateKey(cursor.getTime()))) {
			cursor.setUTCDate(cursor.getUTCDate() - 1);
		}

		let streakCount = 0;
		while (days.has(dateKey(cursor.getTime()))) {
			streakCount++;
			cursor.setUTCDate(cursor.getUTCDate() - 1);
		}
		return streakCount;
	},
});
