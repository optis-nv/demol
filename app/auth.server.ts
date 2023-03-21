import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";
import invariant from "tiny-invariant";
import { sessionStorage } from "~/session.server";

type User = {
  sub: string;
  email: string;
  username: string;
};

export let authenticator = new Authenticator<User>(sessionStorage);

const {
  OAUTH2_AUTHORIZATIONURL,
  OAUTH2_TOKENURL,
  OAUTH2_CLIENTID,
  OAUTH2_CLIENTSECRET,
  OAUTH2_CALLBACKURL,
  OAUTH2_USERINFOURL,
} = process.env;

invariant(OAUTH2_AUTHORIZATIONURL, "OAUTH2_AUTHORIZATIONURL missing");
invariant(OAUTH2_TOKENURL, "OAUTH2_TOKENURL missing");
invariant(OAUTH2_CLIENTID, "OAUTH2_CLIENTID missing");
invariant(OAUTH2_CLIENTSECRET, "OAUTH2_CLIENTSECRET missing");
invariant(OAUTH2_CALLBACKURL, "OAUTH2_CALLBACKURL missing");
invariant(OAUTH2_USERINFOURL, "OAUTH2_USERINFOURL missing");

authenticator.use(
  new OAuth2Strategy(
    {
      authorizationURL: OAUTH2_AUTHORIZATIONURL,
      callbackURL: OAUTH2_CALLBACKURL,
      clientID: OAUTH2_CLIENTID,
      clientSecret: OAUTH2_CLIENTSECRET,
      tokenURL: OAUTH2_TOKENURL,
    },
    async ({ accessToken }) => {
      const response = await fetch(OAUTH2_USERINFOURL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const userData = await response.json();
      return userData;
    }
  ),
  "oauth2"
);

export async function requireUser(request: Request) {
  const user = await authenticator.isAuthenticated(request);
  if (user) return user;

  throw await authenticator.logout(request, { redirectTo: "/login" });
}
