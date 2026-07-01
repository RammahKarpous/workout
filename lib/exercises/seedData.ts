export interface SeedExercise {
	name: string;
	muscleGroups: string[];
	equipment:
		| "barbell"
		| "dumbbell"
		| "machine"
		| "cable"
		| "bodyweight"
		| "kettlebell"
		| "band"
		| "other";
	instructions?: string;
}

export const SEED_EXERCISES: SeedExercise[] = [
	// Chest
	{ name: "Barbell Bench Press", muscleGroups: ["chest", "triceps", "shoulders"], equipment: "barbell" },
	{ name: "Incline Barbell Bench Press", muscleGroups: ["chest", "shoulders", "triceps"], equipment: "barbell" },
	{ name: "Dumbbell Bench Press", muscleGroups: ["chest", "triceps", "shoulders"], equipment: "dumbbell" },
	{ name: "Incline Dumbbell Press", muscleGroups: ["chest", "shoulders", "triceps"], equipment: "dumbbell" },
	{ name: "Dumbbell Fly", muscleGroups: ["chest"], equipment: "dumbbell" },
	{ name: "Cable Crossover", muscleGroups: ["chest"], equipment: "cable" },
	{ name: "Push-Up", muscleGroups: ["chest", "triceps", "shoulders"], equipment: "bodyweight" },
	{ name: "Chest Dip", muscleGroups: ["chest", "triceps"], equipment: "bodyweight" },
	{ name: "Machine Chest Press", muscleGroups: ["chest", "triceps"], equipment: "machine" },

	// Back
	{ name: "Deadlift", muscleGroups: ["back", "hamstrings", "glutes"], equipment: "barbell" },
	{ name: "Pull-Up", muscleGroups: ["back", "biceps"], equipment: "bodyweight" },
	{ name: "Chin-Up", muscleGroups: ["back", "biceps"], equipment: "bodyweight" },
	{ name: "Barbell Row", muscleGroups: ["back", "biceps"], equipment: "barbell" },
	{ name: "Pendlay Row", muscleGroups: ["back", "biceps"], equipment: "barbell" },
	{ name: "Dumbbell Row", muscleGroups: ["back", "biceps"], equipment: "dumbbell" },
	{ name: "Lat Pulldown", muscleGroups: ["back", "biceps"], equipment: "cable" },
	{ name: "Seated Cable Row", muscleGroups: ["back", "biceps"], equipment: "cable" },
	{ name: "T-Bar Row", muscleGroups: ["back", "biceps"], equipment: "machine" },
	{ name: "Face Pull", muscleGroups: ["back", "shoulders"], equipment: "cable" },

	// Shoulders
	{ name: "Overhead Press", muscleGroups: ["shoulders", "triceps"], equipment: "barbell" },
	{ name: "Seated Dumbbell Shoulder Press", muscleGroups: ["shoulders", "triceps"], equipment: "dumbbell" },
	{ name: "Arnold Press", muscleGroups: ["shoulders", "triceps"], equipment: "dumbbell" },
	{ name: "Lateral Raise", muscleGroups: ["shoulders"], equipment: "dumbbell" },
	{ name: "Front Raise", muscleGroups: ["shoulders"], equipment: "dumbbell" },
	{ name: "Rear Delt Fly", muscleGroups: ["shoulders", "back"], equipment: "dumbbell" },
	{ name: "Cable Lateral Raise", muscleGroups: ["shoulders"], equipment: "cable" },
	{ name: "Shrug", muscleGroups: ["shoulders", "back"], equipment: "barbell" },

	// Biceps
	{ name: "Barbell Curl", muscleGroups: ["biceps"], equipment: "barbell" },
	{ name: "Dumbbell Curl", muscleGroups: ["biceps"], equipment: "dumbbell" },
	{ name: "Hammer Curl", muscleGroups: ["biceps", "forearms"], equipment: "dumbbell" },
	{ name: "Preacher Curl", muscleGroups: ["biceps"], equipment: "barbell" },
	{ name: "Cable Curl", muscleGroups: ["biceps"], equipment: "cable" },
	{ name: "Concentration Curl", muscleGroups: ["biceps"], equipment: "dumbbell" },

	// Triceps
	{ name: "Close-Grip Bench Press", muscleGroups: ["triceps", "chest"], equipment: "barbell" },
	{ name: "Tricep Pushdown", muscleGroups: ["triceps"], equipment: "cable" },
	{ name: "Overhead Tricep Extension", muscleGroups: ["triceps"], equipment: "dumbbell" },
	{ name: "Skull Crusher", muscleGroups: ["triceps"], equipment: "barbell" },
	{ name: "Tricep Dip", muscleGroups: ["triceps", "chest"], equipment: "bodyweight" },

	// Legs
	{ name: "Back Squat", muscleGroups: ["quads", "glutes", "hamstrings"], equipment: "barbell" },
	{ name: "Front Squat", muscleGroups: ["quads", "glutes"], equipment: "barbell" },
	{ name: "Goblet Squat", muscleGroups: ["quads", "glutes"], equipment: "dumbbell" },
	{ name: "Romanian Deadlift", muscleGroups: ["hamstrings", "glutes"], equipment: "barbell" },
	{ name: "Leg Press", muscleGroups: ["quads", "glutes"], equipment: "machine" },
	{ name: "Walking Lunge", muscleGroups: ["quads", "glutes", "hamstrings"], equipment: "dumbbell" },
	{ name: "Bulgarian Split Squat", muscleGroups: ["quads", "glutes"], equipment: "dumbbell" },
	{ name: "Leg Extension", muscleGroups: ["quads"], equipment: "machine" },
	{ name: "Leg Curl", muscleGroups: ["hamstrings"], equipment: "machine" },
	{ name: "Hip Thrust", muscleGroups: ["glutes", "hamstrings"], equipment: "barbell" },
	{ name: "Standing Calf Raise", muscleGroups: ["calves"], equipment: "machine" },
	{ name: "Seated Calf Raise", muscleGroups: ["calves"], equipment: "machine" },
	{ name: "Kettlebell Swing", muscleGroups: ["glutes", "hamstrings", "back"], equipment: "kettlebell" },

	// Core
	{ name: "Plank", muscleGroups: ["core"], equipment: "bodyweight" },
	{ name: "Hanging Leg Raise", muscleGroups: ["core"], equipment: "bodyweight" },
	{ name: "Cable Crunch", muscleGroups: ["core"], equipment: "cable" },
	{ name: "Russian Twist", muscleGroups: ["core"], equipment: "bodyweight" },
	{ name: "Ab Wheel Rollout", muscleGroups: ["core"], equipment: "other" },
	{ name: "Sit-Up", muscleGroups: ["core"], equipment: "bodyweight" },

	// Forearms
	{ name: "Wrist Curl", muscleGroups: ["forearms"], equipment: "dumbbell" },
	{ name: "Farmer's Carry", muscleGroups: ["forearms", "core"], equipment: "dumbbell" },
];
