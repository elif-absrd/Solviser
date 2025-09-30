import { PrismaClient } from '@prisma/client';

// This is the standard way to declare a global Prisma Client instance in a development environment.
// It prevents multiple instances from being created by Next.js hot-reloading.
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

