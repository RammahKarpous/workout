import { mutation } from "./_generated/server";
import { SEED_EXERCISES } from "../lib/exercises/seedData";

function normalize(name: string): string {
	return name.trim().toLowerCase();
}

export const seedExercises = mutation({
	args: {},
	handler: async (ctx) => {
		let inserted = 0;
		for (const exercise of SEED_EXERCISES) {
			const normalizedName = normalize(exercise.name);
			const existing = await ctx.db
				.query("exercises")
				.withIndex("by_normalizedName", (q) =>
					q.eq("normalizedName", normalizedName),
				)
				.unique();
			if (existing) continue;

			await ctx.db.insert("exercises", {
				name: exercise.name,
				normalizedName,
				muscleGroups: exercise.muscleGroups,
				equipment: exercise.equipment,
				instructions: exercise.instructions,
				isCustom: false,
			});
			inserted++;
		}
		return { inserted, total: SEED_EXERCISES.length };
	},
});
