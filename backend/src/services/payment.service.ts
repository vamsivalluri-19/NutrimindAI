import dotenv from 'dotenv';

dotenv.config();

export class PaymentService {
  static async createStripeCheckoutSession(userId: string, plan: string, priceAmount: number): Promise<{ id: string; url: string }> {
    const isMock = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock');

    if (isMock) {
      console.log(`[Stripe] Creating Mock Checkout Session for user ${userId}, plan: ${plan}`);
      return {
        id: `mock_stripe_session_${Date.now()}`,
        url: `/checkout/success?session_id=mock_stripe_session_${Date.now()}`
      };
    }

    // Real stripe checkout code template
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({...});
    // return { id: session.id, url: session.url };
    return {
      id: `live_stripe_session_${Date.now()}`,
      url: '#'
    };
  }

  static async createRazorpayOrder(userId: string, plan: string, amount: number): Promise<{ id: string; amount: number; currency: string }> {
    const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('mock');

    if (isMock) {
      console.log(`[Razorpay] Creating Mock Order for user ${userId}, plan: ${plan}`);
      return {
        id: `mock_order_${Date.now()}`,
        amount: amount * 100, // paise
        currency: 'INR'
      };
    }

    return {
      id: `live_order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR'
    };
  }

  static verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
    const isMock = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('mock');
    if (isMock) return true;

    // Real signature check using crypto hmac
    // const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    // shasum.update(orderId + '|' + paymentId);
    // const digest = shasum.digest('hex');
    // return digest === signature;
    return true;
  }
}
