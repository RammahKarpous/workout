import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

export const list = query({
	args: {},
	handler: async (ctx) => {
		const user = await requireUser(ctx);
		const routines = await ctx.db
			.query("routines")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();
		return routines
			.filter((r) => !r.archivedAt)
			.sort((a, b) => a.order - b.order);
	},
});

export const get = query({
	args: { routineId: v.id("routines") },
	handler: async (ctx, { routineId }) => {
		const user = await requireUser(ctx);
		const routine = await ctx.db.get(routineId);
		if (!routine || routine.userId !== user._id) return null;

		const routineExercises = await ctx.db
			.query("routineExercises")
			.withIndex("by_routine_order", (q) => q.eq("routineId", routineId))
			.collect();
		routineExercises.sort((a, b) => a.order - b.order);

		const exercises = await Promise.all(
			routineExercises.map(async (re) => ({
				...re,
				exercise: await ctx.db.get(re.exerciseId),
			})),
		);

		return { ...routine, exercises };
	},
});

export const create = mutation({
	args: { name: v.string(), description: v.optional(v.string()) },
	handler: async (ctx, args) => {
		const user = await requireUser(ctx);
		const existing = await ctx.db
			.query("routines")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();
		return await ctx.db.insert("routines", {
			userId: user._id,
			name: args.name,
			description: args.description,
			order: existing.length,
		});
	},
});

export const update = mutation({
	args: {
		routineId: v.id("routines"),
		name: v.optional(v.string()),
		description: v.optional(v.string()),
	},
	handler: async (ctx, { routineId, ...patch }) => {
		const user = await requireUser(ctx);
		const routine = await ctx.db.get(routineId);
		if (!routine || routine.userId !== user._id) {
			throw new Error("Routine not found");
		}
		await ctx.db.patch(routineId, patch);
	},
});

export const remove = mutation({
	args: { routineId: v.id("routines") },
	handler: async (ctx, { routineId }) => {
		const user = await requireUser(ctx);
		const routine = await ctx.db.get(routineId);
		if (!routine || routine.userId !== user._id) {
			throw new Error("Routine not found");
		}
		const routineExercises = await ctx.db
			.query("routineExercises")
			.withIndex("by_routine", (q) => q.eq("routineId", routineId))
			.collect();
		await Promise.all(routineExercises.map((re) => ctx.db.delete(re._id)));
		await ctx.db.delete(routineId);
	},
});
