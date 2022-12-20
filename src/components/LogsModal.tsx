import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import agent from "../agent";

// Redux mapping
import { connect, ConnectedProps } from "react-redux";
import { ADD_NOTIFICATION } from "../store/types";
import { formatDate, formatDateAndTime } from "../helpers/formatDate";
import MultiSelect from "./MultiSelect";
import SimpleDropdown from "./SimpleDropdown";
import Icon from "./Icon";
import ScrollToTopBottom from "./ScrollToTopBottom";

import useEffectAfterInitialRender from "../helpers/useEffectAfterInitialRender";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (title: string, message: string, type: string) =>
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        title,
        message,
        type,
      },
    }),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface LogsModalProps {
  type: string;
  showLogsModal: boolean;
  selectedRow: any;
  setOpen: (value: boolean) => void;
}

function LogsModal(props: LogsModalProps & PropsFromRedux) {
  console.log("logs modal");
  const { type, showLogsModal, selectedRow, setOpen } = props;
  console.log("props", props);
  const organisationId = (props as any).currentOrganisation._id;

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<string>("Newest First");
  const [logList, setLogList] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const chunkSize = 15;
  const [currPage, setCurrPage] = useState(0);
  const [displayRecords, setDisplayRecords] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const headers = ["Type", "From", "To", "Date", "User"];

  const getAccountLogs = () => {
    console.log("accountlog popup");
    console.log("selectedRow", selectedRow);
    console.log("workSpaceId", organisationId);
    setLoading(true);
    agent.Logs.getAccountLogs(organisationId, selectedRow._id)
      .then((response: any) => {
        console.log("response", response);
        const res =
          sorting === "Oldest First" ? response.data : response.data.reverse();
        setLogList(res);
        setTotalRecords(res.length);
        setDisplayRecords(res.slice(skip, chunkSize));
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        (props as any).addNotification(
          "Could not load Client Logs",
          err?.response?.data?.error || err?.message || err,
          "danger"
        );
      });
  };

  const getLogsList = () => {
    switch (type) {
      case "account":
        return getAccountLogs();

      default:
        return;
    }
  };

  const onKeyUpFunction = (e: any) => {
    if (e.keyCode === 27) {
      setOpen(false);
    }
  };

  useEffectAfterInitialRender(
    () => {
      console.log("useEffect");
      type !== "user" && getLogsList();
      closeButtonRef.current!.focus();
      document.addEventListener("keydown", onKeyUpFunction, false);
      return () => {
        document.removeEventListener("keydown", onKeyUpFunction, false);
      }; // eslint-disable-next-line
    },
    [],
    0
  );

  //   useEffect(() => {
  //     type === "user" && startDate && endDate && getLogsList();
  //   }, [startDate, endDate]);

  const handlePageClick = (data: any) => {
    let selected = data.selected;
    setCurrPage(selected);
    setSkip(selected * chunkSize);
  };

  useEffect(() => {
    setLogList(logList.reverse());
  }, [sorting]);

  useEffect(() => {
    setDisplayRecords(logList.slice(skip, skip + chunkSize));
  }, [skip, chunkSize, sorting, logList]);

  return (
    <>
      <Transition.Root show={showLogsModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => null}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <ScrollToTopBottom id="logs-modal">
              <div className="flex items-center justify-center min-h-[calc(100vh-.5rem)] p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-4 pb-6 mx-4 my-6 text-left overflow-hidden shadow-xl transform transition-all sm:px-6 sm:pt-6 min-w-[80%]">
                    <div className="flex justify-between pb-6">
                      <div className="rounded-md">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 capitalize">
                          Activity for '{selectedRow.name}'
                        </h2>
                      </div>
                      <div className="flex items-center gap-x-4">
                        {type === "user" && (
                          <div className="flex gap-4 items-center">
                            <label
                              htmlFor="startDate"
                              className="text-sm flex md:items-center gap-x-3 gap-y-1 flex-col md:flex-row"
                            >
                              Start Date
                              <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formatDate(startDate, true)}
                                onChange={(e) =>
                                  setStartDate(
                                    new Date(e.target.value).toISOString()
                                  )
                                }
                              />
                            </label>
                            <label
                              htmlFor="endDate"
                              className="text-sm flex md:items-center gap-x-3 gap-y-1 flex-col md:flex-row"
                            >
                              End Date
                              <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min={formatDate(startDate, true)}
                                value={formatDate(endDate, true)}
                                onChange={(e) =>
                                  setEndDate(
                                    new Date(e.target.value).toISOString()
                                  )
                                }
                              />
                            </label>
                          </div>
                        )}
                        <div className="relative flex items-center">
                          <span
                            style={{
                              transform:
                                sorting === "Newest First"
                                  ? "rotateX(180deg)"
                                  : "rotateX(0deg)",
                            }}
                            className={`absolute z-10 top-4 left-2 transition-transform duration-300`}
                          >
                            <Icon
                              name="sort"
                              className="h-4 w-4 fill-gray-600"
                            />
                          </span>

                          <SimpleDropdown
                            items={[
                              {
                                _id: "Newest First",
                                name: "Newest First",
                              },
                              {
                                _id: "Oldest First",
                                name: "Oldest First",
                              },
                            ]}
                            selected={{ name: sorting }}
                            onChange={(selected: any) => {
                              setSorting(selected.name);
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          ref={closeButtonRef}
                          className="block bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="bg-white shadow rounded-md sm:overflow-hidden">
                        <div className="flex flex-col">
                          <div id="table-scroll" className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      {headers.map((header, index) => (
                                        <th
                                          key={header}
                                          scope="col"
                                          className={`px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider`}
                                        >
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {!loading ? (
                                      totalRecords > 0 ? (
                                        displayRecords.map(
                                          (record: any, index: number) => {
                                            return record?.type === "add" ? (
                                              <tr
                                                key={record._id}
                                                className="bg-white"
                                              >
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-bold capitalize">
                                                  {`${type} Added`}
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                  {formatDateAndTime(
                                                    record?.createdAt
                                                  ) ?? "-"}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-bold capitalize">
                                                  {record?.userName ?? "-"}
                                                </td>
                                              </tr>
                                            ) : (
                                              <Fragment key={record._id}>
                                                {Object.keys(record?.logs).map(
                                                  (logKey, index) => {
                                                    return (
                                                      <tr
                                                        key={`${record?._id}-${logKey}`}
                                                        className={
                                                          index % 2 === 0
                                                            ? "bg-gray-50"
                                                            : "bg-white"
                                                        }
                                                      >
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-left capitalize">
                                                          {logKey} Updated
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 capitalize max-w-[25ch]">
                                                          <p
                                                            className="truncate"
                                                            title={
                                                              record?.logs[
                                                                logKey
                                                              ]?.from === true
                                                                ? "Active"
                                                                : record?.logs[
                                                                    logKey
                                                                  ]?.from ===
                                                                  false
                                                                ? "Inactive"
                                                                : record?.logs[
                                                                    logKey
                                                                  ]?.from ?? "-"
                                                            }
                                                          >
                                                            {record?.logs[
                                                              logKey
                                                            ]?.from === true
                                                              ? "Active"
                                                              : record?.logs[
                                                                  logKey
                                                                ]?.from ===
                                                                false
                                                              ? "Inactive"
                                                              : record?.logs[
                                                                  logKey
                                                                ]?.from ?? "-"}
                                                          </p>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-bold capitalize max-w-[25ch]">
                                                          <p
                                                            className="truncate"
                                                            title={
                                                              record?.logs[
                                                                logKey
                                                              ]?.to === true
                                                                ? "Active"
                                                                : record?.logs[
                                                                    logKey
                                                                  ]?.to ===
                                                                  false
                                                                ? "Inactive"
                                                                : record?.logs[
                                                                    logKey
                                                                  ]?.to ?? "-"
                                                            }
                                                          >
                                                            {record?.logs[
                                                              logKey
                                                            ]?.to === true
                                                              ? "Active"
                                                              : record?.logs[
                                                                  logKey
                                                                ]?.to === false
                                                              ? "Inactive"
                                                              : record?.logs[
                                                                  logKey
                                                                ]?.to ?? "-"}
                                                          </p>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                          {formatDateAndTime(
                                                            record?.updatedAt
                                                          ) ?? "-"}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-bold capitalize">
                                                          {record?.userName ??
                                                            "-"}
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )}
                                              </Fragment>
                                            );
                                          }
                                        )
                                      ) : totalRecords === 0 &&
                                        !endDate &&
                                        type === "user" ? (
                                        <div className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 w-full bg-white">
                                          Choose Start and End date to view
                                          Activity for user '{selectedRow.name}
                                          '.
                                        </div>
                                      ) : (
                                        <div className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 w-full bg-white">
                                          No Logs found.
                                        </div>
                                      )
                                    ) : (
                                      [...Array(5)].map((e, i) => (
                                        <tr
                                          key={`tr-${i}`}
                                          className="bg-white"
                                        >
                                          {[...Array(headers.length)].map(
                                            (e, i) => (
                                              <td
                                                key={`td-${i}`}
                                                className="px-2 py-3 whitespace-wrap text-sm font-medium text-gray-900"
                                              >
                                                <Skeleton />
                                              </td>
                                            )
                                          )}
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {totalRecords > chunkSize && (
                        <div className="bg-white px-4 pt-3 mt-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
                          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-gray-700">
                                Showing{" "}
                                <span className="font-medium">
                                  {currPage * chunkSize + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">
                                  {(currPage + 1) * chunkSize > totalRecords
                                    ? totalRecords
                                    : (currPage + 1) * chunkSize}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                  {totalRecords}
                                </span>{" "}
                                results
                              </p>
                            </div>
                          </div>
                          <div
                            id="pagination"
                            className="text-sm text-gray-500 my-2"
                          >
                            <ReactPaginate
                              previousLabel={"Previous"}
                              nextLabel={"Next"}
                              breakLabel={"..."}
                              breakClassName={"break-me"}
                              pageCount={Math.ceil(totalRecords / chunkSize)}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={2}
                              onPageChange={handlePageClick}
                              containerClassName={"pagination"}
                              activeClassName={"active"}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
										<button
											type="button"
											className="whitespace-nowrap w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
											onClick={() => setOpen(false)}
										>
											Cancel
										</button>
										<button
											type="button"
											disabled={loading}
											className="whitespace-nowrap mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
											onClick={getLogsList}
										>
											<span className="w-full flex justify-end">
												{loading ? (
													<Icon name="loading" className="mr-2" />
												) : null}
											</span>
											<span>Get Logs</span>
											<span className="w-full"></span>
										</button>
									</div> */}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </ScrollToTopBottom>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default connector(LogsModal);
