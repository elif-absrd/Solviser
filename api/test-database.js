const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    // Test contract creation
    console.log('Creating test contract...');
    
    // First, let's see if we have an organization
    let org = await prisma.organization.findFirst();
    let user = await prisma.user.findFirst();
    
    if (!org) {
      console.log('Creating test organization...');
      org = await prisma.organization.create({
        data: {
          name: 'Test Organization'
        }
      });
    }
    
    if (!user) {
      console.log('Creating test user...');
      user = await prisma.user.create({
        data: {
          organizationId: org.id,
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: 'dummy_hash'
        }
      });
    }
    
    // Create a test contract
    const contract = await prisma.contract.create({
      data: {
        organizationId: org.id,
        createdById: user.id,
        contractTitle: 'Test Contract',
        contractType: 'service',
        buyerName: 'Test Buyer',
        contractValue: 10000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        industry: 'Technology'
      }
    });
    
    console.log('✅ Contract created successfully:', contract);
    
    // Test getting contracts
    const contracts = await prisma.contract.findMany({
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });
    
    console.log('✅ Found contracts:', contracts.length);
    contracts.forEach(contract => {
      console.log(`- ${contract.contractTitle} (${contract.status})`);
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();