// File: apps/api/src/routes/auth.routes.ts

import { Router } from 'express';
import { register, login, googleAuthCallback, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware'; // Make sure this is imported

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-callback', googleAuthCallback);

// Add the new, protected route
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);

export default router;