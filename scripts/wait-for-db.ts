import { PrismaClient } from '@prisma/client';

/**
 * Block until the database accepts connections. Used by `npm run setup` after
 * `db:up` — SQL Server takes 10-30s to become ready after the container starts.
 */
async function main() {
  const timeoutMs = Number(process.env.DB_WAIT_TIMEOUT_MS ?? 120_000);
  const deadline = Date.now() + timeoutMs;
  const prisma = new PrismaClient({ log: [] });

  process.stdout.write('Waiting for the database');

  for (;;) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      process.stdout.write(' ready.\n');
      await prisma.$disconnect();
      return;
    } catch (err) {
      if (Date.now() > deadline) {
        process.stdout.write('\n');
        console.error(`Database not ready within ${timeoutMs}ms.`);
        console.error(err instanceof Error ? err.message : err);
        await prisma.$disconnect();
        process.exit(1);
      }
      process.stdout.write('.');
      await new Promise((r) => setTimeout(r, 2_000));
    }
  }
}

void main();
