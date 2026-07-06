import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { PaymentService } from '../services/payment.service';
import { Subscription } from '../models/Subscription';

export const createStripeSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { plan, priceAmount } = req.body;

    if (!plan || !priceAmount) {
      return res.status(400).json({ message: 'Plan and priceAmount are required' });
    }

    const session = await PaymentService.createStripeCheckoutSession(req.user.id, plan, priceAmount);
    
    // Save/Update local user subscription to pending
    await Subscription.findOneAndUpdate(
      { userId: req.user.id },
      { plan, status: 'INACTIVE', paymentGateway: 'STRIPE', subscriptionId: session.id },
      { upsert: true }
    );

    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const createRazorpayOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { plan, priceAmount } = req.body;

    if (!plan || !priceAmount) {
      return res.status(400).json({ message: 'Plan and priceAmount are required' });
    }

    const order = await PaymentService.createRazorpayOrder(req.user.id, plan, priceAmount);

    await Subscription.findOneAndUpdate(
      { userId: req.user.id },
      { plan, status: 'INACTIVE', paymentGateway: 'RAZORPAY', subscriptionId: order.id },
      { upsert: true }
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const verifyPaymentSignature = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { orderId, paymentId, signature } = req.body;

    const isValid = PaymentService.verifyRazorpaySignature(orderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature verification failed' });
    }

    // Activate subscription
    const sub = await Subscription.findOneAndUpdate(
      { userId: req.user.id, subscriptionId: orderId },
      { status: 'ACTIVE', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { new: true }
    );

    res.json({ message: 'Payment verified and subscription activated successfully', subscription: sub });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    let sub = await Subscription.findOne({ userId: req.user.id });
    if (!sub) {
      // Setup a default free plan
      sub = new Subscription({
        userId: req.user.id,
        plan: 'FREE',
        status: 'ACTIVE',
        paymentGateway: 'MOCK',
      });
      await sub.save();
    }

    res.json(sub);
  } catch (error) {
    next(error);
  }
};
