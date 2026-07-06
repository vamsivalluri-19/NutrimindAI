import { Router } from 'express';
import { createStripeSession, createRazorpayOrder, verifyPaymentSignature, getSubscriptionStatus } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/stripe-session', createStripeSession);
router.post('/razorpay-order', createRazorpayOrder);
router.post('/razorpay-verify', verifyPaymentSignature);
router.get('/subscription', getSubscriptionStatus);

export default router;
