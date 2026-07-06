import { Router } from 'express';
import { listUsers, updateUserRole, listTickets, replyToTicket, getPromptConfig, updatePromptConfig } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize(['ADMIN', 'SUPER_ADMIN']));

router.get('/users', listUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/tickets', listTickets);
router.post('/tickets/:id/reply', replyToTicket);
router.get('/prompt-config', getPromptConfig);
router.post('/prompt-config', updatePromptConfig);

export default router;
