import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Progress } from '../models/Progress';

export const logProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { date, weight, waterIntakeMl, sleepHours, sleepQuality, mood, steps } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required (YYYY-MM-DD)' });
    }

    const updateFields: any = {};
    if (weight !== undefined) updateFields.weight = weight;
    if (waterIntakeMl !== undefined) updateFields.waterIntakeMl = waterIntakeMl;
    if (sleepHours !== undefined) updateFields.sleepHours = sleepHours;
    if (sleepQuality !== undefined) updateFields.sleepQuality = sleepQuality;
    if (mood !== undefined) updateFields.mood = mood;
    if (steps !== undefined) updateFields.steps = steps;

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id, date },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    res.json({ message: 'Progress updated successfully', progress });
  } catch (error) {
    next(error);
  }
};

export const logIncrementWater = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { date, amountMl } = req.body;

    if (!date || !amountMl) {
      return res.status(400).json({ message: 'Date and amountMl are required' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id, date },
      { $inc: { waterIntakeMl: amountMl } },
      { new: true, upsert: true }
    );

    res.json({ message: 'Water intake updated', progress });
  } catch (error) {
    next(error);
  }
};

export const getProgressHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { limit } = req.query;

    const history = await Progress.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(limit ? Number(limit) : 30);

    res.json(history.reverse());
  } catch (error) {
    next(error);
  }
};

export const getProgressByDate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { date } = req.params; // YYYY-MM-DD

    let progress = await Progress.findOne({ userId: req.user.id, date });
    if (!progress) {
      // Create a default empty log for that date so frontend has initial values
      progress = new Progress({
        userId: req.user.id,
        date,
        waterIntakeMl: 0,
        steps: 0
      });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    next(error);
  }
};
