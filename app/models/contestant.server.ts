import { prisma } from "~/db.server";

export const getContestants = () => {
  return prisma.contestant.findMany({
    orderBy: [{ eliminated: "asc" }, { name: "asc" }],
  });
};

export const getContestantsByIds = (ids: string[]) => {
  return prisma.contestant.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
