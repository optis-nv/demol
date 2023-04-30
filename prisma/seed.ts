import { PrismaClient } from "@prisma/client";
import {
  contestants as contestantsData,
  episodes as episodesData,
} from "./seedData";
import { users } from "~/users";

const prisma = new PrismaClient();

function random(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seed() {
  await prisma.contestant.deleteMany();
  const contestants = await Promise.all(
    contestantsData.map((contestant, idx) =>
      prisma.contestant.create({
        data: { name: contestant, eliminated: idx > 3 ? true : false },
      })
    )
  );
  const getRandomContestant = () => {
    return contestants[random(0, contestants.length - 1)];
  };

  await prisma.episode.deleteMany();
  const episodes = await Promise.all(
    episodesData.map((episode, idx) =>
      prisma.episode.create({
        data: { date: episode, title: `Episode ${idx + 1}` },
      })
    )
  );

  for (let i = 0; i < 6; i++) {
    await Promise.all(
      new Array(10).fill(null).map((_, index) => {
        return prisma.vote.create({
          data: {
            userId: users[index].id,
            Contestant: {
              connect: {
                id: getRandomContestant().id,
              },
            },
            episode: {
              connect: {
                id: episodes[i].id,
              },
            },
          },
        });
      })
    );
  }

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
