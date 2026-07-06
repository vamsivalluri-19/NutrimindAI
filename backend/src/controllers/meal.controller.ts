import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Meal } from '../models/Meal';
import { AIService } from '../services/ai.service';
import { Progress } from '../models/Progress';

export const logMeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const newMeal = new Meal({
      ...req.body,
      userId: req.user.id,
    });

    await newMeal.save();

    // Increment progress model calories if exists for that date
    // (In full implementation, we sum up meals on the fly, but maintaining daily stats caches is clean)
    res.status(201).json({
      message: 'Meal logged successfully',
      meal: newMeal,
    });
  } catch (error) {
    next(error);
  }
};

export const getMealsByDate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required (YYYY-MM-DD)' });
    }

    const meals = await Meal.find({ userId: req.user.id, date: date as string });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};

export const deleteMeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;

    const deleted = await Meal.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Meal log not found or unauthorized' });
    }

    res.json({ message: 'Meal log deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const aiEstimateMeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Food description is required' });
    }

    const estimate = await AIService.estimateCalories(description);
    res.json(estimate);
  } catch (error) {
    next(error);
  }
};

export const aiScanMealPhoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const photoUrl = req.file ? req.file.path : req.body.photoUrl;

    if (!photoUrl) {
      return res.status(400).json({ message: 'Photo upload or photoUrl is required' });
    }

    const scanResult = await AIService.scanMealPhoto(photoUrl);
    res.json({
      message: 'Photo scanned successfully',
      nutrition: scanResult,
      photoUrl,
    });
  } catch (error) {
    next(error);
  }
};
