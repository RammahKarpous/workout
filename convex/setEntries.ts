import { v } from "convex/values";
import { mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireUser } from "./users";

function estimate1RM(weight: number, reps: number): number {
	return weight * (1 + reps / 30);
}

export async function updatePersonalRecord(
	ctx: MutationCtx,
	args: {
		userId: Id<"users">;
		exerciseId: Id<"exercises">;
		weight: number;
		reps: number;
		setEntryId: Id<"setEntries">;
		completedAt: number;
	},
) {
	const estimated1RM = estimate1RM(args.weight, args.reps);
	const existingPR = await ctx.db
		.query("personalRecords")
		.withIndex("by_user_exercise", (q) =>
			q.eq("userId", args.userId).eq("exerciseId", args.exerciseId),
		)
		.unique();

	if (!existingPR) {
		await ctx.db.insert("personalRecords", {
			userId: args.userId,
			exerciseId: args.exerciseId,
			maxWeight: args.weight,
			maxWeightReps: args.reps,
			maxWeightSetEntryId: args.setEntryId,
			maxWeightAt: args.completedAt,
			estimated1RM,
			estimated1RMSetEntryId: args.setEntryId,
			estimated1RMAt: args.completedAt,
		});
		return;
	}

	const patch: Record<string, unknown> = {};
	if (args.weight > existingPR.maxWeight) {
		patch.maxWeight = args.weight;
		patch.maxWeightReps = args.reps;
		patch.maxWeightSetEntryId = args.setEntryId;
		patch.maxWeightAt = args.completedAt;
	}
	if (estimated1RM > existingPR.estimated1RM) {
		patch.estimated1RM = estimated1RM;
		patch.estimated1RMSetEntryId = args.setEntryId;
		patch.estimated1RMAt = args.completedAt;
	}
	if (Object.keys(patch).length > 0) {
		await ctx.db.patch(existingPR._id, patch);
	}
}

export const log = mutation({
	args: {
		sessionId: v.id("workoutSessions"),
		exerciseId: v.id("exercises"),
		weight: v.number(),
		reps: v.number(),
		rpe: v.optional(v.number()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await requireUser(ctx);
		const session = await ctx.db.get(args.sessionId);
		if (!session || session.userId !== user._id) {
			throw new Error("Session not found");
		}
		const exercise = await ctx.db.get(args.exerciseId);
		if (!exercise) throw new Error("Exercise not found");

		const existingSets = await ctx.db
			.query("setEntries")
			.withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
			.collect();
		const setIndex = existingSets.filter(
			(s) => s.exerciseId === args.exerciseId,
		).length;

		const completedAt = Date.now();
		const setEntryId = await ctx.db.insert("setEntries", {
			sessionId: args.sessionId,
			userId: user._id,
			exerciseId: args.exerciseId,
			exerciseNameSnapshot: exercise.name,
			setIndex,
			weight: args.weight,
			reps: args.reps,
			rpe: args.rpe,
			notes: args.notes,
			completedAt,
		});

		await updatePersonalRecord(ctx, {
			userId: user._id,
			exerciseId: args.exerciseId,
			weight: args.weight,
			reps: args.reps,
			setEntryId,
			completedAt,
		});

		return setEntryId;
	},
});

export const remove = mutation({
	args: { setEntryId: v.id("setEntries") },
	handler: async (ctx, { setEntryId }) => {
		const user = await requireUser(ctx);
		const setEntry = await ctx.db.get(setEntryId);
		if (!setEntry || setEntry.userId !== user._id) {
			throw new Error("Set not found");
		}
		await ctx.db.delete(setEntryId);
	},
});
