// Script to update Free role permissions to include contract.view.all
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateFreeRolePermissions() {
  try {
    console.log('🔧 Updating Free role permissions...');
    
    // Find the Free role
    const freeRole = await prisma.role.findFirst({
      where: {
        name: 'Free',
        isSystemRole: true
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
    
    if (!freeRole) {
      console.log('❌ Free role not found');
      return;
    }
    
    // Find the contract.view.all permission
    const contractViewPermission = await prisma.permission.findUnique({
      where: {
        actionName: 'contract.view.all'
      }
    });
    
    if (!contractViewPermission) {
      console.log('❌ contract.view.all permission not found');
      return;
    }
    
    // Check if the permission is already assigned
    const existingPermission = freeRole.permissions.find(
      rp => rp.permission.actionName === 'contract.view.all'
    );
    
    if (existingPermission) {
      console.log('✅ Free role already has contract.view.all permission');
      return;
    }
    
    // Add the permission to the Free role
    await prisma.rolePermission.create({
      data: {
        roleId: freeRole.id,
        permissionId: contractViewPermission.id
      }
    });
    
    console.log('✅ Added contract.view.all permission to Free role');
    
    // Show updated permissions for Free role
    const updatedRole = await prisma.role.findFirst({
      where: {
        name: 'Free',
        isSystemRole: true
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
    
    console.log('\n📋 Free role permissions:');
    updatedRole?.permissions.forEach(rp => {
      console.log(`  - ${rp.permission.actionName}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating Free role permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFreeRolePermissions();