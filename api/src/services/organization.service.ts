import prisma from '../prisma';
import logger from '../middleware/logger.middleware';

// Define the structure of the user payload from the JWT
interface UserPayload {
  userId: string;
  organizationId: string;
  email: string;
  isOwner: boolean;
}

// Custom error class for specific HTTP status codes
class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const updateOrganizationName = async (user: UserPayload, organizationName: string) => {
  // Security check: only the owner can set up the organization name
  if (!user.isOwner) {
    throw new ApiError('You do not have permission to perform this action.', 403);
  }

  const organization = await prisma.organization.findUnique({
    where: { id: user.organizationId },
  });

  // Additional security check to ensure the user is the owner of this specific organization
  if (!organization || organization.ownerId !== user.userId) {
    throw new ApiError('You do not have permission to modify this organization.', 403);
  }

  const updatedOrganization = await prisma.organization.update({
    where: { id: user.organizationId },
    data: { name: organizationName },
  });

  logger.info(`Organization setup completed for ID: ${updatedOrganization.id} by user: ${user.email}`);
  
  return updatedOrganization;
};
