import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";

type Props = {
  state?: any;
  headers?: any;
  toggleHeader?: (value: any) => void;
};

class ColumnsFilter extends React.Component<Props> {
  toggleHeader = (value: any) => {
    (this.props as any).toggleHeader(value);
  };

  render() {
    return (
      <>
        <div className="ml-4">
          <Menu
            as="div"
            className="relative float-right inline-block text-left"
          >
            <div>
              <Menu.Button className="inline-flex justify-center float-right rounded-md border border-gray-300 shadow-sm px-3 py-2 mt-1 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50">
                Columns
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right z-20 absolute right-0 mt-2 h-80 overflow-scroll min-w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <fieldset>
                  <div className="py-1">
                    {Object.keys(this.props.headers)?.map((header: any) => (
                      <Menu.Item key={header}>
                        {({ active }) => (
                          <p className="block relative items-start px-4 py-2 ">
                            <span
                              onClick={() =>
                                this.toggleHeader(this.props.headers[header])
                              }
                            >
                              <input
                                id={`header-${this.props.headers[header].id}`}
                                name={`header-${this.props.headers[header].name}`}
                                type="checkbox"
                                checked={
                                  this.props.headers[header].visible === true
                                }
                                className="h-4 w-4 mr-2 cursor-pointer text-indigo-600 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`header-${this.props.headers[header].id}`}
                                className="text-gray-700 select-none"
                              >
                                {this.props.headers[header].name}
                              </label>
                            </span>
                          </p>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </fieldset>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </>
    );
  }
}

export default ColumnsFilter;
