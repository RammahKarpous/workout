import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    migratedGuestDataAt: v.optional(v.number()),
  }).index("by_clerkUserId", ["clerkUserId"]),

  exercises: defineTable({
    name: v.string(),
    normalizedName: v.string(),
    muscleGroups: v.array(v.string()),
    equipment: v.optional(v.string()),
    instructions: v.optional(v.string()),
    isCustom: v.boolean(),
    createdBy: v.optional(v.id("users")),
  })
    .index("by_normalizedName", ["normalizedName"])
    .index("by_createdBy", ["createdBy"])
    .searchIndex("search_name", { searchField: "name" }),

  routines: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    archivedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  routineExercises: defineTable({
    routineId: v.id("routines"),
    exerciseId: v.id("exercises"),
    order: v.number(),
    targetSets: v.number(),
    targetRepsMin: v.optional(v.number()),
    targetRepsMax: v.optional(v.number()),
    targetWeight: v.optional(v.number()),
    targetRestSeconds: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_routine", ["routineId"])
    .index("by_routine_order", ["routineId", "order"]),

  workoutSessions: defineTable({
    userId: v.id("users"),
    routineId: v.optional(v.id("routines")),
    routineNameSnapshot: v.string(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    durationSeconds: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_completedAt", ["userId", "completedAt"])
    .index("by_routine", ["routineId"]),

  setEntries: defineTable({
    sessionId: v.id("workoutSessions"),
    userId: v.id("users"),
    exerciseId: v.id("exercises"),
    exerciseNameSnapshot: v.string(),
    setIndex: v.number(),
    weight: v.number(),
    reps: v.number(),
    rpe: v.optional(v.number()),
    notes: v.optional(v.string()),
    completedAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user_exercise", ["userId", "exerciseId"])
    .index("by_user_exercise_completedAt", ["userId", "exerciseId", "completedAt"]),

  personalRecords: defineTable({
    userId: v.id("users"),
    exerciseId: v.id("exercises"),
    maxWeight: v.number(),
    maxWeightReps: v.number(),
    maxWeightSetEntryId: v.id("setEntries"),
    maxWeightAt: v.number(),
    estimated1RM: v.number(),
    estimated1RMSetEntryId: v.id("setEntries"),
    estimated1RMAt: v.number(),
  }).index("by_user_exercise", ["userId", "exerciseId"]),

  migrations: defineTable({
    userId: v.id("users"),
    guestBatchId: v.string(),
    status: v.union(v.literal("completed"), v.literal("failed")),
    routinesMigrated: v.number(),
    sessionsMigrated: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_guestBatchId", ["guestBatchId"]),
});
