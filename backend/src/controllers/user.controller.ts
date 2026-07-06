import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    let profile = await Profile.findOne({ userId: req.user.id })
      .populate('nutritionistId', 'firstName lastName email role')
      .populate('trainerId', 'firstName lastName email role');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Onboarding required.' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const profileData = {
      ...req.body,
      userId: req.user.id,
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      profileData,
      { new: true, upsert: true }
    )
      .populate('nutritionistId', 'firstName lastName email role')
      .populate('trainerId', 'firstName lastName email role');

    // Link profile to User model
    await User.findByIdAndUpdate(req.user.id, { profileId: profile._id });

    res.json({
      message: 'Profile saved successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const listCoaches = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coaches = await User.find({ role: { $in: ['NUTRITIONIST', 'TRAINER', 'ADMIN'] } }).select('firstName lastName email role');
    if (coaches.length === 0) {
      return res.json([
        { _id: '6a4b630e7d2919c58a15ef9a', firstName: 'Dr. Sarah', lastName: 'Jenkins', email: 'sarah@nutrimind.ai', role: 'NUTRITIONIST' },
        { _id: '6a4b630e7d2919c58a15ef9b', firstName: 'Coach Marcus', lastName: 'Brody', email: 'marcus@nutrimind.ai', role: 'TRAINER' }
      ]);
    }
    res.json(coaches);
  } catch (error) {
    next(error);
  }
};

export const updateConsultant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { nutritionistId, trainerId } = req.body;
    
    const updateData: any = {};
    if (nutritionistId !== undefined) updateData.nutritionistId = nutritionistId || null;
    if (trainerId !== undefined) updateData.trainerId = trainerId || null;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      updateData,
      { new: true }
    )
      .populate('nutritionistId', 'firstName lastName email role')
      .populate('trainerId', 'firstName lastName email role');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please complete onboarding first.' });
    }

    res.json({
      message: 'Consultant connection updated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { patientProfileId, feedback } = req.body;
    if (!patientProfileId || feedback === undefined) {
      return res.status(400).json({ message: 'Patient profile ID and feedback note are required' });
    }

    const updateData: any = {};
    if (req.user.role === 'NUTRITIONIST' || req.user.role === 'ADMIN') {
      updateData.nutritionistFeedback = feedback;
    } else if (req.user.role === 'TRAINER') {
      updateData.trainerFeedback = feedback;
    } else {
      return res.status(403).json({ message: 'Only coaches/trainers can prescribe recommendations' });
    }

    const profile = await Profile.findByIdAndUpdate(
      patientProfileId,
      updateData,
      { new: true }
    )
      .populate('nutritionistId', 'firstName lastName email role')
      .populate('trainerId', 'firstName lastName email role');

    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({
      message: 'Feedback submitted successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};
