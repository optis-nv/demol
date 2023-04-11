import type { LoaderArgs, SerializeFrom } from "@remix-run/server-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getEventLogs } from "~/models/eventLog.server";
import EventLogs from "./EventLog";
import type { EventLog } from "@prisma/client";
import { requireUser } from "~/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  const events = await getEventLogs();
  return { events };
};

export const toEvent = (event: SerializeFrom<EventLog>) => ({
  ...event,
  createdAt: new Date(event.createdAt),
  publishAt: new Date(event.publishAt),
});

export default function App() {
  const { events } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col justify-between gap-2 md:flex-row">
      <Outlet />
      <EventLogs events={events.map(toEvent)} />
    </div>
  );
}
