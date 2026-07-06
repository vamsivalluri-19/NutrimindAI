import mongoose, { Schema, Document } from 'mongoose';
import { WorkoutTypeEnum } from '@nutrimind/shared';

interface IExerciseLog {
  name: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
  durationMinutes?: number;
  notes?: string;
}

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  workoutType: WorkoutTypeEnum;
  exercises: IExerciseLog[];
  durationMinutes: number;
  caloriesBurned: number;
  steps: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseLogSchema = new Schema<IExerciseLog>({
  name: { type: String, required: true },
  sets: { type: Number },
  reps: { type: Number },
  weightKg: { type: Number },
  durationMinutes: { type: Number },
  notes: { type: String },
});

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workoutType: {
      type: String,
      enum: ['HOME_WORKOUT', 'GYM_WORKOUT', 'YOGA', 'HIIT', 'STRENGTH_TRAINING', 'WALKING', 'RUNNING', 'CYCLING', 'STRETCHING'],
      required: true,
    },
    exercises: [ExerciseLogSchema],
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    date: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Workout = mongoose.model<IWorkout>('Workout', WorkoutSchema);
