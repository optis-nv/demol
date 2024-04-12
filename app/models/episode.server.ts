import { prisma } from "~/db.server";

export const getNextEpisode = async () => {
  console.log(
    await prisma.episode.findFirst({
      where: {
        date: {
          gte: new Date(),
          lt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    })
  );
  console.log(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
  return prisma.episode.findFirst({
    where: {
      date: {
        gte: new Date(),
        lt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    },
  });
};
