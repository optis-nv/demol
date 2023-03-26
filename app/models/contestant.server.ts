import { prisma } from "~/db.server";

export const getContestants = () => {
  return prisma.contestant.findMany({
    orderBy: [{ eliminated: "asc" }, { name: "asc" }],
  });
};

export const getContestant = (id: string) => {
  return prisma.contestant.findUnique({
    where: { id },
  });
};
