import { prisma } from "~/db.server";

export const getNextEpisode = () => {
  return prisma.episode.findFirst({
    where: {
      date: {
        gte: new Date(),
        lt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    },
  });
};
