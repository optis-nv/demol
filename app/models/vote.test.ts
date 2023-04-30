import type { Vote } from "@prisma/client";
import type * as dbType from "~/db.server";
import { vi } from "vitest";
import { voteCountsRemainingContestants } from "./vote.server";

const vote = ({
  contestantId,
  userId,
}: {
  contestantId: string;
  userId: string;
}): Vote => {
  return {
    contestantId,
    userId,
    createdAt: new Date(),
    episodeId: "randomEpisode",
    id: "randomid",
  };
};

test("vote counts remaining contestants returns sorted user vote counts by contestant", async () => {
  const { prisma } = await vi.importMock<typeof dbType>("~/db.server");
  vi.spyOn(prisma.vote, "findMany").mockResolvedValue([
    vote({ contestantId: "1", userId: "2" }),
    vote({ contestantId: "1", userId: "1" }),
    vote({ contestantId: "1", userId: "1" }),
    vote({ contestantId: "2", userId: "1" }),
    vote({ contestantId: "2", userId: "1" }),
    vote({ contestantId: "2", userId: "3" }),
    vote({ contestantId: "2", userId: "3" }),
    vote({ contestantId: "3", userId: "1" }),
  ]);
  const result = await voteCountsRemainingContestants();
  expect(result).toEqual([
    {
      contestantId: "1",
      votes: [
        { userId: "1", count: 2 },
        { userId: "2", count: 1 },
      ],
    },
    {
      contestantId: "2",
      votes: [
        { userId: "1", count: 2 },
        { userId: "3", count: 2 },
      ],
    },
    { contestantId: "3", votes: [{ userId: "1", count: 1 }] },
  ]);
});
