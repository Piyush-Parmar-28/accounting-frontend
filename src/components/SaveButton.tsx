import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// main button on basis of state. So that if a uses a button that button will be showed by default
// add loading icon

export default function Example(props: any) {
  let buttonOptions: string[] = [];
  if (props.type === "save") {
    if (props.options.includes("new")) {
      buttonOptions.push("Save & New");
    }
    if (props.options.includes("close")) {
      buttonOptions.push("Save & Close");
    }
    if (props.options.includes("duplicate")) {
      buttonOptions.push("Save & Duplicate");
    }
    if (props.options.includes("print")) {
      buttonOptions.push("Save & Print");
    }
  }
  if (props.type === "update") {
    if (props.options.includes("new")) {
      buttonOptions.push("Update & New");
    }
    if (props.options.includes("close")) {
      buttonOptions.push("Update & Close");
    }
    if (props.options.includes("duplicate")) {
      buttonOptions.push("Update & Duplicate");
    }
    if (props.options.includes("print")) {
      buttonOptions.push("Update & Print");
    }
  }
  const [selected, setSelected] = useState(buttonOptions[0]);

  // change default option (this is useful as when edit page is opened, the page type is updated after second render, so if below useeffect is not there, on edit page, it shows default option as save & new)
  useEffect(() => {
    setSelected(buttonOptions[0]);
  }, [props.type]);

  const onChangeHandler = (e: any) => {
    setSelected(e);
  };

  const handleButtonClick = (option: any) => {
    props.onButtonClick(option);
  };

  return (
    <Listbox value={selected} onChange={onChangeHandler}>
      {({ open }) => (
        <>
          <div className="relative">
            <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
              <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
                <div className="inline-flex items-center rounded-l-md border border-transparent bg-indigo-500 py-2 pl-3 pr-4 text-white shadow-sm">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  <button
                    className="ml-2"
                    onClick={() => handleButtonClick(selected)}
                  >
                    {selected}
                  </button>
                  {/* <p className="ml-2.5 text-sm font-medium">{selected.title}</p> */}
                </div>
                <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-500 p-2 text-sm font-medium text-white hover:bg-indigo-600 ">
                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {buttonOptions
                  .filter((option) => option !== selected)
                  .map((option) => (
                    <Listbox.Option
                      key={option}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-500" : "text-gray-900",
                          "cursor-default select-none p-4 text-sm"
                        )
                      }
                      value={option}
                      onClick={() => handleButtonClick(option)}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p
                              className={
                                selected
                                  ? "font-semibold -my-2"
                                  : "font-normal -my-2"
                              }
                            >
                              {option}
                            </p>
                            {selected ? (
                              <span
                                className={
                                  active ? "text-white" : "text-indigo-500"
                                }
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
