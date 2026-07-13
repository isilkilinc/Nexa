import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    // DIRECT_URL bypasses PgBouncer — required for CLI commands (db push, migrate).
    url: process.env.DIRECT_URL as string,
  },
});
