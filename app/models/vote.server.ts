import type { Contestant, Vote } from "@prisma/client";
import type { User } from "~/auth.server";
import { prisma } from "~/db.server";
import { users } from "~/users";
import { getUserName } from "~/utils";
import { getContestants } from "./contestant.server";

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

const getVotesRemainingContestants = () => {
  return prisma.vote.findMany({
    where: { Contestant: { eliminated: false } },
  });
};

export const voteCountsRemainingContestants = async () => {
  const [votes, contestants] = await Promise.all([
    getVotesRemainingContestants(),
    getContestants(),
  ]);
  return votes
    .reduce((acc, vote) => {
      const contestantVotes = acc.find(
        (v) => v.contestantId === vote.contestantId
      );
      if (!contestantVotes) {
        return [
          ...acc,
          { contestantId: vote.contestantId || "", votes: [vote] },
        ];
      }
      return acc
        .filter((v) => v.contestantId !== vote.contestantId)
        .concat({
          contestantId: vote.contestantId || "",
          votes: [...contestantVotes.votes, vote],
        });
    }, [] as Array<{ contestantId: string; votes: Vote[] }>)
    .map(({ contestantId, votes }) => {
      const contestant = contestants.find((c) => c.id === contestantId);
      if (!contestant) throw new Error("no contestant found");
      return {
        contestant: contestant.name,
        votes: countVotesByUserId(votes),
      };
    });
};

const countVotesByUserId = (votes: Vote[]) => {
  const votesByUserId = votes
    .reduce((acc, current) => {
      const userVotes = acc.find((v) => v.userId === current.userId);
      if (!userVotes) {
        return acc.concat({ userId: current.userId, count: 1 });
      }
      return acc.map(({ userId, count }) => {
        if (userId !== current.userId) {
          return { userId, count };
        }
        return { userId, count: count + 1 };
      });
    }, [] as Array<{ userId: string; count: number }>)
    .map(({ count, userId }) => {
      const user = users.find((u) => u.id === userId);
      if (!user) throw new Error("user not found");
      return {
        count,
        user: user.name,
      };
    });
  // Don't know how to get toSorted() working with typescript :(
  votesByUserId.sort((a, b) => b.count - a.count);
  return votesByUserId.slice(0, 3);
};
