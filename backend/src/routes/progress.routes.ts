import { Router } from 'express';
import { logProgress, logIncrementWater, getProgressHistory, getProgressByDate } from '../controllers/progress.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', logProgress);
router.post('/water-increment', logIncrementWater);
router.get('/history', getProgressHistory);
router.get('/:date', getProgressByDate);

export default router;
