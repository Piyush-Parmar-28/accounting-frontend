import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import Icon from "./Icon";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  className?: string;
  default: number;
  items: { [key: string]: any }[];
  label?: string;

  onChange: (item: any) => void;
};

export default function SelectMenuProfile(props: Props) {
  const [selected, setSelected] = useState(props.items[props.default]);

  const onChange = (item: any) => {
    setSelected(item);
    props.onChange(item);
  };

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {props.label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative min-w-max w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                {selected.avatar ? (
                  <img
                    src={selected.avatar}
                    alt={selected.name}
                    className="flex-shrink-0 h-6 w-6 rounded-full"
                  />
                ) : (
                  <Icon
                    name={selected.icon}
                    className="text-gray-300 flex-shrink-0 h-6 w-6"
                  />
                )}
                <span className="ml-3 block truncate">{selected.name}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute z-10 mt-1 min-w-max w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {props.items.map((item, index) => (
                  <Listbox.Option
                    key={item.id || index}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-pointer select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {item.avatar ? (
                            <img
                              src={item.avatar}
                              alt=""
                              className="flex-shrink-0 h-6 w-6 rounded-full"
                            />
                          ) : (
                            <Icon
                              name={item.icon}
                              className="text-gray-300 flex-shrink-0 h-6 w-6"
                            />
                          )}
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {item.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
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
