// File: apps/api/src/services/subscription.service.ts
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../prisma';
import logger from '../middleware/logger.middleware';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createSubscription = async (organizationId: string, planId: string) => {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.razorpayPlanId) {
        throw new ApiError('Invalid plan selected.', 400);
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id: plan.razorpayPlanId,
        total_count: 12, // For a yearly plan
        quantity: 1,
        customer_notify: 0,
        notes: {
            organizationId: organizationId // Crucial for linking webhook back to your user
        }
    });

    logger.info(`Created Razorpay subscription ${subscription.id} for organization ${organizationId}`);
    return {
        subscriptionId: subscription.id,
        keyId: process.env.RAZORPAY_KEY_ID
    };
};

export const verifyWebhookSignature = (body: Buffer, signature: string) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(body) // The update function works directly with the Buffer
        .digest('hex');

    if (generated_signature !== signature) {
        logger.warn('Webhook signature verification failed.');
        return false;
    }
    return true;
};

export const handleSubscriptionChargedWebhook = async (payload: any) => {
    const { subscription, payment } = payload;
    const razorpaySubscriptionId = subscription.entity.id;
    const razorpayPaymentId = payment.entity.id;
    const razorpayPlanId = subscription.entity.plan_id;
    const organizationId = subscription.entity.notes.organizationId;

    if (!organizationId) {
        logger.error(`Webhook received without organizationId in notes. Subscription ID: ${razorpaySubscriptionId}`);
        return; // Cannot process without organizationId
    }

    const plan = await prisma.subscriptionPlan.findUnique({ where: { razorpayPlanId } });
    if (!plan) {
        logger.error(`Webhook received for an unknown Razorpay Plan ID: ${razorpayPlanId}`);
        return;
    }

    // Use upsert to create or update the subscription
    await prisma.subscription.upsert({
        where: { razorpaySubscriptionId },
        update: {
            status: 'active',
            razorpayPaymentId,
            currentPeriodStart: new Date(subscription.entity.start_at * 1000),
            currentPeriodEnd: new Date(subscription.entity.end_at * 1000),
        },
        create: {
            organizationId: organizationId,
            planId: plan.id,
            razorpaySubscriptionId,
            razorpayPaymentId,
            status: 'active',
            currentPeriodStart: new Date(subscription.entity.start_at * 1000),
            currentPeriodEnd: new Date(subscription.entity.end_at * 1000),
        }
    });
    
    logger.info(`Successfully activated subscription for organization ${organizationId}`);
};

export const getAvailablePlans = async () => {
    return prisma.subscriptionPlan.findMany({
        orderBy: {
            priceInr: 'asc'
        }
    });
};