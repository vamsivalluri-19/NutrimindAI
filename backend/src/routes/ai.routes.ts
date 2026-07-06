import { Router } from 'express';
import { getDietPlan, getWorkoutPlan, chatWithCoach, getChatHistory, clearChatHistory, getGroceryList } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/diet-plan', getDietPlan);
router.post('/workout-plan', getWorkoutPlan);
router.post('/chat', chatWithCoach);
router.get('/chat-history', getChatHistory);
router.delete('/chat-history', clearChatHistory);
router.get('/grocery-list', getGroceryList);

export default router;
