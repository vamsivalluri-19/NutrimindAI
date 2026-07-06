import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  weight?: number;
  waterIntakeMl: number;
  sleepHours?: number;
  sleepQuality?: number; // 1-5 scale
  mood?: 'AWESOME' | 'GOOD' | 'OK' | 'BAD' | 'TERRIBLE';
  steps: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    weight: { type: Number },
    waterIntakeMl: { type: Number, default: 0 },
    sleepHours: { type: Number },
    sleepQuality: { type: Number, min: 1, max: 5 },
    mood: { type: String, enum: ['AWESOME', 'GOOD', 'OK', 'BAD', 'TERRIBLE'] },
    steps: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure index for fast searches on userId + date
ProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>('Progress', ProgressSchema);
