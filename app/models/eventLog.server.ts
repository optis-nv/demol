import type { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export const getEventLogs = (onlyPublished = true) => {
  return prisma.eventLog.findMany({
    where: {
      publishAt: {
        lte: onlyPublished ? new Date() : undefined,
      },
    },
    orderBy: {
      publishAt: "desc",
    },
  });
};

export const createEventLog = (newEventLog: Prisma.EventLogCreateInput) => {
  return prisma.eventLog.create({ data: newEventLog });
};
