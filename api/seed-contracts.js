// Script to seed some sample contracts
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleContracts = [
  {
    contractTitle: "Textile Supply Agreement",
    contractType: "Supply Agreement",
    buyerName: "Textile Manufacturer, Ludhiana",
    buyerGstNumber: "03ABCTY1234D1Z5",
    buyerRegisteredAddress: "Industrial Area, Phase-II, Ludhiana, Punjab 141003",
    contractValue: 1000000,
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-09-15'),
    status: "at_risk",
    termsAndClauses: "Payment terms: 30 days from delivery. Quality specifications as per sample approved.",
    riskScore: 41,
    industry: "Textiles"
  },
  {
    contractTitle: "Software Development Contract",
    contractType: "Service Agreement",
    buyerName: "Tech Solutions Ltd, Bengaluru",
    buyerGstNumber: "29ABCDE1234F1Z6",
    buyerRegisteredAddress: "Electronic City, Bengaluru, Karnataka 560100",
    contractValue: 2550000,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: "active",
    termsAndClauses: "Milestone-based payments. Source code delivery at project completion.",
    riskScore: 87,
    industry: "Technology"
  },
  {
    contractTitle: "Agricultural Equipment Supply",
    contractType: "Purchase Order",
    buyerName: "Agro Industries, Gujarat",
    buyerGstNumber: "24ABCFG1234H1Z7",
    buyerRegisteredAddress: "GIDC Industrial Estate, Ankleshwar, Gujarat 393002",
    contractValue: 725000,
    startDate: new Date('2025-02-10'),
    endDate: new Date('2025-05-10'),
    status: "in_renewal",
    termsAndClauses: "Equipment warranty: 2 years. Installation and training included.",
    riskScore: 63,
    industry: "Agriculture"
  },
  {
    contractTitle: "Manufacturing Services Contract",
    contractType: "Manufacturing Agreement",
    buyerName: "Auto Parts Manufacturing Co",
    buyerGstNumber: "06ABCHI1234J1Z8",
    buyerRegisteredAddress: "Industrial Area, Gurgaon, Haryana 122001",
    contractValue: 1500000,
    startDate: new Date('2025-01-20'),
    endDate: new Date('2025-07-20'),
    status: "active",
    termsAndClauses: "Quality control as per ISO standards. Monthly delivery schedule.",
    riskScore: 75,
    industry: "Manufacturing"
  },
  {
    contractTitle: "Consulting Services Agreement",
    contractType: "Service Agreement",
    buyerName: "Business Consulting Firm",
    buyerGstNumber: "27ABCJK1234L1Z9",
    buyerRegisteredAddress: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    contractValue: 450000,
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-09-30'),
    status: "completed",
    termsAndClauses: "Weekly reporting required. Confidentiality agreement in place.",
    riskScore: 28,
    industry: "Consulting"
  }
];

async function seedContracts() {
  try {
    console.log('🌱 Seeding sample contracts...');
    
    // Get the first organization and user
    const org = await prisma.organization.findFirst();
    const user = await prisma.user.findFirst();
    
    if (!org || !user) {
      console.log('❌ No organization or user found. Please run the main seed script first.');
      return;
    }
    
    // Create contracts
    for (const contractData of sampleContracts) {
      await prisma.contract.create({
        data: {
          ...contractData,
          organizationId: org.id,
          createdById: user.id
        }
      });
    }
    
    console.log(`✅ Successfully seeded ${sampleContracts.length} contracts!`);
    
    // Display summary
    const contractCounts = await prisma.contract.groupBy({
      by: ['status'],
      _count: { status: true }
    });
    
    console.log('\n📊 Contract Summary:');
    contractCounts.forEach(item => {
      console.log(`  ${item.status}: ${item._count.status} contracts`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding contracts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedContracts();