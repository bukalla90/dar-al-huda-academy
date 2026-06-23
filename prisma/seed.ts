import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main(): Promise<void> {
  console.log("🌱 Seeding database...");
  console.log("DATABASE_URL =", process.env.DATABASE_URL);

  const passwordHash = await hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin user created successfully");
  console.log("Username:", adminUser.username);
  console.log("Password: admin123");
}

main()
  .then(async () => {
    console.log("🎉 Database seeding completed");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seeding failed:");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });