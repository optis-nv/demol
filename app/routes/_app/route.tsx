import { Outlet } from "@remix-run/react";
import { Fragment } from "react";
import Avatar from "./avatar";

export default function App() {
  return (
    <Fragment>
      <div className="flex h-16 items-center justify-between bg-gray-800">
        <h1 className="ml-3 text-xl font-bold text-white">Wie wordt de mol?</h1>
        <Avatar />
      </div>
      <Outlet />
    </Fragment>
  );
}
