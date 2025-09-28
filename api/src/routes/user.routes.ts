import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and require a user to be logged in.
router.use(authenticateToken);
console.log("User routes loaded.");
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/password', userController.updatePassword);

export default router;
