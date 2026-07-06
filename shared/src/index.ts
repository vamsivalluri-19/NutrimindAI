import { z } from 'zod';

// ==========================================
// User & Auth Types & Schemas
// ==========================================
export const UserRole = z.enum(['GUEST', 'USER', 'NUTRITIONIST', 'TRAINER', 'ADMIN', 'SUPER_ADMIN']);
export type UserRoleType = z.infer<typeof UserRole>;

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: UserRole.default('USER'),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const OtpLoginSchema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
});
export type OtpLoginInput = z.infer<typeof OtpLoginSchema>;

// ==========================================
// Profile Demographics & Settings
// ==========================================
export const Gender = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
export const ActivityLevel = z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE']);
export const LifestylePreference = z.enum(['VEGETARIAN', 'VEGAN', 'KETO', 'PALEO', 'MEDITERRANEAN', 'HIGH_PROTEIN', 'ANY']);
export const FitnessGoal = z.enum(['LOSE_WEIGHT', 'MAINTAIN_WEIGHT', 'GAIN_MUSCLE', 'IMPROVE_ENDURANCE', 'HEALTHY_LIFESTYLE']);

export const ProfileSchema = z.object({
  age: z.number().int().min(1).max(120),
  gender: Gender,
  height: z.number().positive('Height must be positive (cm)'),
  weight: z.number().positive('Weight must be positive (kg)'),
  targetWeight: z.number().positive('Target weight must be positive (kg)'),
  activityLevel: ActivityLevel,
  lifestyle: LifestylePreference.default('ANY'),
  allergies: z.array(z.string()).default([]),
  medicalConditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  sleepHoursGoal: z.number().min(4).max(12).default(8),
  waterGoalMl: z.number().positive().default(3000),
  workoutPreference: z.enum(['HOME', 'GYM', 'OUTDOOR', 'YOGA', 'NONE']).default('GYM'),
  fitnessGoal: FitnessGoal,
});
export type ProfileInput = z.infer<typeof ProfileSchema>;

// ==========================================
// Meal Tracker Types & Schemas
// ==========================================
export const MealType = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']);
export type MealTypeEnum = z.infer<typeof MealType>;

export const MealLogSchema = z.object({
  mealType: MealType,
  foodName: z.string().min(1, 'Food name is required'),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(), // in grams
  carbs: z.number().nonnegative(),   // in grams
  fat: z.number().nonnegative(),     // in grams
  fiber: z.number().nonnegative().optional().default(0),
  sugar: z.number().nonnegative().optional().default(0),
  sodium: z.number().nonnegative().optional().default(0),
  photoUrl: z.string().url().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
export type MealLogInput = z.infer<typeof MealLogSchema>;

// ==========================================
// Recipe Types & Schemas
// ==========================================
export const RecipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction step is required'),
  category: LifestylePreference,
  cuisine: z.string().min(1, 'Cuisine is required'),
  prepTimeMinutes: z.number().int().positive(),
  cookTimeMinutes: z.number().int().nonnegative(),
  calories: z.number().positive(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  imageUrl: z.string().url().optional(),
  servings: z.number().int().positive().default(1),
});
export type RecipeInput = z.infer<typeof RecipeSchema>;

// ==========================================
// Workout Tracker Types & Schemas
// ==========================================
export const WorkoutType = z.enum(['HOME_WORKOUT', 'GYM_WORKOUT', 'YOGA', 'HIIT', 'STRENGTH_TRAINING', 'WALKING', 'RUNNING', 'CYCLING', 'STRETCHING']);
export type WorkoutTypeEnum = z.infer<typeof WorkoutType>;

export const ExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  weightKg: z.number().nonnegative().optional(),
  durationMinutes: z.number().positive().optional(),
  notes: z.string().optional(),
});
export type ExerciseInput = z.infer<typeof ExerciseSchema>;

export const WorkoutLogSchema = z.object({
  workoutType: WorkoutType,
  exercises: z.array(ExerciseSchema).default([]),
  durationMinutes: z.number().positive('Duration must be positive'),
  caloriesBurned: z.number().nonnegative().optional().default(0),
  steps: z.number().int().nonnegative().optional().default(0),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  notes: z.string().optional(),
});
export type WorkoutLogInput = z.infer<typeof WorkoutLogSchema>;

// ==========================================
// Progress Tracker Types & Schemas
// ==========================================
export const WeightLogSchema = z.object({
  weight: z.number().positive('Weight must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
export type WeightLogInput = z.infer<typeof WeightLogSchema>;

export const WaterLogSchema = z.object({
  amountMl: z.number().positive('Amount must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
export type WaterLogInput = z.infer<typeof WaterLogSchema>;

export const SleepLogSchema = z.object({
  durationHours: z.number().positive('Hours must be positive'),
  quality: z.number().int().min(1).max(5), // 1 to 5 stars
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
export type SleepLogInput = z.infer<typeof SleepLogSchema>;

export const MoodLogSchema = z.object({
  mood: z.enum(['AWESOME', 'GOOD', 'OK', 'BAD', 'TERRIBLE']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  notes: z.string().optional(),
});
export type MoodLogInput = z.infer<typeof MoodLogSchema>;

// ==========================================
// Support Tickets
// ==========================================
export const SupportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
export type SupportTicketInput = z.infer<typeof SupportTicketSchema>;

// ==========================================
// AI Types & Interfaces
// ==========================================
export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIDietPlanResponse {
  title: string;
  description: string;
  targetCalories: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  meals: {
    day: string; // "Monday", "Tuesday", etc.
    mealType: MealTypeEnum;
    foodName: string;
    portionSize: string;
    estimatedCalories: number;
  }[];
}

export interface AIWorkoutPlanResponse {
  title: string;
  description: string;
  weeklySchedule: {
    day: string;
    workoutType: WorkoutTypeEnum | 'REST';
    exercises: {
      name: string;
      sets?: number;
      reps?: number;
      durationMinutes?: number;
      notes?: string;
    }[];
  }[];
}
