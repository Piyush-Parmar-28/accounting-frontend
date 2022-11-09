import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Icon from "./Icon";

const projects = [
  {
    id: 1,
    name: "Tag",
    icon: "outline/document-text",
    action: "ADD_TAG_MODAL",
  },
  {
    id: 2,
    name: "Status",
    icon: "outline/settings",
    action: "ADD_STATUS_MODAL",
  },

  {
    id: 3,
    name: "Contact Person",
    icon: "outline/settings",
    action: "ADD_PERSON_MODAL",
  },

  {
    id: 4,
    name: "Custom Field",
    icon: "outline/settings",
    action: "ADD_CUSTOM_FIELD_MODAL",
  },

  {
    id: 5,
    name: "Client Group",
    icon: "outline/settings",
    action: "ADD_GROUP_MODAL",
  },
  {
    id: 6,
    name: "Todo",
    icon: "outline/document-text",
    action: "ADD_TODO_MODAL",
  }

  // More projects...
];

const SearchNavigation = ({
  openModalHandler,
}: {
  openModalHandler: (modalName: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [rawQuery, setRawQuery] = useState("");

  const query = rawQuery.toLowerCase().replace(/^[#>]/, "");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(query)
  );

  const optionClickHandler = (modalName: string) => {
    setOpen(false);
    openModalHandler(modalName);
  };

  return (
    <>
      <div
        className="mt-1 w-72 relative rounded-md shadow-sm"
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="solid/search" className="h-5 w-5 text-gray-400" />
        </div>
        <input
          disabled={true}
          type="text"
          className="disabled cursor-pointer block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Search..."
        />
      </div>
      <Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => setRawQuery("")}
        appear
      >
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto sm:mt-0 mt-10 max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox value="" onChange={(e) => console.log(e)}>
                  <div className="relative">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 outline-none placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      onChange={(e) => setRawQuery(e.target.value)}
                    />
                  </div>

                  {query === "" ? (
                    <Combobox.Options
                      static
                      className="max-h-80 scroll-py-10 scroll-py-10 scroll-pb-2 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                    >
                      <ul className="-mx-4 mt-1 text-sm text-gray-700">
                        {projects.map((project) => (
                          <Combobox.Option
                            key={project.id}
                            value={project}
                            className={
                              "flex cursor-default select-none items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            }
                            onClick={() => optionClickHandler(project.action)}
                          >
                            <>
                              <Icon
                                name={project.icon}
                                className={"h-6 w-6 flex-none text-gray-400"}
                                aria-hidden="true"
                              />
                              <span className="ml-3 flex-auto text-gray-800 truncate">
                                {project.name}
                              </span>
                            </>
                          </Combobox.Option>
                        ))}
                      </ul>
                    </Combobox.Options>
                  ) : (
                    <Combobox.Options
                      static
                      className="max-h-80 scroll-py-10 scroll-py-10 scroll-pb-2 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                    >
                      <ul className="-mx-4 mt-1 text-sm text-gray-700">
                        {filteredProjects.length === 0 ? (
                          <div className="py-4 px-6 text-center text-sm sm:px-14">
                            <Icon
                              name="warning"
                              className="mx-auto h-7 w-7 text-gray-400"
                              aria-hidden="true"
                            />
                            <p className="mt-4 font-semibold text-gray-900">
                              No results found
                            </p>
                            <p className="mt-2 text-gray-500">
                              We couldn't find anything with that term. Please
                              try again.
                            </p>
                          </div>
                        ) : (
                          filteredProjects.map((project) => (
                            <Combobox.Option
                              key={project.id}
                              value={project}
                              className={
                                "flex cursor-default select-none items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              }
                              onClick={() => optionClickHandler(project.action)}
                            >
                              <>
                                <Icon
                                  name={project.icon}
                                  className={"h-6 w-6 flex-none text-gray-400"}
                                  aria-hidden="true"
                                />
                                <span className="ml-3 flex-auto text-gray-800 truncate">
                                  {project.name}
                                </span>
                              </>
                            </Combobox.Option>
                          ))
                        )}
                      </ul>
                    </Combobox.Options>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SearchNavigation;
