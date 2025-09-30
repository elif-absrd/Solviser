import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from './logger.middleware';
import prisma from '../prisma'; // Import your Prisma client

// Define the shape of our JWT payload
interface JwtPayload {
  userId: string;
<<<<<<< HEAD
  tokenVersion: number;
  // ... other properties
=======
  organizationId: string;
  isOwner: boolean;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: string[];
  tokenVersion: number;
  isNewUser?: boolean;
>>>>>>> master
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logger.error('JWT_SECRET is not defined.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    // 1. Verify the token's signature and expiration
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;

    // 2. Fetch the user's current tokenVersion from the database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { tokenVersion: true },
    });

    // If user not found, or token version mismatch, the token is invalid.
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      logger.warn(`Stale token used for userId: ${payload.userId}. Invalidating.`);
      res.clearCookie('authToken');
      return res.sendStatus(403); // Forbidden
    }

<<<<<<< HEAD
    // 3. Token is valid and fresh. Attach the payload to the request.
=======
    // 3. Token is valid and fresh. Attach the complete payload to the request.
>>>>>>> master
    req.user = payload;
    
    next();
  } catch (err) {
    // This catches errors from jwt.verify (e.g., expired token, bad signature)
    logger.warn('JWT verification failed', { error: (err as Error).message });
    res.clearCookie('authToken');
    return res.sendStatus(403); // Forbidden
  }
};