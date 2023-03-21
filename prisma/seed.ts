import { PrismaClient } from "@prisma/client";
import { contestants, episodes } from "./seedData";

const prisma = new PrismaClient();

async function seed() {
  await Promise.all(
    contestants.map((contestant) =>
      prisma.contestant.create({
        data: { name: contestant },
      })
    )
  );

  await Promise.all(
    episodes.map((episode, idx) =>
      prisma.episode.create({
        data: { date: episode, title: `Episode ${idx + 1}` },
      })
    )
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
