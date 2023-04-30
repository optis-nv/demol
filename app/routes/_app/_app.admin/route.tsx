import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { requireAdmin } from "~/auth.server";
import { createEventLog, getEventLogs } from "~/models/eventLog.server";
import EventLogs from "~/routes/_app._voting/EventLog";
import { toEvent } from "~/routes/_app._voting/route";

export const loader = async ({ request }: LoaderArgs) => {
  try {
    await requireAdmin(request);
  } catch (e) {
    return { message: (e as Error).message, events: [] };
  }
  return { message: null, events: await getEventLogs() };
};

export const action = async ({ request }: ActionArgs) => {
  await requireAdmin(request);
  const formData = await request.formData();
  const data = formData.get("message")?.toString();
  if (!data) {
    return { error: "message required" };
  }
  const newEventLog = {
    data,
    type: "ANNOUNCEMENT",
  };
  return createEventLog(newEventLog);
};

export default function Admin() {
  const { events } = useLoaderData<typeof loader>();
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
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bericht
              </label>
              <div className="mt-2">
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
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
