// prisma.config.ts

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",

    // ✅ ADD THIS (this is what fixes your seed error)
    seed: "tsx prisma/seed.ts",
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
});