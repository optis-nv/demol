import type { EventLog } from "@prisma/client";
import {
  FingerPrintIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { DateTime } from "luxon";

type EventTypes = "ANNOUNCEMENT" | "VOTE_CAST";

const icons = {
  ANNOUNCEMENT: FingerPrintIcon,
  VOTE_CAST: MagnifyingGlassIcon,
} as const;

export default function EventLogs({ events }: { events: EventLog[] }) {
  return (
    <div className="flow-root rounded border-2 border-green-100 bg-green-50 p-4">
      <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
        Tijdlijn
      </h2>
      <ul className="mt-4 -mb-8">
        {events.map((event, eventIdx) => {
          const EventIcon = icons[event.type as EventTypes];
          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={
                        "flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-white ring-8 ring-green-50"
                      }
                    >
                      <EventIcon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col pt-1.5">
                    <p className="text-sm text-gray-800">{event.data} </p>
                    <div className="whitespace-nowrap text-sm text-gray-500">
                      <time dateTime={event.createdAt.toLocaleDateString()}>
                        {DateTime.fromJSDate(event.createdAt).toRelative({
                          unit: ["days", "hours", "minutes"],
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
