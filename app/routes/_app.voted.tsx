import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/server-runtime";
import { redirect } from "react-router";
import { getNextEpisode } from "~/models/episode.server";
import { getVoteForEpisode } from "~/models/vote.server";
import { requireUser } from "~/auth.server";

export const meta: V2_MetaFunction = () => [{ title: "Thanks for voting!" }];

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
    <header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Thanks for voting!
        </h1>
        <h2 className="text-xl leading-tight tracking-tight text-gray-900">
          This week you voted for {vote?.Contestant?.name}!
        </h2>
        <img
          className="mt-4 max-w-sm"
          src={`/img/${vote?.Contestant?.name}.webp`}
          alt=""
        />
      </div>
    </header>
  );
}
