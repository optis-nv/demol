import { RadioGroup } from "@headlessui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { redirect } from "react-router";
import { getContestant, getContestants } from "~/models/contestant.server";
import { getNextEpisode } from "~/models/episode.server";
import { castVoteForEpisode, getVoteForEpisode } from "~/models/vote.server";
import { requireUser } from "~/auth.server";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "~/utils";

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
    return { error: "Aflevering niet gevonden" };
  }
  const formData = await request.formData();
  const contestantId = formData.get("contestant");
  if (!contestantId || typeof contestantId !== "string") {
    return { error: "Je moet een deelnemer selecteren om te stemmen" };
  }
  const contestant = await getContestant(contestantId);
  if (!contestant) {
    return { error: "Deelnemer niet gevonden" };
  }
  try {
    await castVoteForEpisode({
      episodeId: nextEpisode.id,
      contestant,
      user,
    });
  } catch (e) {
    return {
      error:
        "De stem kon niet worden geregistreerd. Misschien ben je het systeem aan het hacken? Als je zeker bent dat je zou moeten kunnen stemmen, gelieve Kenneth dan te contacteren.",
    };
  }
  throw redirect("/voted");
};

export default function Index() {
  const { nextEpisodeDate, nextEpisodeTitle, contestants } =
    useLoaderData<typeof loader>();
  const { error } = useActionData<typeof action>() || {};
  const deadlineDate = new Date(nextEpisodeDate).toLocaleDateString("nl", {
    dateStyle: "long",
  });
  const deadlineTime = new Date(nextEpisodeDate).toLocaleTimeString("nl", {
    timeStyle: "short",
  });
  const warningMessage = `Je stem voor de volgende aflevering moet uiterlijk ${deadlineDate} om ${deadlineTime} ingediend zijn.`;

  return (
    <div>
      <main className="space-y-10 pt-5">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Breng je stem uit voor {nextEpisodeTitle.toLocaleLowerCase()}
        </h1>
        <div className="rounded-md border-x-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Opgelet!</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{warningMessage}</p>
              </div>
            </div>
          </div>
        </div>
        <Form action="?index" method="post" className="space-y-2">
          <RadioGroup name="contestant">
            <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
              Selecteer de mol
            </RadioGroup.Label>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:gap-x-4 lg:grid-cols-2">
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
                            className="flex flex-col text-sm font-medium text-gray-900"
                          >
                            <img
                              className={classNames(
                                "mr-2 w-full rounded-lg object-cover",
                                disabled ? "opacity-50" : ""
                              )}
                              src={`/img/${contestant.name}.jpg`}
                              alt=""
                            />
                            <span className="text-md pt-4 text-center font-medium text-gray-900">
                              {contestant.name}
                            </span>
                          </RadioGroup.Label>
                        </span>
                      </span>
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
          <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Breng mijn stem uit
          </button>
        </Form>
      </main>
    </div>
  );
}
