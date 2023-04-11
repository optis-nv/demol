import { useActionData, useLoaderData } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import qs from "qs";
import { requireAdmin } from "~/auth.server";
import { getEventLogs } from "~/models/eventLog.server";
import EventLogs from "~/routes/_app._voting/EventLog";
import { toEvent } from "~/routes/_app._voting/route";
import { createEventLog } from "./createEventLog";

export const loader = async ({ request }: LoaderArgs) => {
  await requireAdmin(request);
  return { message: null, events: await getEventLogs(false) };
};

export const action = async ({ request }: ActionArgs) => {
  await requireAdmin(request);
  const formData = await request.text();
  const newEventLogData = qs.parse(formData);
  return createEventLog(newEventLogData);
};

export default function Admin() {
  const { events } = useLoaderData<typeof loader>();
  const { errors, formData } = useActionData<typeof action>() || {};
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const timeFormatter = new Intl.DateTimeFormat("nl-BE", {
    timeStyle: "short",
  });
  const time = timeFormatter.format(now);
  return (
    <div className="flex gap-6">
      <form className="w-1/2" method="post">
        <div className="space-y-4">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Mol bericht toevoegen
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                id="publication"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Publicatie
              </label>
              <div className="flex gap-2">
                <div>
                  <label
                    id="date"
                    className="block text-sm font-medium leading-6 text-gray-900"
                    htmlFor="date"
                  >
                    Datum
                  </label>
                  <input
                    name="date"
                    type="date"
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue={formData?.date || date}
                    aria-labelledby="publication date"
                  />
                </div>
                <div>
                  <label
                    id="time"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tijdstip
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue={formData?.time || time}
                    aria-labelledby="publication time"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bericht
              </label>
              <div className="mt-2">
                <textarea
                  id="message"
                  name="data"
                  rows={3}
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                  defaultValue={formData?.data || ""}
                />
              </div>
              {errors?.data &&
                errors.data._errors.map((error) => <p key={error}>{error}</p>)}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Bericht toevoegen
          </button>
        </div>
      </form>
      <div className="w-1/2">
        <EventLogs events={events.map(toEvent)} />
      </div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  return (
    <h1>Hey, jij bent geen admin. Jij kan hier dus niets komen doen 🤷‍♂️</h1>
  );
};
