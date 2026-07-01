import { mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

export async function requireUser(
	ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users">> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) throw new Error("Unauthenticated");
	const user = await ctx.db
		.query("users")
		.withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
		.unique();
	if (!user) throw new Error("User record not found; call users.ensure first");
	return user;
}

export const ensure = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthenticated");

		const existing = await ctx.db
			.query("users")
			.withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
			.unique();
		if (existing) return existing._id;

		return await ctx.db.insert("users", {
			clerkUserId: identity.subject,
			email: identity.email,
		});
	},
});
