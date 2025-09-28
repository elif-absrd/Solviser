// File: apps/api/src/routes/subscription.routes.ts
import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Endpoint for the frontend to fetch available plans
router.get('/plans', subscriptionController.listPlans);

// Endpoint for an authenticated user to create a new subscription
router.post('/create', authenticateToken, subscriptionController.create);

// Public endpoint for Razorpay to send webhook notifications
router.post('/webhook', subscriptionController.webhook);

export default router;