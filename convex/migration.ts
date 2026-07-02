import { v } from "convex/values";
import { mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getOrCreateUser } from "./users";
import { updatePersonalRecord } from "./setEntries";

const guestRoutineExerciseValidator = v.object({
	exerciseId: v.string(),
	exerciseName: v.string(),
	order: v.number(),
	targetSets: v.number(),
	targetRepsMin: v.optional(v.number()),
	targetRepsMax: v.optional(v.number()),
	targetWeight: v.optional(v.number()),
	targetRestSeconds: v.optional(v.number()),
	notes: v.optional(v.string()),
});

const guestSetEntryValidator = v.object({
	exerciseId: v.string(),
	exerciseNameSnapshot: v.string(),
	setIndex: v.number(),
	weight: v.number(),
	reps: v.number(),
	rpe: v.optional(v.number()),
	notes: v.optional(v.string()),
	completedAt: v.number(),
});

async function resolveExerciseId(
	ctx: MutationCtx,
	guestExerciseId: string,
	customExerciseIdMap: Map<string, Id<"exercises">>,
): Promise<Id<"exercises"> | null> {
	const mapped = customExerciseIdMap.get(guestExerciseId);
	if (mapped) return mapped;

	const normalized = ctx.db.normalizeId("exercises", guestExerciseId);
	if (!normalized) return null;
	const exercise = await ctx.db.get(normalized);
	return exercise ? normalized : null;
}

export const migrateGuestData = mutation({
	args: {
		guestBatchId: v.string(),
		routine: v.union(
			v.object({
				name: v.string(),
				description: v.optional(v.string()),
				exercises: v.array(guestRoutineExerciseValidator),
			}),
			v.null(),
		),
		customExercises: v.array(
			v.object({
				id: v.string(),
				name: v.string(),
				muscleGroups: v.array(v.string()),
				equipment: v.optional(v.string()),
			}),
		),
		sessions: v.array(
			v.object({
				routineNameSnapshot: v.string(),
				startedAt: v.number(),
				completedAt: v.optional(v.number()),
				durationSeconds: v.optional(v.number()),
				notes: v.optional(v.string()),
				sets: v.array(guestSetEntryValidator),
			}),
		),
	},
	handler: async (ctx, args) => {
		const user = await getOrCreateUser(ctx);

		if (user.migratedGuestDataAt) {
			return { status: "already_migrated" as const };
		}
		const existingBatch = await ctx.db
			.query("migrations")
			.withIndex("by_guestBatchId", (q) =>
				q.eq("guestBatchId", args.guestBatchId),
			)
			.unique();
		if (existingBatch) {
			await ctx.db.patch(user._id, { migratedGuestDataAt: Date.now() });
			return { status: "already_migrated" as const };
		}

		const customExerciseIdMap = new Map<string, Id<"exercises">>();
		for (const custom of args.customExercises) {
			const newId = await ctx.db.insert("exercises", {
				name: custom.name,
				normalizedName: custom.name.trim().toLowerCase(),
				muscleGroups: custom.muscleGroups,
				equipment: custom.equipment,
				isCustom: true,
				createdBy: user._id,
			});
			customExerciseIdMap.set(custom.id, newId);
		}

		let routinesMigrated = 0;
		let newRoutineId: Id<"routines"> | undefined;
		if (args.routine) {
			newRoutineId = await ctx.db.insert("routines", {
				userId: user._id,
				name: args.routine.name,
				description: args.routine.description,
				order: 0,
			});
			for (const re of args.routine.exercises) {
				const exerciseId = await resolveExerciseId(
					ctx,
					re.exerciseId,
					customExerciseIdMap,
				);
				if (!exerciseId) continue;
				await ctx.db.insert("routineExercises", {
					routineId: newRoutineId,
					exerciseId,
					order: re.order,
					targetSets: re.targetSets,
					targetRepsMin: re.targetRepsMin,
					targetRepsMax: re.targetRepsMax,
					targetWeight: re.targetWeight,
					targetRestSeconds: re.targetRestSeconds,
					notes: re.notes,
				});
			}
			routinesMigrated = 1;
		}

		let sessionsMigrated = 0;
		for (const session of args.sessions) {
			const sessionId = await ctx.db.insert("workoutSessions", {
				userId: user._id,
				routineId: newRoutineId,
				routineNameSnapshot: session.routineNameSnapshot,
				startedAt: session.startedAt,
				completedAt: session.completedAt,
				durationSeconds: session.durationSeconds,
				notes: session.notes,
			});

			for (const set of session.sets) {
				const exerciseId = await resolveExerciseId(
					ctx,
					set.exerciseId,
					customExerciseIdMap,
				);
				if (!exerciseId) continue;
				const setEntryId = await ctx.db.insert("setEntries", {
					sessionId,
					userId: user._id,
					exerciseId,
					exerciseNameSnapshot: set.exerciseNameSnapshot,
					setIndex: set.setIndex,
					weight: set.weight,
					reps: set.reps,
					rpe: set.rpe,
					notes: set.notes,
					completedAt: set.completedAt,
				});
				await updatePersonalRecord(ctx, {
					userId: user._id,
					exerciseId,
					weight: set.weight,
					reps: set.reps,
					setEntryId,
					completedAt: set.completedAt,
				});
			}
			sessionsMigrated++;
		}

		await ctx.db.insert("migrations", {
			userId: user._id,
			guestBatchId: args.guestBatchId,
			status: "completed",
			routinesMigrated,
			sessionsMigrated,
			createdAt: Date.now(),
		});
		await ctx.db.patch(user._id, { migratedGuestDataAt: Date.now() });

		return { status: "completed" as const, routinesMigrated, sessionsMigrated };
	},
});
