// File: apps/api/src/controllers/subscription.controller.ts
import { Request, Response } from 'express';
import * as subscriptionService from '../services/subscription.service';
import logger from '../middleware/logger.middleware';

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

export const create = async (req: Request, res: Response) => {
    try {
        const { planId } = req.body;
        const user = req.user!;

        const subscriptionDetails = await subscriptionService.createSubscription(user.organizationId, planId);
        res.json(subscriptionDetails);
    } catch (error: any) {
        logger.error(`Error creating subscription: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to create subscription.' });
    }
};

export const webhook = async (req: RequestWithRawBody, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    if (!req.rawBody || !subscriptionService.verifyWebhookSignature(req.rawBody, signature)) {
        return res.status(400).json({ error: 'Invalid webhook signature.' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    logger.info(`Received Razorpay webhook: ${event}`);

    try {
        if (event === 'subscription.charged') {
            await subscriptionService.handleSubscriptionChargedWebhook(payload);
        }
        // You can handle other events like 'subscription.cancelled' here
    } catch (error: any) {
        logger.error(`Error processing webhook event ${event}: ${error.message}`);
    }
    
    res.status(200).json({ status: 'ok' });
};

export const listPlans = async (_: Request, res: Response) => {
    try {
        const plans = await subscriptionService.getAvailablePlans();
        res.json(plans);
    } catch (error: any) {
        logger.error(`Error fetching plans: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch subscription plans.' });
    }
}