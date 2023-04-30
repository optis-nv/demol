import type { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export const getEventLogs = () => {
  return prisma.eventLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createEventLog = (newEventLog: Prisma.EventLogCreateInput) => {
  return prisma.eventLog.create({ data: newEventLog });
};
