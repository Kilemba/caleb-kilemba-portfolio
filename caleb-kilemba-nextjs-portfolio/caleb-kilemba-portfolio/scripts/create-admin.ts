import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const [emailArg, passwordArg] = process.argv.slice(2);

if (!emailArg || !passwordArg) {
  console.error('Usage: npm run create-admin -- caleb@example.com "StrongPassword123!"');
  process.exit(1);
}

if (passwordArg.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(passwordArg, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: emailArg.toLowerCase() },
    update: { passwordHash },
    create: { email: emailArg.toLowerCase(), passwordHash, name: "Caleb Kilemba" }
  });
  console.log(`Admin ready: ${admin.email}`);
}

main().finally(() => prisma.$disconnect());
