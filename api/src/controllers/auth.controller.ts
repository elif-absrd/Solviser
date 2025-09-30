import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import logger from '../middleware/logger.middleware';

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { organizationName, userName, email, password } = req.body;
    
    if (!organizationName || !userName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const result = await authService.registerOrganizationAndUser(res, organizationName, userName, email, password);
    
    logger.info(`New user registered: ${email} for organization: ${organizationName}`);
    res.status(201).json(result);
  } catch (error: any) {
    logger.error(`Registration Error: ${error.message}`, {
      statusCode: error.statusCode,
      stack: error.stack,
    });
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'An error occurred during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body; // Moved email to the outer scope
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const result = await authService.loginUser(res, email, password);

        logger.info(`User logged in successfully: ${email}`);
        res.json(result);
    } catch (error: any) {
        logger.error(`Login Error: ${error.message}`, {
          statusCode: error.statusCode,
          email: email, // Explicitly pass the email variable
        });
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || 'An error occurred during login.' });
    }
};

// New controller for Google OAuth callback
export const googleAuthCallback = async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Google auth code is required.' });
    }

    try {
        const result = await authService.handleGoogleAuth(res, code as string);
        logger.info(`User authenticated via Google: ${result.user.email}`);
        res.json(result);
    } catch (error: any) {
        logger.error(`Google Auth Error: ${error.message}`, {
            statusCode: error.statusCode,
        });
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || 'An error occurred during Google authentication.' });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  // If this function is reached, the authenticateToken middleware has already
  // verified the JWT and attached the user payload to req.user.
  // We simply return it to the frontend.
  res.status(200).json(req.user);
};

export const logout = (req: Request, res: Response) => {
  try {
    authService.logoutUser(res);
    res.status(200).json({ message: 'Logout successful.' });
  } catch (error: any) {
    logger.error(`Logout Error: ${error.message}`);
    res.status(500).json({ error: 'An error occurred during logout.' });
  }
};