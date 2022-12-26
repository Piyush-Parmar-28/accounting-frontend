import React, { Fragment, useEffect } from "react";
// Import to Display skeleton while loading data
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// Pagination
import ReactPaginate from "react-paginate";
import { connect, ConnectedProps } from "react-redux";
// Routing imports
// Link backend
import agent from "../../agent";
// Dashboard import
import Dashboard from "../../components/Dashboard";
// Icons and styling
import Icon from "../../components/Icon";
// Redux Notify
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";
import { convertDateToString } from "../../helpers/Convertdate";

import TagManager from "react-gtm-module";
import { Menu, Transition } from "@headlessui/react";

import DeleteModal from "../../components/DeleteModal";

import { withRouter } from "../../helpers/withRouter";
import { compose } from "redux";

import useEffectAfterInitialRender from "../../helpers/useEffectAfterInitialRender";
import { string } from "prop-types";
import { useNavigate } from "react-router-dom";
import { downloadFile } from "../../helpers/downloadFile";

const tagManagerArgs = {
  dataLayer: {
    userId: "001",
    userProject: "TaxAdda",
    page: "gsts",
  },
  dataLayerName: "PageDataLayer",
};

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
  onNotify: (title: string, message: string, type: string) =>
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

function EntriesList(props: PropsFromRedux) {
  const navigate = useNavigate();
  const [pageType, setPageType] = React.useState("");

  const pageURL = (props as any).location.pathname.split("/");
  useEffect(() => {
    if (pageURL[2] === "journal-entry") {
      setPageType("journal-entry");
    }
  }, [pageURL]);

  const currentYear = (props as any).currentYear;

  // Chunk Size for number of table data displayed in each page during pagination
  let chunkSize = 10;
  // Selected pagination value
  let currPage = 0;

  interface state {
    loading: boolean;
    posX: any;
    posY: any;
    hoverX: any;
    hoverY: any;
    showBackDrop: boolean;
    searchText: string;
    entries: any;
    totalRecords: number;
    displayEntryDetails: any;
    selectedEntries: any;
    modalOpen: boolean;
    typingTimeout: any;
    selectedRow: any;
    showDeleteModal: boolean;
    showLogModal: boolean;
    pageTotal: number;
    total: number;
    skip: number;
    limit: number;
    sortBy: string;
  }

  let inititalState = {
    loading: false,
    posX: null,
    posY: null,
    hoverX: null,
    hoverY: null,
    showBackDrop: false,
    searchText: "",
    entries: [],
    totalRecords: 0,
    displayEntryDetails: [],
    selectedEntries: [],
    modalOpen: false,
    typingTimeout: 0,
    selectedRow: undefined,
    showDeleteModal: false,
    showLogModal: false,
    pageTotal: 0,
    total: 0,
    skip: 0,
    limit: chunkSize,
    sortBy: "dateAsc",
  };

  const [state, setState] = React.useState<state>(inititalState);

  //Get Organisation Data

  const getEntriesList = (forSearch: boolean, searchText = "") => {
    const organisationId = (props as any).params?.organisationId;
    const year = (props as any).currentYear;

    let skip = state.skip;
    let limit = state.limit;
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    if (!organisationId) {
      (props as any).onNotify(
        "Could not load Organisation Details",
        "",
        "danger"
      );
      return;
    }

    if (currentYear === undefined) {
      return;
    }

    agent.JournalEntry.journalentrylist(
      organisationId,
      year,
      skip,
      limit,
      false,
      state.sortBy,

      searchText
    )
      .then((response: any) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          displayEntryDetails: response.jounralEntries,
          totalRecords: response.count,
          entries: response.jounralEntries,
          pageTotal: response.pageTotal,
          total: response.total,
        }));
      })
      .catch((err: any) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));

        (props as any).onNotify(
          "Could not load Organisation Details1",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  const downloadEntriesList = () => {
    const organisationId = (props as any).params?.organisationId;
    const year = (props as any).currentYear;

    let searchText = state.searchText || "";
    let skip = state.skip;
    let limit = state.limit;
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    if (!organisationId) {
      (props as any).onNotify(
        "Could not load Organisation Details",
        "",
        "danger"
      );
      return;
    }

    agent.JournalEntry.journalentrylist(
      organisationId,
      year,
      skip,
      limit,
      true,
      state.sortBy,
      searchText
    )
      .then((response: any) => {
        downloadFile(response, `Journal Entries - ${year}.xlsx`);
        (props as any).onNotify(
          "Download",
          "Report has been successfully exported in excel",
          "success"
        );
      })
      .catch((err: any) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));

        (props as any).onNotify(
          "Could not load Organisation Details1",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  useEffectAfterInitialRender(
    () => {
      getEntriesList(false);
    },
    [(props as any).currentYear],
    0
  );

  // useEffectAfterInitialRender(
  //   () => {
  //     getEntriesList(false);
  //   },
  //   [(props as any).location.pathname],
  //   1
  // );

  useEffectAfterInitialRender(
    () => {
      getEntriesList(false);
    },
    [(props as any).currentModal],
    1
  );

  useEffectAfterInitialRender(
    () => {
      setState((prevState) => ({
        ...prevState,
        searchText: "",
      }));

      getEntriesList(false);
    },
    [(props as any).params?.organisationId],
    1
  );

  useEffectAfterInitialRender(
    () => {
      getEntriesList(false);
    },
    [state.skip],
    1
  );
  useEffectAfterInitialRender(
    () => {
      getEntriesList(false);
    },
    [state.sortBy],
    1
  );

  const handlePageClick = (data: any) => {
    currPage = data.selected;

    setState((prevState) => ({
      ...prevState,
      skip: currPage * chunkSize,
      limit: chunkSize,
    }));
  };

  const onActionClick = (e: any) => {
    const screenClosness = window.innerHeight - e.clientY;
    const positionY = screenClosness < 125 ? e.clientY - 125 : e.clientY;
    setState((prevState) => ({
      ...prevState,
      posX: e.clientX,
      posY: positionY,
      showBackDrop: true,
    }));
  };

  const onDropdownClick = () => {
    setState((prevState) => ({
      ...prevState,
      showBackDrop: false,
    }));
  };

  const handleSearchTextChange = (ev: any) => {
    if (state.typingTimeout) {
      clearTimeout(state.typingTimeout);
    }

    setState((prevState) => ({
      ...prevState,
      searchText: ev.target.value,
      typingTimeout: setTimeout(() => {
        getEntriesList(true, ev.target.value);
      }, 700),
    }));
  };

  const openLogModal = (account: any) => {
    setState((prevState) => ({
      ...prevState,
      selectedRow: account,
      showBackDrop: false,
    }));

    logModalSetOpen(true);
  };
  const logModalSetOpen = (open: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showLogModal: open,
    }));
  };

  const openDeleteModal = (entry: any[]) => {
    setState((prevState) => ({
      ...prevState,
      selectedRow: entry,
      showBackDrop: false,
    }));

    deleteModalSetOpen(true);
  };

  const deleteModalSetOpen = (open: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showDeleteModal: open,
    }));
  };

  const editEntryNavigateFunction = (entry: any) => {
    navigate(
      `/${(props as any).params?.organisationId}/${
        (props as any).currentYear
      }/journal-entry/edit/${entry._id}`
    );
  };

  const handleSortOrderChange = (e: any) => {
    const value = e.target.value;
    let newValue = "";
    if (value === "Date Ascending") {
      newValue = "dateAsc";
    }
    if (value === "Date Descending") {
      newValue = "dateDesc";
    }
    if (value === "Amount Ascending") {
      newValue = "amountAsc";
    }
    if (value === "Amount Descending") {
      newValue = "amountDesc";
    }
    setState((prevState) => ({
      ...prevState,
      sortBy: newValue,
    }));
  };

  const onEntryCheckBoxChange = (entry: any) => {
    const { selectedEntries } = state;

    const clientIndex = selectedEntries.findIndex(
      (c: any) => c._id === entry._id
    );

    if (clientIndex === -1) {
      setState((prevState: any) => {
        return {
          ...prevState,
          selectedEntries: [...selectedEntries, entry],
        };
      });
    } else {
      const removeClient = selectedEntries.filter(
        (c: any) => c._id !== entry._id
      );
      setState((prevState: any) => {
        return {
          ...prevState,
          selectedEntries: removeClient,
        };
      });
    }
  };

  const onSelectAllEntry = () => {
    const { displayEntryDetails, selectedEntries } = state;
    if (selectedEntries.length === displayEntryDetails.length) {
      setState((prevState: any) => {
        return {
          ...prevState,
          selectedEntries: [],
        };
      });
    } else {
      setState((prevState: any) => {
        return {
          ...prevState,
          selectedEntries: displayEntryDetails,
        };
      });
    }
  };

  return (
    <Dashboard>
      <div className="gsts">
        {state.showDeleteModal && (
          <DeleteModal
            type={"journalentry"}
            state={state}
            onLoad={getEntriesList}
            deleteModalSetOpen={deleteModalSetOpen}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Journal Entries
          </h1>
        </div>
        <div className="px-4 sm:px-6 md:px-8 grid grid-cols-12 gap-4 mt-6">
          <div className="w-fit col-span-2">
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              onClick={() =>
                navigate(
                  `/${(props as any).params.organisationId}/${
                    (props as any).currentYear
                  }/journal-entry/add`
                )
              }
            >
              <Icon name="add" className="h-4 w-4 mr-2" />
              Add New
            </button>
          </div>

          {(state.totalRecords > 0 || state.searchText.length > 0) && (
            <div className="col-span-3">
              <input
                id="name"
                name="name"
                type="text"
                value={state.searchText}
                placeholder="Search by Account Name or Amount"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
                onChange={handleSearchTextChange}
              />
            </div>
          )}

          {(state.totalRecords > 0 || state.searchText.length > 0) && (
            <div className="col-span-2">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                onClick={() => downloadEntriesList()}
              >
                Download as xlsx
              </button>
            </div>
          )}
          {(state.totalRecords > 0 || state.searchText.length > 0) && (
            <div className="col-span-2">
              <button
                type="button"
                className={
                  state.selectedEntries.length === 0
                    ? "w-full flex justify-center py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 cursor-not-allowed"
                    : "w-full flex justify-center py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                }
                // className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                disabled={state.selectedEntries.length === 0}
                onClick={() => openDeleteModal(state.selectedEntries)}
              >
                Delete Selected
              </button>
            </div>
          )}
          {(state.totalRecords > 0 || state.searchText.length > 0) && (
            <div className="col-span-1 py-2 text-right">Sort by</div>
          )}
          {(state.totalRecords > 0 || state.searchText.length > 0) && (
            <div className="col-span-2">
              {/* Sort by */}
              <label
                htmlFor="sortorder"
                className="block text-sm font-medium text-gray-700"
              ></label>
              <select
                id="sortorder"
                name="sortorder"
                className="mt-1 block rounded-md border-gray-300 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => handleSortOrderChange(e)}
              >
                <option>Date Ascending</option>
                <option>Date Descending</option>
                <option>Amount Ascending</option>
                <option>Amount Descending</option>
              </select>
            </div>
          )}
        </div>

        {/* <div className="flex justify-between mt-6">
            <Link to={`/${(props as any).currentOrganisation?._id}/tags/add`}>
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <Icon name="add" className="h-4 w-4 mr-2" />
                Add Tag
              </button>
            </Link>
            {(state.totalRecords > 0 ||
              state.searchText.length > 0) && (
              <div className="w-80 mx-auto">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={state.searchText}
                  placeholder="Search by Tag Name or Tag Description"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                  onChange={handleSearchTextChange}
                />
              </div>
            )}
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <Icon name="add" className="h-4 w-4 mr-2" />
              Export XML
            </button>
          </div> */}

        {!state.loading && state.displayEntryDetails ? (
          state.totalRecords > 0 || state.searchText.length > 0 ? (
            <div className={"max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12"}>
              {/* Organisation List Table */}
              <div className="mt-4 flex flex-col">
                <div
                  id="table-scroll"
                  className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 overflow-auto"
                >
                  <div className="min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                      <table
                        className="min-w-full border-separate border shadow-sm"
                        style={{ borderSpacing: 0 }}
                      >
                        <thead className="bg-gray-50">
                          <tr>
                            {
                              <th
                                style={{ zIndex: 6 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-bottom"
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                                  checked={
                                    state.displayEntryDetails.length > 0 &&
                                    state.displayEntryDetails.length ===
                                      state.selectedEntries.length
                                  }
                                  onChange={onSelectAllEntry}
                                />
                              </th>
                            }
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-bottom"
                            >
                              Date
                            </th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-bottom"
                            >
                              ACCOUNTS
                            </th>

                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-8 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-bottom"
                            >
                              AMOUNT
                            </th>

                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              rowSpan={2}
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-8 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-bottom"
                            >
                              ACTIONS
                            </th>
                          </tr>
                        </thead>
                        {state.totalRecords === 0 ? (
                          <div className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            No record found matching your search criteria
                          </div>
                        ) : (
                          <tbody className="bg-white">
                            {state.displayEntryDetails?.map(
                              (entry: any, index: any) => (
                                <tr
                                  key={entry._id}
                                  className={
                                    index % 2 === 0 ? undefined : "bg-gray-100"
                                  }
                                >
                                  <td className="w-1/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-black-900 sm:pl-6">
                                    <div>
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                                        checked={state.selectedEntries.some(
                                          (item: any) => item._id === entry._id
                                        )}
                                        onChange={() =>
                                          onEntryCheckBoxChange(entry)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-black-900 sm:pl-6">
                                    {convertDateToString(entry.date)}
                                  </td>

                                  <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                    {entry.accountsToShow}
                                  </td>

                                  <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 text-right">
                                    {new Intl.NumberFormat("en-IN", {
                                      minimumFractionDigits: 2,
                                    }).format(entry.amountToShow)}
                                  </td>

                                  <td className="w-4/10 px-6 py-3 mx-4 text-center whitespace-nowrap text-sm text-gray-500">
                                    <Menu as="div" className="inline-block">
                                      <Menu.Button onClick={onActionClick}>
                                        <span className="sr-only">
                                          Open options
                                        </span>
                                        <Icon
                                          name="horizontal-dots"
                                          className="h-5 w-5 text-gray-900"
                                          aria-hidden="true"
                                        />
                                      </Menu.Button>
                                      {state.showBackDrop && (
                                        <div
                                          className="fixed top-0 left-0 z-10 w-full h-screen"
                                          onClick={onDropdownClick}
                                        ></div>
                                      )}

                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <div
                                          style={{
                                            position: "fixed",
                                            zIndex: 100,
                                            top: `${state.posY}px`,
                                            left: `${state.posX - 230}px`,
                                            margin: "0.5rem",
                                          }}
                                        >
                                          <Menu.Items className="overscroll-none mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                              <Menu.Item>
                                                <button
                                                  className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                  onClick={() =>
                                                    editEntryNavigateFunction(
                                                      entry
                                                    )
                                                  }
                                                >
                                                  <Icon
                                                    name="edit"
                                                    className="h-5 w-5 mr-2"
                                                  />
                                                  <span>Edit</span>
                                                </button>
                                              </Menu.Item>

                                              <Menu.Item>
                                                <button
                                                  className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                  onClick={() =>
                                                    navigate(
                                                      `/${
                                                        (props as any).params
                                                          .organisationId
                                                      }/${
                                                        (props as any)
                                                          .currentYear
                                                      }/journal-entry/duplicate/${
                                                        entry._id
                                                      }`
                                                    )
                                                  }
                                                >
                                                  <Icon
                                                    name="edit"
                                                    className="h-5 w-5 mr-2"
                                                  />
                                                  <span>Duplicate</span>
                                                </button>
                                              </Menu.Item>

                                              <Menu.Item>
                                                <button
                                                  className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                  onClick={() =>
                                                    openDeleteModal([entry])
                                                  }
                                                >
                                                  <Icon
                                                    name="delete"
                                                    className="h-5 w-5 mr-2"
                                                  />
                                                  <span>Delete</span>
                                                </button>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                  onClick={() =>
                                                    openLogModal(entry)
                                                  }
                                                >
                                                  <Icon
                                                    name="outline/document-report"
                                                    className="h-5 w-5 mr-2"
                                                  />
                                                  <span>View Log</span>
                                                </button>
                                              </Menu.Item>
                                            </div>
                                          </Menu.Items>
                                        </div>
                                      </Transition>
                                    </Menu>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        )}
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-middle"
                            ></th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-middle"
                            ></th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-900 tracking-wider sm:pl-6 align-middle"
                            >
                              {`Total (${state.displayEntryDetails.length} entries)`}
                              :
                            </th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider sm:pl-6 align-middle"
                            >
                              {new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 2,
                              }).format(state.pageTotal)}
                            </th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xm font-bold text-gray-900 uppercase tracking-wider sm:pl-6 align-middle"
                            ></th>
                          </tr>
                        </thead>
                        {state.totalRecords > chunkSize ? (
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                style={{ zIndex: 6 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-middle"
                              ></th>
                              <th
                                style={{ zIndex: 6 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-middle"
                              ></th>
                              <th
                                style={{ zIndex: 6 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-900 tracking-wider sm:pl-6 align-middle"
                              >
                                Total ({state.totalRecords} entries):
                              </th>
                              <th
                                style={{ zIndex: 6 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider sm:pl-6 align-middle"
                              >
                                {new Intl.NumberFormat("en-IN", {
                                  minimumFractionDigits: 2,
                                }).format(state.total)}
                              </th>

                              <th
                                style={{ zIndex: 6 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6 align-middle"
                              ></th>
                            </tr>
                          </thead>
                        ) : null}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center my-10 border-2 border-gray-300 border-dashed p-16 md:mx-40 sm:mx-0 rounded-lg">
              <Icon
                name="outline/document-add"
                className="mx-auto mb-2 text-gray-300 flex-shrink-0 h-10 w-10"
                strokeWidth="1"
              />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No Journal Entry Present
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new Journal Entry.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  onClick={() => {
                    navigate(
                      `/${(props as any).params.organisationId}/${
                        (props as any).currentYear
                      }/journal-entry/add`
                    );
                  }}
                >
                  {(props as any)?.rights?.statusRights.create ? (
                    <Icon name="add" className="h-4 w-4 mr-2" />
                  ) : (
                    <Icon name="outline/lock-closed" className="h-4 w-4 mr-2" />
                  )}
                  Add Journal Entry
                </button>
              </div>
            </div>
          )
        ) : (
          <div className={"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"}>
            <div className="py-6">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="overflow-scroll table-auto w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="w-1/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            ></th>
                            <th
                              scope="col"
                              className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              DATE
                            </th>
                            <th
                              scope="col"
                              className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              ACCOUNTS
                            </th>
                            <th
                              scope="col"
                              className="w-4/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              AMOUNT
                            </th>

                            <th
                              scope="col"
                              className="w-2/12 px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              ACTIONS
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {[...Array(5)].map((e, i) => (
                            <tr key={i} className="bg-white">
                              {[...Array(5)].map((e, i) => (
                                <td
                                  key={i}
                                  className="w-3/10 px-6 py-3 whitespace-wrap text-sm font-medium text-gray-900"
                                >
                                  <Skeleton />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.displayEntryDetails.length > 0 ? (
          <div className="bg-white px-4 py-3 my-4 lg:mx-8 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {state.skip + 1}
                    {/* {currPage * chunkSize + 1} */}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {state.skip + chunkSize > state.totalRecords
                      ? state.totalRecords
                      : state.skip + chunkSize}
                    {/* {(currPage + 1) * chunkSize > state.totalRecords
                      ? state.totalRecords
                      : (currPage + 1) * chunkSize} */}
                  </span>{" "}
                  of <span className="font-medium">{state.totalRecords}</span>{" "}
                  results
                </p>
              </div>
            </div>
            <div id="pagination" className="text-sm text-gray-500 my-2">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(state.totalRecords / chunkSize)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Dashboard>
  );
}

export default compose(
  connector,
  withRouter
)(EntriesList) as React.ComponentType;
