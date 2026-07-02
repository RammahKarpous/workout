import { query } from "./_generated/server";
import { requireUser } from "./users";

export const list = query({
	args: {},
	handler: async (ctx) => {
		const user = await requireUser(ctx);
		const records = await ctx.db
			.query("personalRecords")
			.withIndex("by_user_exercise", (q) => q.eq("userId", user._id))
			.collect();
		const withExercise = await Promise.all(
			records.map(async (r) => ({
				...r,
				exercise: await ctx.db.get(r.exerciseId),
			})),
		);
		return withExercise
			.filter((r) => r.exercise !== null)
			.sort((a, b) => b.estimated1RM - a.estimated1RM);
	},
});
