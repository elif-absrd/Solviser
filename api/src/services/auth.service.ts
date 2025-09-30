// File: apps/api/src/services/auth.service.ts
import { Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../middleware/logger.middleware';
import { OAuth2Client } from 'google-auth-library';

// ... (ApiError class remains the same)
class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// --- UPDATED: Helper now derives permissions ONLY from roles ---
const getUserWithPermissions = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            roles: {
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!user) return null;

    const permissions = new Set<string>();
    
    // --- THE FIX IS HERE ---
    // The special case for `isOwner` is removed.
    // Permissions are now built exclusively from the roles assigned to the user.
    user.roles.forEach((userRole: any) => {
        userRole.role.permissions.forEach((rolePermission: any) => {
            permissions.add(rolePermission.permission.actionName);
        });
    });

    return { ...user, permissions: Array.from(permissions) };
};

// ... (The rest of the file - generateTokenAndSetCookie, register, login, etc. - remains the same)
// They will now correctly use the updated getUserWithPermissions function.

const generateTokenAndSetCookie = (res: Response, user: any, isNewUser: boolean = false) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logger.error('JWT_SECRET is not defined.');
    throw new ApiError('Server configuration error.', 500);
  }

  // The user object from getUserWithPermissions now includes tokenVersion
  const payload = { 
    userId: user.id, 
    organizationId: user.organizationId,
    isOwner: user.isOwner,
    name: user.name,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin || false,
    permissions: user.permissions || [],
    
    // --- MODIFICATION ---
    // Add the token version to the JWT payload.
    tokenVersion: user.tokenVersion, 
    
    isNewUser
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.solviser.in' : 'localhost',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });
  
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};


export const registerOrganizationAndUser = async (res: Response, organizationName: string, userName: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError('A user with this email already exists.', 409);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

 const result = await prisma.$transaction(async (tx: any) => {
    const freePlan = await tx.subscriptionPlan.findUnique({ where: { name: 'Free' } });
    if (!freePlan) { throw new ApiError('Default "Free" plan not found.', 500); }
    
    // Find the system role that corresponds to the "Free" plan
    const freeRole = await tx.role.findFirst({ where: { name: 'Free', isSystemRole: true } });
    if (!freeRole) { throw new ApiError('Default "Free" role not found.', 500); }

    // Make organization name unique by appending timestamp
    const uniqueOrgName = `${organizationName}_${Date.now()}`;
    const newOrganization = await tx.organization.create({ data: { name: uniqueOrgName } });
    const newUser = await tx.user.create({
      data: { name: userName, email, passwordHash, organizationId: newOrganization.id, isOwner: true },
    });
    
    await tx.organization.update({ where: { id: newOrganization.id }, data: { ownerId: newUser.id } });
    
    await tx.subscription.create({
        data: {
            organizationId: newOrganization.id,
            planId: freePlan.id,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date('2099-12-31'),
        }
    });

    // --- THE FIX IS HERE ---
    // Assign the "Free" role to the new user (the owner)
    await tx.userRole.create({
        data: {
            userId: newUser.id,
            roleId: freeRole.id,
        }
    });

    return { newUser };
  });
  
  const newUserWithPermissions = await getUserWithPermissions(result.newUser.id);
  const { token, user } = generateTokenAndSetCookie(res, newUserWithPermissions, false);
  return { message: 'Organization and user created successfully!', token, user };
};


export const loginUser = async (res: Response, email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { throw new ApiError('Invalid credentials.', 401); }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) { throw new ApiError('Invalid credentials.', 401); }

    const userWithPermissions = await getUserWithPermissions(user.id);
    if (!userWithPermissions) { throw new ApiError('Could not find user details.', 404); }

    const { token, user: loggedInUser } = generateTokenAndSetCookie(res, userWithPermissions, false);
    return { message: 'Login successful!', token, user: loggedInUser };
};

export const handleGoogleAuth = async (res: Response, code: string) => {
    const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        const idToken = tokens.id_token;
        if (!idToken) { throw new ApiError('Failed to get Google ID token.', 400); }

        const ticket = await oAuth2Client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) { throw new ApiError('Invalid Google token payload.', 400); }

        const { email, name } = payload;
        let isNewUser = false;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            isNewUser = true;
            const result = await prisma.$transaction(async (tx: any) => {
                const freePlan = await tx.subscriptionPlan.findFirst({ where: { isFree: true } });
                if (!freePlan) { throw new ApiError('Default "Free" plan not found.', 500); }
                
                // Find the system role that corresponds to the "Free" plan
                const freeRole = await tx.role.findFirst({ where: { name: 'Free', isSystemRole: true } });
                if (!freeRole) { throw new ApiError('Default "Free" role not found.', 500); }
                
                // Make organization name unique
                const uniqueOrgName = `${name}'s Organization_${Date.now()}`;
                const newOrganization = await tx.organization.create({ data: { name: uniqueOrgName } });
                const randomPassword = Math.random().toString(36).slice(-16);
                const passwordHash = await bcrypt.hash(randomPassword, 10);
                const newUser = await tx.user.create({
                    data: { name, email, passwordHash, organizationId: newOrganization.id, isOwner: true },
                });
                await tx.organization.update({ where: { id: newOrganization.id }, data: { ownerId: newUser.id } });
                await tx.subscription.create({
                    data: {
                        organizationId: newOrganization.id, planId: freePlan.id, status: 'active',
                        currentPeriodStart: new Date(), currentPeriodEnd: new Date('2099-12-31'),
                    }
                });
                
                // Assign the "Free" role to the new user (the owner)
                await tx.userRole.create({
                    data: {
                        userId: newUser.id,
                        roleId: freeRole.id,
                    }
                });
                
                return newUser;
            });
            user = result;
        }

        if (!user) {
            throw new ApiError('Failed to create or find user.', 500);
        }

        const userWithPermissions = await getUserWithPermissions(user.id);
        if (!userWithPermissions) { throw new ApiError('Could not find user details.', 404); }

        const { token, user: googleUser } = generateTokenAndSetCookie(res, userWithPermissions, isNewUser);
        return { message: 'Google authentication successful!', token, user: googleUser };

    } catch (error) {
        logger.error('Error in handleGoogleAuth service:', error);
        throw new ApiError('Failed to authenticate with Google.', 500);
    }
};

export const logoutUser = (res: Response) => {
  res.cookie('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.solviser.in' : 'localhost',
    path: '/',
    expires: new Date(0),
  });
};