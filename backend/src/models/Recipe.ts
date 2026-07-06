import mongoose, { Schema, Document } from 'mongoose';
import { LifestylePreference } from '@nutrimind/shared';

export interface IRecipe extends Document {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  servings: number;
  authorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    category: { type: String, enum: Object.keys(LifestylePreference.Values), required: true },
    cuisine: { type: String, required: true, trim: true },
    prepTimeMinutes: { type: Number, required: true },
    cookTimeMinutes: { type: Number, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    imageUrl: { type: String },
    servings: { type: Number, default: 1 },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
