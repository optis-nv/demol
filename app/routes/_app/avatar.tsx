import { Menu, Transition } from "@headlessui/react";
import { Form } from "@remix-run/react";
import { Fragment } from "react";
import { classNames } from "~/utils";

export default function Avatar({ initials }: { initials: string }) {
  return (
    <Menu as="div" className="relative mr-3">
      <div>
        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
            <span className="font-medium leading-none text-white">
              {initials}
            </span>
          </span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Form action="/logout" method="post">
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    "block w-full px-4 py-2 text-start text-sm text-gray-700",
                    active ? "bg-green-600 text-white" : ""
                  )}
                >
                  Afmelden
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Form>
      </Transition>
    </Menu>
  );
}
