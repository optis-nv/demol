import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";

const client_id = process.env.OAUTH2_CLIENTID || "";
const logout_uri = process.env.OAUTH2_LOGOUTURL || "";
const baseUrl = process.env.OAUTH2_BASEURL || "";

export async function action() {
  const searchParams = new URLSearchParams({
    client_id,
    logout_uri,
  });
  return redirect(`${baseUrl}/logout?${searchParams.toString()}`);
}

export async function loader({ request }: LoaderArgs) {
  return logout(request);
}
