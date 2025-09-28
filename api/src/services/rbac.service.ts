import prisma from '../prisma';
import { ApiError } from '../utils/ApiError';

// --- Permission Service ---
export const getAllPermissions = () => {
    return prisma.permission.findMany({
        orderBy: { actionName: 'asc' }
    });
};

// --- Role Services ---
export const getRolesByOrganization = (organizationId: string) => {
    return prisma.role.findMany({
        where: { organizationId },
        include: { _count: { select: { users: true } } } // Include how many users have this role
    });
};

export const createRoleForOrganization = async (organizationId: string, name: string, permissionIds: string[]) => {
    // --- THE FIX IS HERE ---
    // We add an `include` statement to ensure the returned data structure
    // is consistent with what our other functions return.
    return prisma.role.create({
        data: {
            name,
            organizationId,
            permissions: {
                create: permissionIds.map(id => ({
                    permission: { connect: { id } }
                }))
            }
        },
        include: {
            permissions: { include: { permission: true } },
            _count: { select: { users: true } }
        }
    });
};


export const getRoleDetails = async (roleId: string, organizationId: string) => {
    const role = await prisma.role.findFirst({
        where: { id: roleId, organizationId },
        include: { permissions: { include: { permission: true } } }
    });
    if (!role) {
        throw new ApiError('Role not found.', 404);
    }
    return role;
};

export const updateRoleDetails = async (roleId: string, organizationId: string, name: string, permissionIds: string[]) => {
    // Transaction to ensure atomicity
    return prisma.$transaction(async (tx) => {
        // First, verify the role belongs to the organization
        const role = await tx.role.findFirst({ where: { id: roleId, organizationId } });
        if (!role) {
            throw new ApiError('Role not found.', 404);
        }

        // Delete all existing permissions for this role
        await tx.rolePermission.deleteMany({
            where: { roleId }
        });

        // Create the new set of permissions and update the name
        const updatedRole = await tx.role.update({
            where: { id: roleId },
            data: {
                name,
                permissions: {
                    create: permissionIds.map(id => ({
                        permission: { connect: { id } }
                    }))
                }
            },
            include: { permissions: { include: { permission: true } } }
        });

        return updatedRole;
    });
};

export const deleteRoleFromOrganization = async (roleId: string, organizationId: string) => {
    // Verify the role belongs to the organization before deleting
    const role = await prisma.role.findFirst({ where: { id: roleId, organizationId } });
    if (!role) {
        throw new ApiError('Role not found.', 404);
    }
    await prisma.role.delete({ where: { id: roleId } });
};

// --- User & Role Assignment Services ---
export const getUsersByOrganization = (organizationId: string) => {
    return prisma.user.findMany({
        where: { organizationId },
        select: { id: true, name: true, email: true, roles: { select: { role: true } } }
    });
};

export const updateUserRoles = (userId: string, organizationId: string, roleIds: string[]) => {
    return prisma.$transaction(async (tx) => {
        // Verify the user belongs to the organization
        const user = await tx.user.findFirst({ where: { id: userId, organizationId } });
        if (!user) {
            throw new ApiError('User not found in this organization.', 404);
        }

        // Delete all existing roles for this user
        await tx.userRole.deleteMany({ where: { userId } });

        // Add the new roles
        await tx.userRole.createMany({
            data: roleIds.map(id => ({ userId, roleId: id }))
        });

        const updatedUser = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, roles: { select: { role: true } } }
        });
        
        return updatedUser;
    });
};
