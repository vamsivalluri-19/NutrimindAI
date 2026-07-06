import { Router } from 'express';
import multer from 'multer';
import { logMeal, getMealsByDate, deleteMeal, aiEstimateMeal, aiScanMealPhoto } from '../controllers/meal.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { MealLogSchema } from '@nutrimind/shared';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.use(authenticate);

router.post('/', validateBody(MealLogSchema), logMeal);
router.get('/', getMealsByDate);
router.delete('/:id', deleteMeal);
router.post('/ai-estimate', aiEstimateMeal);
router.post('/ai-scan', upload.single('image'), aiScanMealPhoto);

export default router;
