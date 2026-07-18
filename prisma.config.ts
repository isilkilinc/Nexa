import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export default defineConfig({
  datasource: {
    // DIRECT_URL (port 5432) bypasses PgBouncer — required for Prisma CLI
    // commands like `db push` and `migrate`. Do NOT use the pooled URL here.
    url: process.env.DIRECT_URL as string,
  },
  migrations: {
    seed: 'dotenv -e .env -- npx tsx prisma/seed.ts',
  },
});
