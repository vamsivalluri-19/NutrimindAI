import mongoose, { Schema, Document } from 'mongoose';
import { Gender, ActivityLevel, LifestylePreference, FitnessGoal } from '@nutrimind/shared';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  age: number;
  gender: string;
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: string;
  lifestyle: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  sleepHoursGoal: number;
  waterGoalMl: number;
  workoutPreference: string;
  fitnessGoal: string;
  nutritionistId?: mongoose.Types.ObjectId;
  trainerId?: mongoose.Types.ObjectId;
  nutritionistFeedback?: string;
  trainerFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: Object.keys(Gender.Values), required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    targetWeight: { type: Number, required: true },
    activityLevel: { type: String, enum: Object.keys(ActivityLevel.Values), required: true },
    lifestyle: { type: String, enum: Object.keys(LifestylePreference.Values), default: 'ANY' },
    allergies: [{ type: String }],
    medicalConditions: [{ type: String }],
    medications: [{ type: String }],
    sleepHoursGoal: { type: Number, default: 8 },
    waterGoalMl: { type: Number, default: 3000 },
    workoutPreference: { type: String, enum: ['HOME', 'GYM', 'OUTDOOR', 'YOGA', 'NONE'], default: 'GYM' },
    fitnessGoal: { type: String, enum: Object.keys(FitnessGoal.Values), required: true },
    nutritionistId: { type: Schema.Types.ObjectId, ref: 'User' },
    trainerId: { type: Schema.Types.ObjectId, ref: 'User' },
    nutritionistFeedback: { type: String, default: '' },
    trainerFeedback: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
