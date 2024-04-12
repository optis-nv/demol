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
        data: { name: contestant, eliminated: false },
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
