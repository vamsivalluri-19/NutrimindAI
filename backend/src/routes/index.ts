import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import mealRoutes from './meal.routes';
import recipeRoutes from './recipe.routes';
import workoutRoutes from './workout.routes';
import progressRoutes from './progress.routes';
import aiRoutes from './ai.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';
import messageRoutes from './message.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/meals', mealRoutes);
router.use('/recipes', recipeRoutes);
router.use('/workouts', workoutRoutes);
router.use('/progress', progressRoutes);
router.use('/ai', aiRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/messages', messageRoutes);

export default router;
