import { RadioGroup } from "@headlessui/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { redirect } from "react-router";
import { getContestants } from "~/models/contestant.server";
import { getNextEpisode } from "~/models/episode.server";
import { castVoteForEpisode, getVoteForEpisode } from "~/models/vote.server";
import { requireUser } from "~/auth.server";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Wie is de mol?" }];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const nextEpisode = await getNextEpisode();
  //TODO: No next episode
  if (!nextEpisode) {
    throw redirect("/finished");
  }
  const voteForNextEpisode = await getVoteForEpisode(nextEpisode.id, user.sub);
  if (voteForNextEpisode) {
    throw redirect("/voted");
  }
  return {
    nextEpisodeDate: nextEpisode.date,
    nextEpisodeTitle: nextEpisode.title,
    contestants: await getContestants(),
  };
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request);
  const nextEpisode = await getNextEpisode();
  if (!nextEpisode) {
    return { error: "No next episode" };
  }
  const formData = await request.formData();
  const contestantId = formData.get("contestant");
  if (!contestantId || typeof contestantId !== "string") {
    return { error: "You need to select a contestant to cast a vote." };
  }
  try {
    await castVoteForEpisode({
      episodeId: nextEpisode.id,
      contestantId: contestantId,
      userId: user.sub,
    });
    throw redirect("/voted");
  } catch (e) {
    return {
      error:
        "Could not cast vote. Maybe you are trying to hack the system? If you are convinced you should be able to cast a vote, please contact Kenneth.",
    };
  }
};

export default function Index() {
  const { nextEpisodeDate, nextEpisodeTitle, contestants } =
    useLoaderData<typeof loader>();
  const { error } = useActionData<typeof action>() || {};
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Let's vote for {nextEpisodeTitle}!
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-10 pt-5 sm:px-6 lg:px-8">
        <div className="rounded-md border-x-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Attention needed
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Votes must be submitted before{" "}
                  {new Date(nextEpisodeDate).toLocaleDateString()} -{" "}
                  {new Date(nextEpisodeDate).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Form action="?index" method="post" className="space-y-2">
          <RadioGroup name="contestant">
            <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
              Select a contestant
            </RadioGroup.Label>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4 md:grid-cols-2 lg:grid-cols-3">
              {contestants.map((contestant) => (
                <RadioGroup.Option
                  key={contestant.id}
                  value={contestant.id}
                  disabled={contestant.eliminated}
                  className={({ checked, active, disabled }) =>
                    classNames(
                      checked ? "border-transparent" : "border-gray-300",
                      active ? "border-indigo-600 ring-2 ring-indigo-600" : "",
                      disabled ? "border-red-200 bg-red-50" : "",
                      "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                    )
                  }
                >
                  {({ checked, active, disabled }) => (
                    <>
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <RadioGroup.Label
                            as="span"
                            className="block text-sm font-medium text-gray-900 "
                          >
                            <img
                              className={classNames(
                                "mr-2 inline-block h-24 w-24 rounded-lg",
                                disabled ? "opacity-50" : ""
                              )}
                              src={`/img/${contestant.name}.webp`}
                              alt=""
                            />
                            {contestant.name}
                          </RadioGroup.Label>
                        </span>
                      </span>
                      <CheckCircleIcon
                        className={classNames(
                          !checked ? "invisible" : "",
                          "h-5 w-5 text-indigo-600"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          active ? "border" : "border-2",
                          checked ? "border-indigo-600" : "border-transparent",
                          "pointer-events-none absolute -inset-px rounded-lg"
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          {error && <p className="text-red-700">{error}</p>}
          <button className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Cast my vote
          </button>
        </Form>
      </main>
    </div>
  );
}
