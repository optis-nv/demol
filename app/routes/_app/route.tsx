import type { SerializeFrom } from "@remix-run/server-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getEventLogs } from "~/models/eventLog.server";
import Avatar from "./avatar";
import EventLogs from "./EventLog";
import type { EventLog } from "@prisma/client";

export const loader = async () => {
  const events = await getEventLogs();
  return { events };
};

const toEvent = (event: SerializeFrom<EventLog>) => ({
  ...event,
  createdAt: new Date(event.createdAt),
});

export default function App() {
  const { events } = useLoaderData<typeof loader>();
  return (
    <div className="h-full flex-col">
      <div className="flex h-16 items-center justify-between bg-gray-800">
        <h1 className="ml-3 text-xl font-bold text-white">Wie wordt de mol?</h1>
        <Avatar />
      </div>
      <div className="flex flex-col justify-between gap-2 py-10 md:flex-row">
        <Outlet />
        <EventLogs events={events.map(toEvent)} />
      </div>
    </div>
  );
}
