import { Router } from 'express';
import authRouter from './auth.routes';
import organizationRouter from './organization.routes';
import dashboardRouter from './dashboard.routes'; // <-- Import the new dashboard routes
import subscriptionRouter from './subscription.routes';
import rbacRouter from './rbac.routes'; // <-- Import existing RBAC routes
import adminRouter from './admin.routes'; // <-- Import admin routes
import userRouter from './user.routes'; // <-- Import user routes
import verificationRoutes from './verification.routes';
import onboardingRoutes from './onboarding.routes';
import providerRoutes from './providers.routes'; // <-- Import provider routes
import contractRouter from './contract.routes'; // <-- Import contract routes
const router = Router();

// Health check endpoint
router.get('/health', (_, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Mount the authentication routes
router.use('/auth', authRouter);
router.use('/organization', organizationRouter);
router.use('/dashboard', dashboardRouter); // <-- Add new route
router.use('/subscriptions', subscriptionRouter);
router.use('/rbac', rbacRouter); // <-- Keep existing RBAC routes
router.use('/admin', adminRouter); // <-- Add admin routes
router.use('/user', userRouter); // <-- Add user routes
router.use('/verification', verificationRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/providers', providerRoutes);
router.use('/contracts', contractRouter); // <-- Add contract routes

export default router;
