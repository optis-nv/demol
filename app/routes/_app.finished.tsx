import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { requireUser } from "~/auth.server";
import { voteCountsRemainingContestants } from "~/models/vote.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const voteCounts = await voteCountsRemainingContestants();
  return { voteCounts };
};

export default function () {
  const { voteCounts } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-3xl font-semibold">
        De app is uit de mouw! Comfort is de mol!
      </h1>
      <h3 className="mt-6 text-xl">Onze stemmen op Comfort:</h3>
      <div className="mt-2">
        {voteCounts.map(({ contestant, votes }) => {
          return (
            <div key={contestant} className="bg-white">
              <h4 className="text-lg font-medium underline">{contestant}</h4>
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
    </div>
  );
}
