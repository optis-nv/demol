import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";

export async function action() {
  const searchParams = new URLSearchParams({
    client_id: "3b2usd3kkqgmg3h1ia7m803iu1",
    logout_uri: "http://localhost:3000/logout",
  });
  return redirect(
    `https://optis.auth.eu-west-1.amazoncognito.com/logout?${searchParams.toString()}`
  );
}

export async function loader({ request }: LoaderArgs) {
  return logout(request);
}
