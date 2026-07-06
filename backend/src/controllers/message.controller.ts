import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Message } from '../models/Message';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import { Meal } from '../models/Meal';
import { Workout } from '../models/Workout';
import { Progress } from '../models/Progress';

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { receiverId, content } = req.body;
    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const message = new Message({
      senderId: req.user.id,
      receiverId,
      content,
    });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { targetUserId } = req.params;
    if (!targetUserId) {
      return res.status(400).json({ message: 'Target User ID is required' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getAssignedPatients = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // Find all profiles where nutritionistId or trainerId matches req.user.id
    const profiles = await Profile.find({
      $or: [
        { nutritionistId: req.user.id },
        { trainerId: req.user.id }
      ]
    }).populate('userId', 'firstName lastName email role');
    
    res.json(profiles);
  } catch (error) {
    next(error);
  }
};

export const getPatientLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const profile = await Profile.findOne({
      userId,
      $or: [
        { nutritionistId: req.user.id },
        { trainerId: req.user.id }
      ]
    });

    if (!profile && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not assigned as a consultant for this patient' });
    }

    const today = new Date();
    const dateLimit = new Date();
    dateLimit.setDate(today.getDate() - 7);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const meals = await Meal.find({
      userId,
      date: { $gte: formatDate(dateLimit), $lte: formatDate(today) }
    }).sort({ createdAt: -1 });

    const workouts = await Workout.find({
      userId,
      date: { $gte: formatDate(dateLimit), $lte: formatDate(today) }
    }).sort({ createdAt: -1 });

    const progress = await Progress.find({
      userId,
      date: { $gte: formatDate(dateLimit), $lte: formatDate(today) }
    }).sort({ date: -1 });

    res.json({
      meals,
      workouts,
      progress
    });
  } catch (error) {
    next(error);
  }
};
