import { Router } from 'express';
import { getProfile, createOrUpdateProfile, listCoaches, updateConsultant, submitFeedback } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { ProfileSchema } from '@nutrimind/shared';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.post('/profile', authenticate, validateBody(ProfileSchema), createOrUpdateProfile);
router.put('/profile/consultant', authenticate, updateConsultant);
router.put('/profile/feedback', authenticate, submitFeedback);
router.get('/coaches', authenticate, listCoaches);

export default router;
