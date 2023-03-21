import type { LoaderArgs } from "@remix-run/server-runtime";
import { authenticator } from "~/auth.server";

export const loader = ({ request }: LoaderArgs) => {
  return authenticator.authenticate("oauth2", request);
};
