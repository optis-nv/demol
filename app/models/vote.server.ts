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
