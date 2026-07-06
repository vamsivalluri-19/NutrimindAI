import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'FREE' | 'PRO' | 'PREMIUM' | 'FAMILY';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INACTIVE';
  paymentGateway: 'STRIPE' | 'RAZORPAY' | 'MOCK';
  subscriptionId?: string;
  customerId?: string;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['FREE', 'PRO', 'PREMIUM', 'FAMILY'], default: 'FREE' },
    status: { type: String, enum: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'INACTIVE'], default: 'INACTIVE' },
    paymentGateway: { type: String, enum: ['STRIPE', 'RAZORPAY', 'MOCK'], default: 'MOCK' },
    subscriptionId: { type: String },
    customerId: { type: String },
    currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days from now
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
