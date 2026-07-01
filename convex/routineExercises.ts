import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireUser } from "./users";

async function requireOwnedRoutine(
	ctx: Parameters<typeof requireUser>[0],
	routineId: import("./_generated/dataModel").Id<"routines">,
) {
	const user = await requireUser(ctx);
	const routine = await ctx.db.get(routineId);
	if (!routine || routine.userId !== user._id) {
		throw new Error("Routine not found");
	}
	return routine;
}

export const add = mutation({
	args: {
		routineId: v.id("routines"),
		exerciseId: v.id("exercises"),
		targetSets: v.number(),
		targetRepsMin: v.optional(v.number()),
		targetRepsMax: v.optional(v.number()),
		targetWeight: v.optional(v.number()),
		targetRestSeconds: v.optional(v.number()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, { routineId, ...args }) => {
		await requireOwnedRoutine(ctx, routineId);
		const existing = await ctx.db
			.query("routineExercises")
			.withIndex("by_routine", (q) => q.eq("routineId", routineId))
			.collect();
		return await ctx.db.insert("routineExercises", {
			routineId,
			order: existing.length,
			...args,
		});
	},
});

export const update = mutation({
	args: {
		routineExerciseId: v.id("routineExercises"),
		targetSets: v.optional(v.number()),
		targetRepsMin: v.optional(v.number()),
		targetRepsMax: v.optional(v.number()),
		targetWeight: v.optional(v.number()),
		targetRestSeconds: v.optional(v.number()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, { routineExerciseId, ...patch }) => {
		const routineExercise = await ctx.db.get(routineExerciseId);
		if (!routineExercise) throw new Error("Not found");
		await requireOwnedRoutine(ctx, routineExercise.routineId);
		await ctx.db.patch(routineExerciseId, patch);
	},
});

export const remove = mutation({
	args: { routineExerciseId: v.id("routineExercises") },
	handler: async (ctx, { routineExerciseId }) => {
		const routineExercise = await ctx.db.get(routineExerciseId);
		if (!routineExercise) throw new Error("Not found");
		await requireOwnedRoutine(ctx, routineExercise.routineId);
		await ctx.db.delete(routineExerciseId);
	},
});

export const reorder = mutation({
	args: {
		routineId: v.id("routines"),
		orderedIds: v.array(v.id("routineExercises")),
	},
	handler: async (ctx, { routineId, orderedIds }) => {
		await requireOwnedRoutine(ctx, routineId);
		await Promise.all(
			orderedIds.map((id, index) => ctx.db.patch(id, { order: index })),
		);
	},
});
