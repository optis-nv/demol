import { Outlet, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { Fragment } from "react";
import { getContestantsByIds } from "~/models/contestant.server";
import { getNextEpisode } from "~/models/episode.server";
import { getVoteCountsForEpisode } from "~/models/vote.server";
import Avatar from "./avatar";
import Votes from "./votes";

export let loader = async () => {
  const nextEpisode = await getNextEpisode();
  //TODO: No next episode
  if (!nextEpisode) {
    throw redirect("/finished");
  }
  const votes = await getVoteCountsForEpisode(nextEpisode.id);
  const contestants = await getContestantsByIds(
    votes?.map((v) => v.contestantId)
  );
  return votes.map((vote) => ({
    count: vote._count,
    contestant: contestants.find((c) => c.id === vote.contestantId)?.name,
  }));
};

export default function App() {
  const votes = useLoaderData<typeof loader>();
  console.log(votes);
  return (
    <Fragment>
      <div className="flex h-16 items-center justify-between bg-gray-800">
        <h1 className="ml-3 text-xl font-bold text-white">Wie wordt de mol?</h1>
        <Avatar />
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col md:flex-row">
        <div className="basis-1/2 items-center justify-center">
          <Outlet />
        </div>
        <div className="basis-1/2 items-center justify-center">
          <Votes votes={votes} />
        </div>
      </div>
    </Fragment>
  );
}
