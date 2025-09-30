// Script to fix existing users who don't have the Free role assigned
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    console.log('🔍 Checking for users without roles...');
    
    // Find all users who don't have any roles assigned
    const usersWithoutRoles = await prisma.user.findMany({
      where: {
        roles: {
          none: {}
        }
      },
      include: {
        organization: {
          include: {
            subscription: {
              include: {
                plan: true
              }
            }
          }
        }
      }
    });
    
    console.log(`Found ${usersWithoutRoles.length} users without roles`);
    
    for (const user of usersWithoutRoles) {
      // Get the plan name from the user's organization subscription
      const planName = user.organization?.subscription?.plan?.name || 'Free';
      
      // Find the system role for this plan
      const systemRole = await prisma.role.findFirst({
        where: {
          name: planName,
          isSystemRole: true
        }
      });
      
      if (!systemRole) {
        console.log(`⚠️  No system role found for plan: ${planName}, defaulting to Free`);
        const freeRole = await prisma.role.findFirst({
          where: {
            name: 'Free',
            isSystemRole: true
          }
        });
        
        if (freeRole) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: freeRole.id
            }
          });
          console.log(`✅ Assigned Free role to user: ${user.email}`);
        }
      } else {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: systemRole.id
          }
        });
        console.log(`✅ Assigned ${planName} role to user: ${user.email}`);
      }
    }
    
    console.log('🎉 User role assignment complete!');
    
  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoles();