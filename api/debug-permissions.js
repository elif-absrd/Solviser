// Debug script to check user permissions
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUserPermissions() {
  try {
    console.log('🔍 Debugging user permissions...');
    
    // Get all users and their permissions
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    console.log(`\n📋 Found ${users.length} users:`);
    
    for (const user of users) {
      console.log(`\n👤 User: ${user.email}`);
      console.log(`   Organization: ${user.organizationId}`);
      console.log(`   Roles: ${user.roles.length}`);
      
      const allPermissions = new Set();
      user.roles.forEach(userRole => {
        console.log(`   - Role: ${userRole.role.name} (System: ${userRole.role.isSystemRole})`);
        userRole.role.permissions.forEach(rolePermission => {
          allPermissions.add(rolePermission.permission.actionName);
          console.log(`     * ${rolePermission.permission.actionName}`);
        });
      });
      
      console.log(`   📊 Total permissions: ${allPermissions.size}`);
      console.log(`   🎯 Has contract.view.all: ${allPermissions.has('contract.view.all')}`);
      console.log(`   ✅ Has contract.create: ${allPermissions.has('contract.create')}`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUserPermissions();