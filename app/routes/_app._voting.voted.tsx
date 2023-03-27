import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "react-router";
import { getNextEpisode } from "~/models/episode.server";
import { getVoteForEpisode } from "~/models/vote.server";
import { requireUser } from "~/auth.server";

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
  return vote;
};

export default function Voted() {
  const vote = useLoaderData<typeof loader>();
  return (
    <main>
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        Dus jij denkt dat {vote?.Contestant?.name} de mol is?
      </h1>
      <h2 className="text-xl leading-tight tracking-tight text-gray-900">
        Bedankt voor je stem! Nog even afwachten voor we weten of je gelijk
        hebt.
      </h2>
      <img
        className="mt-4 max-w-sm"
        src={`/img/${vote?.Contestant?.name}.webp`}
        alt={vote?.Contestant?.name}
      />
    </main>
  );
}
