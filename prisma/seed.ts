import { PrismaClient } from "@prisma/client";
import { contestants, episodes } from "./seedData";

const prisma = new PrismaClient();

async function seed() {
  await prisma.contestant.deleteMany();
  await Promise.all(
    contestants.map((contestant) =>
      prisma.contestant.create({
        data: { name: contestant },
      })
    )
  );

  await prisma.episode.deleteMany();
  await Promise.all(
    episodes.map((episode, idx) =>
      prisma.episode.create({
        data: { date: episode, title: `Episode ${idx + 1}` },
      })
    )
  );

  await prisma.eventLog.deleteMany();
  await Promise.all(
    [
      {
        type: "ANNOUNCEMENT",
        data: "De show is begonnen! We gaan op zoek naar de mol!",
        createdAt: new Date(1679252400000),
      },
      {
        type: "ANNOUNCEMENT",
        data: "Ai, de eerste BV die meedoet aan de mol is ook meteen al de eerste die het spel moet verlaten. Volgende keer beter, Matteo!",
        createdAt: new Date(1679258100301),
      },
    ].map((data) => prisma.eventLog.create({ data }))
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
