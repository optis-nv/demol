import type { LoaderArgs, SerializeFrom } from "@remix-run/server-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getEventLogs } from "~/models/eventLog.server";
import Avatar from "./avatar";
import EventLogs from "./EventLog";
import type { EventLog } from "@prisma/client";
import { requireUser } from "~/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const events = await getEventLogs();
  return { events, user };
};

const toEvent = (event: SerializeFrom<EventLog>) => ({
  ...event,
  createdAt: new Date(event.createdAt),
});

export default function App() {
  const { events, user } = useLoaderData<typeof loader>();
  const initials = user.email.split(".")[0][0] + user.email.split(".")[1][0];
  return (
    <div className="flex-col">
      <div className="h-16  bg-gray-800">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <h1 className="ml-3 text-xl font-bold text-white">De Mol Poll</h1>
          <Avatar initials={initials.toUpperCase()} />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 p-4 py-10 md:flex-row">
        <Outlet />
        <EventLogs events={events.map(toEvent)} />
      </div>
    </div>
  );
}
