import mongoose, { Schema, Document } from 'mongoose';
import { MealTypeEnum } from '@nutrimind/shared';

export interface IMeal extends Document {
  userId: mongoose.Types.ObjectId;
  mealType: MealTypeEnum;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  photoUrl?: string;
  date: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealType: { type: String, enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'], required: true },
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    photoUrl: { type: String },
    date: { type: String, required: true }, // Format YYYY-MM-DD
  },
  { timestamps: true }
);

export const Meal = mongoose.model<IMeal>('Meal', MealSchema);
