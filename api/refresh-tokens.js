// Script to force logout and create fresh tokens with updated permissions
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function refreshUserTokens() {
  try {
    console.log('🔄 Refreshing user tokens to get updated permissions...');
    
    // Increment token version for all users to invalidate existing JWTs
    const result = await prisma.user.updateMany({
      data: {
        tokenVersion: {
          increment: 1
        }
      }
    });
    
    console.log(`✅ Invalidated tokens for ${result.count} users`);
    console.log('📝 Users will need to log in again to get fresh permissions');
    
  } catch (error) {
    console.error('❌ Error refreshing tokens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

refreshUserTokens();