import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Workout } from '../models/Workout';

export const logWorkout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const newWorkout = new Workout({
      ...req.body,
      userId: req.user.id,
    });

    await newWorkout.save();
    res.status(201).json({
      message: 'Workout logged successfully',
      workout: newWorkout,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkoutsByDate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required (YYYY-MM-DD)' });
    }

    const workouts = await Workout.find({ userId: req.user.id, date: date as string });
    res.json(workouts);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;

    const deleted = await Workout.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    res.json({ message: 'Workout log deleted successfully' });
  } catch (error) {
    next(error);
  }
};
