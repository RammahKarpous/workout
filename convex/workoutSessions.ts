import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

export const start = mutation({
	args: { routineId: v.id("routines") },
	handler: async (ctx, { routineId }) => {
		const user = await requireUser(ctx);
		const routine = await ctx.db.get(routineId);
		if (!routine || routine.userId !== user._id) {
			throw new Error("Routine not found");
		}
		return await ctx.db.insert("workoutSessions", {
			userId: user._id,
			routineId,
			routineNameSnapshot: routine.name,
			startedAt: Date.now(),
		});
	},
});

export const get = query({
	args: { sessionId: v.id("workoutSessions") },
	handler: async (ctx, { sessionId }) => {
		const user = await requireUser(ctx);
		const session = await ctx.db.get(sessionId);
		if (!session || session.userId !== user._id) return null;

		const sets = await ctx.db
			.query("setEntries")
			.withIndex("by_session", (q) => q.eq("sessionId", sessionId))
			.collect();
		sets.sort((a, b) => a.completedAt - b.completedAt);

		return { ...session, sets };
	},
});

export const complete = mutation({
	args: { sessionId: v.id("workoutSessions"), notes: v.optional(v.string()) },
	handler: async (ctx, { sessionId, notes }) => {
		const user = await requireUser(ctx);
		const session = await ctx.db.get(sessionId);
		if (!session || session.userId !== user._id) {
			throw new Error("Session not found");
		}
		const completedAt = Date.now();
		await ctx.db.patch(sessionId, {
			completedAt,
			durationSeconds: Math.round((completedAt - session.startedAt) / 1000),
			notes,
		});
	},
});

export const listRecent = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit }) => {
		const user = await requireUser(ctx);
		const sessions = await ctx.db
			.query("workoutSessions")
			.withIndex("by_user_completedAt", (q) => q.eq("userId", user._id))
			.order("desc")
			.take(limit ?? 50);
		return sessions.filter((s) => s.completedAt !== undefined);
	},
});
