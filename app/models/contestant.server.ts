import { prisma } from "~/db.server";

export const getContestants = () => {
  return prisma.contestant.findMany({
    orderBy: [{ eliminated: "asc" }, { name: "asc" }],
  });
};
