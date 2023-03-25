import type { Contestant } from "@prisma/client";
import type { User } from "~/auth.server";
import { prisma } from "~/db.server";
import { getUserName } from "~/utils";

export const getVoteForEpisode = (episodeId: string, userId: string) => {
  return prisma.vote.findFirst({
    where: {
      episodeId,
      userId,
    },
    include: {
      Contestant: true,
    },
  });
};

export const castVoteForEpisode = ({
  episodeId,
  user,
  contestant,
}: {
  episodeId: string;
  user: User;
  contestant: Contestant;
}) => {
  return prisma.$transaction([
    prisma.vote.create({
      data: {
        episodeId,
        userId: user.sub,
        contestantId: contestant.id,
      },
    }),
    prisma.eventLog.create({
      data: {
        type: "VOTE_CAST",
        data: `${getUserName(user)} stemde deze week op ${contestant.name}.`,
      },
    }),
  ]);
};
