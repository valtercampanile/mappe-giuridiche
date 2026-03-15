import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mappegiuridiche.it' },
    update: { role: 'ADMIN', name: 'Amministratore', passwordHash },
    create: {
      email: 'admin@mappegiuridiche.it',
      passwordHash,
      name: 'Amministratore',
      role: 'ADMIN',
      subscriptionTier: 'COMPLETE',
    },
  });

  console.log(`Admin creato: ${admin.email} (id: ${admin.id})`); // eslint-disable-line no-console
}

main()
  .catch((e) => {
    console.error('Errore:', e); // eslint-disable-line no-console
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
