import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  if (!process.env.DATABASE_URL) {
    console.error("[prisma.js] DATABASE_URL is not set!");
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma;

export default prisma;
