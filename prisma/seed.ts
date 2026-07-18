import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.request.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Owner
  const owner = await prisma.user.create({
    data: {
      name: 'Owner',
      email: 'owner@example.com',
      password: hashedPassword,
    },
  });

  // Create Requester
  const requester = await prisma.user.create({
    data: {
      name: 'Requester',
      email: 'requester@example.com',
      password: hashedPassword,
    },
  });

  // Create Listing
  const listing = await prisma.listing.create({
    data: {
      title: 'Looking for duo - ranked push',
      game: 'Valorant',
      description: 'Diamond looking for another Diamond/Ascendant for duo. Must have mic.',
      creatorId: owner.id,
    },
  });

  console.log('Seeding finished.');
  console.log('Created Users:', owner.name, requester.name);
  console.log('Created Listing:', listing.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
