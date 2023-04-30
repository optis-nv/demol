import type { LoaderArgs } from "@remix-run/server-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import Avatar from "./avatar";
import { requireUser } from "~/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  return { user };
};

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  const initials = user.email.split(".")[0][0] + user.email.split(".")[1][0];
  return (
    <>
      <div className="h-16 bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="ml-3 text-xl font-bold text-white">
            Wie wordt de mol?
          </h1>
          <Avatar initials={initials.toUpperCase()} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl p-4 py-10">
        <Outlet />
      </div>
    </>
  );
}
