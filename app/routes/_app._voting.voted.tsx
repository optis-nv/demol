import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "react-router";
import { getNextEpisode } from "~/models/episode.server";
import {
  getVoteForEpisode,
  voteCountsRemainingContestants,
} from "~/models/vote.server";
import { requireUser } from "~/auth.server";
import { getEventLogs } from "~/models/eventLog.server";
import EventLogs from "./_app._voting/EventLog";
import { toEvent } from "./_app._voting/route";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const nextEpisode = await getNextEpisode();
  //TODO: No next episode
  if (!nextEpisode) {
    throw redirect("/finished");
  }
  const vote = await getVoteForEpisode(nextEpisode.id, user.sub);
  if (!vote) {
    throw redirect("/");
  }
  const events = await getEventLogs();
  const voteCounts = await voteCountsRemainingContestants();
  return { vote, voteCounts, events };
};

export default function Voted() {
  const { vote, voteCounts, events } = useLoaderData<typeof loader>();
  return (
    <div className="w-full">
      <img src="/img/groep.png" alt="groep" className="mx-auto w-1/2" />
      <div className="flex flex-col justify-between gap-2 md:flex-row">
        <div className="flex flex-col">
          <main>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Dus jij denkt dat {vote?.Contestant?.name} de mol is?
            </h1>
            <h2 className="text-xl leading-tight tracking-tight text-gray-900">
              Bedankt voor je stem! Nog even afwachten voor we weten of je
              gelijk hebt.
            </h2>
            <img
              className="mt-4 max-w-sm"
              src={`/img/${vote?.Contestant?.name}.jpg`}
              alt={vote?.Contestant?.name}
            />
          </main>
          <aside className="mt-8">
            <h3 className="text-center text-xl">
              Hoe hebben we voorlopig gestemd op de resterende kandidaten?
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-4 divide-x-2 text-center">
              {voteCounts.map(({ contestant, votes }) => {
                return (
                  <div key={contestant}>
                    <h4 className="text-lg font-medium underline">
                      {contestant}
                    </h4>
                    <ul>
                      {votes.map((vote) => (
                        <li key={vote.user}>
                          {vote.user} - {vote.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
        <EventLogs events={events.map(toEvent)} />
      </div>
    </div>
  );
}
