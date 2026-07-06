import { Router } from 'express';
import { logWorkout, getWorkoutsByDate, deleteWorkout } from '../controllers/workout.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { WorkoutLogSchema } from '@nutrimind/shared';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(WorkoutLogSchema), logWorkout);
router.get('/', getWorkoutsByDate);
router.delete('/:id', deleteWorkout);

export default router;
