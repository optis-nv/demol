import { prisma } from "~/db.server";

export const getEventLogs = () => {
  return prisma.eventLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
