import { Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import Icon from "../Icon";

type Props = {
  startImport?: () => void;
  setOpen?: (open: boolean) => void;
  state?: any;
};

class ImportModal extends React.Component<Props> {
  state: {
    showIgnore: boolean;
    showError: boolean;
    showWarning: boolean;
    current: any;
    tabs: any;
  };
  constructor(props: Props) {
    super(props);

    this.state = {
      showIgnore: false,
      showError: false,
      showWarning: false,
      current: "1",
      tabs: [],
    };
  }

  showIgnoreDiv = () => {
    this.setState({ showIgnore: !this.state.showIgnore });
  };

  showErrorDiv = () => {
    this.setState({ showError: !this.state.showError });
  };

  showWarningDiv = () => {
    this.setState({ showWarning: !this.state.showWarning });
  };

  startImport = () => {
    (this.props as any).startImport();
  };

  setOpen = (open: boolean) => {
    this.setState({
      showIgnore: false,
      showError: false,
      showWarning: false,
    });
    (this.props as any).setOpen(open);
  };

  tabChange = (tab: any) => {
    this.setState({
      current: tab,
      showIgnore: false,
      showError: false,
      showWarning: false,
    });
  };

  classNames = (...classes: any[]) => {
    return classes?.filter(Boolean).join(" ");
  };

  componentDidMount = () => {
    this.setState({
      current: "1",
    });
  };

  componentDidUpdate = (prevProps: any) => {
    if ((this.props as any) !== prevProps)
      this.setState({
        tabs: Object.keys((this.props as any).state.merge)?.map(
          (keyName: any) => {
            return keyName;
          },
          {}
        ),
        current: this.state.tabs.length > 0 ? this.state.tabs[0] : "1",
      });
  };

  render() {
    return (
      <div>
        <Transition.Root
          show={(this.props as any).state.showModal}
          as={Fragment}
        >
          <Dialog
            as="div"
            static
            className="fixed z-10 inset-0 overflow-y-auto"
            onClose={() => this.setOpen(false)}
          >
            {(this.props as any).state.showModal ? (
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block bg-gray-100 rounded-lg overflow-hidden shadow-xl transform transition-all py-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="py-5 bg-gray-100 px-4 border-gray-200 sm:px-6">
                      <Dialog.Title
                        as="h3"
                        className="text-left text-lg leading-6 font-medium text-gray-900"
                      >
                        Conorganisation Import
                      </Dialog.Title>
                    </div>

                    <div className="mx-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow">
                      {this.state.tabs?.length > 1 ? (
                        <div className="bg-white px-4 pt-5 border-b border-gray-200 sm:px-6">
                          <h3 className="text-lg float-left leading-6 font-medium text-indigo-700">
                            {" "}
                            Select Sheet
                          </h3>
                          <br />
                          <div className="pb-5 sm:pb-0">
                            <div className="sm:hidden">
                              <select
                                id="current-tab"
                                name="current-tab"
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:border-indigo-500 sm:text-sm rounded-md"
                                defaultValue={this.state.tabs.find(
                                  (tab: any) => tab.current
                                )}
                              >
                                {this.state.tabs.map((tab: any) => (
                                  <option key={tab}>Sheet {tab}</option>
                                ))}
                              </select>
                            </div>
                            <div className="hidden sm:block mt-5">
                              <nav className="-mb-px flex space-x-8">
                                {this.state.tabs.map((tab: any) => (
                                  <button
                                    key={tab}
                                    onClick={() => {
                                      this.tabChange(tab);
                                    }}
                                    className={this.classNames(
                                      tab === this.state.current
                                        ? "border-indigo-500 text-indigo-600 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                                        : "border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-200 whitespace-nowrap pb-4 px-1 border-b font-medium text-sm",
                                      "inline-flex items-center text-base font-medium rounded-md text-gray-700 bg-white focus:outline-none"
                                    )}
                                  >
                                    Sheet {tab}
                                  </button>
                                ))}
                              </nav>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      <dl className="text-left divide-y divide-gray-200">
                        <div className="py-4 sm:py-5 sm:px-6">
                          <dt className="text-base font-normal text-gray-900">
                            Success Lines
                            <div className="flex items-baseline text-2xl font-semibold text-green-600">
                              {(this.props as any).state.merge[
                                this.state.current
                              ]?.successLineCount
                                ? (this.props as any).state.merge[
                                    this.state.current
                                  ].successLineCount
                                : 0}
                            </div>
                          </dt>
                        </div>
                        <div
                          onClick={this.showWarningDiv}
                          className={
                            (this.props as any).state.merge[this.state.current]
                              ?.warningLineCount > 0
                              ? "py-4 border-b sm:py-5 sm:px-6 cursor-pointer"
                              : "py-4 border-b sm:py-5 sm:px-6 "
                          }
                        >
                          <dt className="text-base font-normal text-gray-900">
                            Warning Lines
                            <div className="flex justify-between items-baseline text-2xl font-semibold text-yellow-600">
                              <span>
                                {(this.props as any).state.merge[
                                  this.state.current
                                ]?.warningLineCount
                                  ? (this.props as any).state.merge[
                                      this.state.current
                                    ].warningLineCount
                                  : 0}
                                <span className="ml-2 text-sm font-medium text-gray-500"></span>
                              </span>
                              {(this.props as any).state.merge[
                                this.state.current
                              ]?.warningLineCount > 0 ? (
                                this.state.showWarning ? (
                                  <ChevronUpIcon
                                    className="-mr-1 ml-2 h-5 w-5 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronDownIcon
                                    className="-mr-1 ml-2 h-5 w-5 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                )
                              ) : null}
                            </div>
                          </dt>
                          {(this.props as any).state.merge[this.state.current]
                            ?.warningLines ? (
                            <div
                              className={
                                this.state.showWarning
                                  ? "text-sm mt-5 text-gray-500"
                                  : "truncate h-0"
                              }
                            >
                              {Object.keys(
                                (this.props as any).state.merge[
                                  this.state.current
                                ].warningLines
                              ).map((keyName: any, keyIndex: any) => {
                                return (
                                  <div key={keyIndex}>
                                    <span className="text-yellow-600 font-medium">
                                      {keyName}
                                    </span>
                                    <p className="grid grid-cols-6 my-3">
                                      {(this.props as any).state.merge[
                                        this.state.current
                                      ].warningLines[keyName].map(
                                        (rows: any, index: number) => {
                                          return (
                                            <span key={index}>{rows}</span>
                                          );
                                        }
                                      )}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                        <div
                          onClick={this.showIgnoreDiv}
                          className={
                            (this.props as any).state.merge[this.state.current]
                              ?.ignoreLineCount > 0
                              ? "py-4 border-b sm:py-5 sm:px-6 cursor-pointer"
                              : "py-4 border-b sm:py-5 sm:px-6 "
                          }
                        >
                          <dt className="text-base font-normal text-gray-900">
                            Ignore Lines
                            <div className="flex justify-between items-baseline text-2xl font-semibold text-yellow-600">
                              <span>
                                {(this.props as any).state.merge[
                                  this.state.current
                                ]?.ignoreLineCount
                                  ? (this.props as any).state.merge[
                                      this.state.current
                                    ].ignoreLineCount
                                  : 0}
                              </span>
                              {(this.props as any).state.merge[
                                this.state.current
                              ]?.ignoreLineCount > 0 ? (
                                this.state.showIgnore ? (
                                  <ChevronUpIcon
                                    className="-mr-1 ml-2 h-5 w-5 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronDownIcon
                                    className="-mr-1 ml-2 h-5 w-5 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                )
                              ) : null}
                            </div>
                          </dt>
                          {(this.props as any).state.merge[this.state.current]
                            ?.ignoreLines ? (
                            <div
                              className={
                                this.state.showIgnore
                                  ? "text-sm mt-5 text-gray-500"
                                  : "truncate h-0"
                              }
                            >
                              {Object.keys(
                                (this.props as any).state.merge[
                                  this.state.current
                                ].ignoreLines
                              ).map((keyName: any, keyIndex: any) => {
                                return (
                                  <div key={keyIndex}>
                                    <span className="text-yellow-600 font-medium">
                                      {keyName}
                                    </span>
                                    <p className="grid grid-cols-6 my-3">
                                      {(this.props as any).state.merge[
                                        this.state.current
                                      ].ignoreLines[keyName].map(
                                        (rows: any, index: number) => {
                                          return (
                                            <span key={index}>{rows}</span>
                                          );
                                        }
                                      )}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                        <div
                          onClick={this.showErrorDiv}
                          className={
                            (this.props as any).state.merge[this.state.current]
                              ?.errorLineCount > 0
                              ? "py-4 border-b sm:py-5 sm:px-6 cursor-pointer"
                              : "py-4 border-b sm:py-5 sm:px-6 "
                          }
                        >
                          <dt className="text-base font-normal text-gray-900">
                            Error Lines
                            <div className="flex justify-between items-baseline text-2xl font-semibold text-red-700">
                              <span>
                                {(this.props as any).state.merge[
                                  this.state.current
                                ]?.errorLineCount
                                  ? (this.props as any).state.merge[
                                      this.state.current
                                    ].errorLineCount
                                  : 0}
                              </span>
                              {(this.props as any).state.merge[
                                this.state.current
                              ]?.errorLineCount > 0 ? (
                                this.state.showError ? (
                                  <ChevronUpIcon
                                    className="-mr-1 ml-2 h-5 w-5 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ChevronDownIcon
                                    className="-mr-1 ml-2 h-5 w-5 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                )
                              ) : null}
                            </div>
                          </dt>
                          {(this.props as any).state.merge[this.state.current]
                            ?.errorLines ? (
                            <div
                              className={
                                this.state.showError
                                  ? "text-sm mt-5 text-gray-500"
                                  : "truncate h-0"
                              }
                            >
                              {Object.keys(
                                (this.props as any).state.merge[
                                  this.state.current
                                ].errorLines
                              ).map((keyName: any, keyIndex: any) => {
                                return (
                                  <div key={keyIndex}>
                                    <span className="text-red-700 font-medium">
                                      {keyName}
                                    </span>
                                    <p className="grid grid-cols-6 my-3">
                                      {(this.props as any).state.merge[
                                        this.state.current
                                      ].errorLines[keyName].map(
                                        (rows: any, index: number) => {
                                          return (
                                            <span key={index}>{rows}</span>
                                          );
                                        }
                                      )}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      </dl>
                    </div>
                    <>
                      {(this.props as any).state.merge[this.state.current]
                        ?.errorLineCount > 0 ? (
                        <p className="text-xs text-red-700 float-left mx-5 my-3">
                          * A file consisting errors cannot be imported. Please
                          fix the errors and try again.
                        </p>
                      ) : null}
                      <div className="pt-5 bg-gray-100 px-4 border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          disabled={
                            (this.props as any).state.merge[this.state.current]
                              ?.errorLineCount > 0
                          }
                          className={
                            !(
                              (this.props as any).state.merge[
                                this.state.current
                              ]?.errorLineCount > 0
                            )
                              ? "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                              : "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-300 cursor-not-allowed text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                          }
                          onClick={this.startImport}
                        >
                          {(this.props as any).state.logging ? (
                            <Icon name="loading" />
                          ) : null}
                          Import
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => this.setOpen(false)}
                          ref={null}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  </div>
                </Transition.Child>
              </div>
            ) : null}
          </Dialog>
        </Transition.Root>
      </div>
    );
  }
}

export default ImportModal;
