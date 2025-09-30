import prisma from '../prisma';
import logger from '../middleware/logger.middleware';

export const getAllSubscriptions = async (filters: { planName?: string; status?: string }, page: number, pageSize: number) => {
    const whereClause: any = {};
    if (filters.planName) {
        whereClause.plan = { name: filters.planName };
    }
    if (filters.status) {
        whereClause.status = filters.status;
    }

    const subscriptions = await prisma.subscription.findMany({
        where: whereClause,
        include: {
            organization: {
                select: {
                    name: true,
                    owner: {
                        select: {
                            email: true,
                        },
                    },
                },
            },
            plan: {
                select: {
                    name: true,
                },
            },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: 'desc',
        },
    });

    const totalCount = await prisma.subscription.count({ where: whereClause });

    return { subscriptions, totalCount };
};

/**
 * Retrieves all system roles (plans) from the database.
 */
export const getSystemRoles = async () => {
  return prisma.role.findMany({
    where: { isSystemRole: true },
    // --- MODIFIED LINE BELOW ---
    // We now include the permissions for each role in the initial fetch.
    include: {
        permissions: {
            select: {
                permission: {
                    select: { id: true } // We only need the permission ID
                }
            }
        }
    },
    orderBy: { name: 'asc' },
  });
};

/**
 * Retrieves a single system role by its ID, including its permissions.
 * @param roleId The ID of the system role to fetch.
 */
export const getSystemRole = async (roleId: string) => {
  // This function is already correct and needs no changes.
  return prisma.role.findFirst({
    where: { id: roleId, isSystemRole: true },
    include: {
      permissions: {
        select: {
          permission: true,
        },
      },
    },
  });
};

/**
 * Updates the permissions for a specific system role and invalidates
 * the tokens of all users affected by this change.
 */
export const updatePermissionsForRole = async (roleId: string, permissionIds: string[]) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role || !role.isSystemRole) {
    throw new Error('System role not found.');
  }

  // A transaction ensures the permission updates are atomic.
  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId: roleId } });
    if (permissionIds.length > 0) {
      await tx.rolePermission.createMany({
        data: permissionIds.map((pId: string) => ({
          roleId: roleId,
          permissionId: pId,
        })),
      });
    }
  });

  // --- NEW LOGIC: Invalidate tokens for all affected users ---
  // This is the crucial step that forces users on this plan to get a new token.
  try {
    // 1. Find the Subscription Plan that matches this system role by name
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { name: role.name },
      select: { id: true },
    });
    
    if (!plan) {
      logger.warn(`Could not find a subscription plan named "${role.name}" to bump token versions.`);
      return;
    }

    // 2. Find all subscriptions for that plan
    const subscriptions = await prisma.subscription.findMany({
      where: { planId: plan.id },
      select: { organizationId: true },
    });

    const organizationIds = subscriptions.map(sub => sub.organizationId);
    
    if (organizationIds.length === 0) {
        logger.info(`No organizations are subscribed to "${role.name}". No tokens to invalidate.`);
        return;
    }

    // 3. Increment the tokenVersion for ALL users in those organizations
    const updateResult = await prisma.user.updateMany({
      where: {
        organizationId: {
          in: organizationIds,
        },
      },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    logger.info(`Permissions changed for plan "${role.name}". Invalidated tokens for ${updateResult.count} users.`);

  } catch (error) {
    // Log this error but don't fail the whole request,
    // as the primary permission update was successful.
    logger.error(`Failed to increment token versions for roleId ${roleId}`, error);
  }
};
