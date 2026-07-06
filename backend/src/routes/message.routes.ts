import { Router } from 'express';
import { sendMessage, getChatHistory, getAssignedPatients, getPatientLogs } from '../controllers/message.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/send', authenticate, sendMessage);
router.get('/history/:targetUserId', authenticate, getChatHistory);
router.get('/patients', authenticate, getAssignedPatients);
router.get('/patient/:userId/logs', authenticate, getPatientLogs);

export default router;
