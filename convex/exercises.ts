import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

function normalize(name: string): string {
	return name.trim().toLowerCase();
}

export const list = query({
	args: {},
	handler: async (ctx) => {
		const global = await ctx.db
			.query("exercises")
			.withIndex("by_createdBy", (q) => q.eq("createdBy", undefined))
			.collect();

		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return global;

		const user = await ctx.db
			.query("users")
			.withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
			.unique();
		if (!user) return global;

		const custom = await ctx.db
			.query("exercises")
			.withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
			.collect();

		return [...global, ...custom];
	},
});

export const search = query({
	args: { term: v.string() },
	handler: async (ctx, { term }) => {
		if (!term.trim()) return [];
		return await ctx.db
			.query("exercises")
			.withSearchIndex("search_name", (q) => q.search("name", term))
			.take(20);
	},
});

export const createCustom = mutation({
	args: {
		name: v.string(),
		muscleGroups: v.array(v.string()),
		equipment: v.optional(v.string()),
		instructions: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await requireUser(ctx);
		return await ctx.db.insert("exercises", {
			name: args.name,
			normalizedName: normalize(args.name),
			muscleGroups: args.muscleGroups,
			equipment: args.equipment,
			instructions: args.instructions,
			isCustom: true,
			createdBy: user._id,
		});
	},
});
