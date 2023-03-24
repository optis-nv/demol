import { prisma } from "~/db.server";

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

export const getVoteCountsForEpisode = (episodeId: string) => {
  return prisma.vote.groupBy({
    by: ["contestantId"],
    where: {
      episodeId,
    },
    _count: true,
    orderBy: {
      _count: { contestantId: "desc" },
    },
  });
};

export const castVoteForEpisode = ({
  episodeId,
  userId,
  contestantId,
}: {
  episodeId: string;
  userId: string;
  contestantId: string;
}) => {
  return prisma.vote.create({
    data: {
      episodeId,
      userId,
      contestantId,
    },
  });
};
