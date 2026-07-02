/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as exercises from "../exercises.js";
import type * as migration from "../migration.js";
import type * as personalRecords from "../personalRecords.js";
import type * as progress from "../progress.js";
import type * as routineExercises from "../routineExercises.js";
import type * as routines from "../routines.js";
import type * as seed from "../seed.js";
import type * as setEntries from "../setEntries.js";
import type * as users from "../users.js";
import type * as workoutSessions from "../workoutSessions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  exercises: typeof exercises;
  migration: typeof migration;
  personalRecords: typeof personalRecords;
  progress: typeof progress;
  routineExercises: typeof routineExercises;
  routines: typeof routines;
  seed: typeof seed;
  setEntries: typeof setEntries;
  users: typeof users;
  workoutSessions: typeof workoutSessions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
