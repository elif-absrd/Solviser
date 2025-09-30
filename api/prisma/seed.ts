// File: apps/api/prisma/seed.ts

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// This defines all possible permissions in the application. Correct.
const permissions = [
  { actionName: 'dashboard.view', description: 'Can view the main dashboard' },
  { actionName: 'user.read', description: 'Can view the list of users in the organization' },
  { actionName: 'user.invite', description: 'Can invite new users to the organization' },
  { actionName: 'user.delete', description: 'Can remove users from the organization' },
  { actionName: 'user.update.role', description: 'Can change the custom roles assigned to a user' },
  { actionName: 'role.read', description: 'Can view custom roles and their permissions' },
  { actionName: 'role.create', description: 'Can create new custom roles' },
  { actionName: 'role.update', description: 'Can edit existing custom roles' },
  { actionName: 'role.delete', description: 'Can delete custom roles' },
  { actionName: 'billing.manage', description: 'Can manage the organization\'s subscription and payment methods' },
  { actionName: 'contract.create', description: 'Can create new smart contracts' },
  { actionName: 'contract.view.all', description: 'Can view all contracts in the organization' },
  { actionName: 'risk_report.view', description: 'Can view AI Risk Reports' },
  { actionName: 'admin.organization.manage', description: 'Can approve or delete customer organizations' },
  { actionName: 'legal.onboarding', description: 'Can access and submit the legal service provider onboarding form' },
  { actionName: 'legal.view', description: 'Can access legal service providers organization\'s' },
];

// This hardcoded object correctly defines the INITIAL permissions for each plan's system role.
const planPermissions: { [key: string]: string[] } = {
    Free: ['dashboard.view', 'contract.create', 'contract.view.all', 'risk_report.view'],
    Starter: ['dashboard.view', 'contract.create', 'contract.view.all', 'risk_report.view', 'user.read'],
    Growth: ['dashboard.view', 'contract.create', 'contract.view.all', 'risk_report.view', 'user.read', 'user.invite'],
    "Business Pro": ['dashboard.view', 'contract.create', 'contract.view.all', 'risk_report.view', 'user.read', 'user.invite', 'user.delete', 'user.update.role', 'role.read', 'role.create', 'role.update', 'role.delete'],
    Enterprise: ['dashboard.view', 'contract.create', 'contract.view.all', 'risk_report.view', 'user.read', 'user.invite', 'user.delete', 'user.update.role', 'role.read', 'role.create', 'role.update', 'role.delete', 'billing.manage'],
};

// Your subscription plan definitions. Correct.
const plans = [
    { name: "Free", priceInr: 0, razorpayPlanId: null, isFree: true, features: JSON.stringify({ list: ["AI Risk Engine (5 checks/month)", "Smart Contracts (2/month)", "Basic Buyer Verification"], bestFor: "Ideal for individuals and freelancers starting out.", limits: { riskChecks: 5, contracts: 2 } }) },
    { name: "Starter", priceInr: 1191100, razorpayPlanId: "plan_RFag5aeyGUt6Dj", isFree: false, features: JSON.stringify({ list: ["AI Risk Engine (200 checks/Year)", "Smart Contracts (20/Year)", "Basic Ecommerce Store (limited products)", "Buyer Verification (Basic)", "Community Support"], bestFor: "Best for freelancers, consultants, micro-businesses" }) },
    { name: "Growth", priceInr: 2392300, razorpayPlanId: "plan_RFagQlJRwPfJQJ", isFree: false, features: JSON.stringify({ list: ["AI Risk Engine (700 checks/Year)", "Smart Contracts (75/Year)", "Advanced Ecommerce Store", "Centralized Buyer Blocklist Access", "Basic ERP Modules (Accounting + Inventory)", "Verified Buyers & Suppliers Network (Standard)", "Email & Chat Support"], bestFor: "Best for small & mid-size MSMEs" }) },
    { name: "Business Pro", priceInr: 3493400, razorpayPlanId: "plan_RFagmPiUchK3FP", isFree: false, features: JSON.stringify({ list: ["AI Risk Engine (1,500 checks/Year)", "Smart Contracts (200/Year)", "Full Ecommerce Suite", "Advanced ERP Modules (Inventory, Accounting, Payroll, Taxation)", "Verified Buyers & Suppliers Network (Premium)", "Third-Party Integrations (GST, MCA, Tally, Zoho, Busy, Vyapar)", "Financial & Legal Assistance (Basic)", "Priority Support"], bestFor: "Best for growing enterprises & multi-location businesses" }) },
    { name: "Enterprise", priceInr: 4994900, razorpayPlanId: "plan_RFahCAzuDb6R3s", isFree: false, features: JSON.stringify({ list: ["Unlimited AI Risk Checks", "Unlimited Smart Contracts", "Complete Ecommerce + ERP Suite", "Buyer/Supplier Network (Enterprise Tier)", "Advanced Financial & Legal Integrations", "API Access for Custom Development", "Government Schemes & Funding Advisory", "Dedicated Account Manager", "24/7 Priority Support"], bestFor: "Best for large corporations, associations & clusters" }) }
];

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. Seed Permissions ---
  // Using createMany without skipDuplicates for SQLite compatibility
  try {
    await prisma.permission.createMany({ data: permissions });
  } catch (error) {
    // Ignore unique constraint errors on re-run
    console.log('Permissions may already exist, continuing...');
  }
  const allPermissions = await prisma.permission.findMany();
  console.log(`✅ ${allPermissions.length} permissions are in the database.`);

  // --- 2. Seed Subscription Plans ---
  // Using upsert ensures that plans are created or updated safely.
  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: { priceInr: plan.priceInr, razorpayPlanId: plan.razorpayPlanId, isFree: plan.isFree, features: plan.features as any },
      create: { name: plan.name, priceInr: plan.priceInr, razorpayPlanId: plan.razorpayPlanId, isFree: plan.isFree, features: plan.features as any },
    });
  }
  console.log(`✅ ${plans.length} subscription plans have been seeded.`);
  
  // --- 3. Seed System Roles for Subscription Tiers ---
  // This correctly creates a "system role" for each plan.
  console.log('Seeding system roles for subscription plans...');
  const adminOrg = await prisma.organization.upsert({ where: { name: 'Solviser Admin' }, update: {}, create: { name: 'Solviser Admin' } });

  for (const [planName, planPerms] of Object.entries(planPermissions)) {
      const permissionsToConnect = allPermissions.filter(p => planPerms.includes(p.actionName));
      
      const role = await prisma.role.upsert({
          where: { organizationId_name: { organizationId: adminOrg.id, name: planName } },
          update: { isSystemRole: true }, // Ensure flag is set on update
          create: { name: planName, organizationId: adminOrg.id, isSystemRole: true },
      });

      // This "delete and recreate" pattern is a robust way to ensure the seed is the source of truth.
      await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
      await prisma.rolePermission.createMany({
          data: permissionsToConnect.map(p => ({ roleId: role.id, permissionId: p.id })),
      });
  }
  console.log('✅ System roles for subscription plans created and permissioned.');

  // --- 4. Seed Super Admin User ---
  // This section correctly sets up your super admin with all available permissions.
  console.log('Seeding Super Admin user...');
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'password';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  
  const superAdminRole = await prisma.role.upsert({
      where: { organizationId_name: { organizationId: adminOrg.id, name: 'Super Admin' } },
      update: {},
      create: { name: 'Super Admin', organizationId: adminOrg.id, isSystemRole: true }
  });
  
  await prisma.rolePermission.deleteMany({ where: { roleId: superAdminRole.id } });
  await prisma.rolePermission.createMany({ data: allPermissions.map(p => ({ roleId: superAdminRole.id, permissionId: p.id })) });
  
  const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { isSuperAdmin: true },
      create: {
          name: 'Solviser Admin', email: adminEmail, passwordHash, organizationId: adminOrg.id, isOwner: true, isSuperAdmin: true
      },
  });

  await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: superAdminRole.id },
  });
  
  console.log(`✅ Super Admin ${adminUser.email} seeded with all permissions.`);
  console.log(`🏁 Seeding finished.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });