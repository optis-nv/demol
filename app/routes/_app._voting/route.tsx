import type { LoaderArgs, SerializeFrom } from "@remix-run/server-runtime";
import { Outlet } from "@remix-run/react";
import type { EventLog } from "@prisma/client";
import { requireUser } from "~/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request);
  return null;
};

export const toEvent = (event: SerializeFrom<EventLog>) => ({
  ...event,
  createdAt: new Date(event.createdAt),
});

export default function App() {
  return <Outlet />;
}
