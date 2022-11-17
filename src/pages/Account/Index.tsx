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
import "../style.css";
import TagManager from "react-gtm-module";
import { Menu, Transition } from "@headlessui/react";
import InActiveModal from "../../components/InActiveModal";
import ActiveModal from "../../components/ActiveModal";
import DeleteModal from "../../components/DeleteModal";
import EditAccountModal from "./Edit";
import { withRouter } from "../../helpers/withRouter";
import { compose } from "redux";
// import InactiveTagModal from "./InactiveTagModal";
// import ActiveTagModal from "./ActiveTagModal";
// import EditTag from "./Edit";
// import DeleteTagModal from "./DeleteTagModal";

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

function Clients(props: PropsFromRedux) {
  interface state {
    loading: boolean;
    posX: any;
    posY: any;
    hoverX: any;
    hoverY: any;
    showBackDrop: boolean;
    searchText: string;
    status: any;
    totalRecords: number;
    displayAccountDetails: any;
    selectedGstId: string;
    modalOpen: boolean;
    typingTimeout: number;
    selectedRow: any;
    showDeleteModal: boolean;
    showActiveModal: boolean;
    showInActiveModal: boolean;
    showEditModal: boolean;
    active: boolean;
  }

  let inititalState = {
    loading: false,
    posX: null,
    posY: null,
    hoverX: null,
    hoverY: null,
    showBackDrop: false,
    searchText: "",
    status: [],
    totalRecords: 0,
    displayAccountDetails: [],
    selectedGstId: "",
    modalOpen: false,
    typingTimeout: 0,
    selectedRow: undefined,
    showDeleteModal: false,
    showActiveModal: false,
    showInActiveModal: false,
    showEditModal: false,
    active: true,
  };

  const [state, setState] = React.useState<state>(inititalState);
  // Chunk Size for number of table data displayed in each page during pagination
  let chunkSize = 12;
  // Selected pagination value
  let currPage = 0;

  //Get Organisation Data

  const getAccountList = (forSearch: boolean) => {
    const organisationId = (props as any).params?.organisationId;
    const searchText = forSearch ? state.searchText : "";
    const active = state.active;
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    agent.Account.getAccountList(organisationId, active, searchText)
      .then((response: any) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          displayAccountDetails: response.accounts,
          totalRecords: response.count,
          status: response.status,
        }));

        (props as any).updateCommon({ status: response.status });
      })
      .catch((err: any) => {
        console.log("TAG ERROR", { err });
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));

        (props as any).onNotify(
          "Could not load Organisation Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  // onMount Load data
  // componentDidMount() {
  //   getAccountList(false);
  // }

  useEffect(() => {
    getAccountList(false);
  }, []);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      searchText: "",
    }));

    getAccountList(false);
  }, [(props as any).params?.organisationId]);

  useEffect(() => {
    // if (
    //   (props as any)?.modalName === "ADD_ACCOUNT_MODAL" &&
    //   (props as any)?.modalName === "" &&
    //   (props as any)?.fetchAgain
    // ) {
    getAccountList(false);
    // }
  }, [(props as any).currentModal]);

  useEffect(() => {
    getAccountList(false);
  }, [state.active]);

  // componentDidUpdate(prevProps: any, prevState: any) {
  //   const prevOrganisationId = prevProps.params?.organisationId;
  //   const currOrganisationId = (props as any).params?.organisationId;

  //   if (prevOrganisationId !== currOrganisationId) {
  //     setState({ searchText: "" });
  //     getAccountList(false);
  //   }

  //   const prevModal = prevProps.currentModal;
  //   const currentModal = (props as any)?.currentModal;

  //   if (
  //     prevModal?.modalName === "ADD_ACCOUNT_MODAL" &&
  //     prevModal?.modalName !== currentModal?.modalName &&
  //     currentModal?.modalName === "" &&
  //     currentModal?.fetchAgain
  //   ) {
  //     getAccountList(false);
  //   }

  //   if (prevState.active !== state.active) {
  //     getAccountList(false);
  //   }
  // }

  const handlePageClick = (data: any) => {
    currPage = data.selected;
    setState((prevState) => ({
      ...prevState,
      displayAccountDetails: state.status,
    }));
  };

  const fetchRequired = () => {
    setState((prevState) => ({
      ...prevState,
      requireFetch: true,
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

  const onDescriptionHover = (e: any) => {
    const pos = e.target.getClientRects()[0];
    setState((prevState) => ({
      ...prevState,
      hoverX: pos.x,
      hoverY: pos.y,
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

    // setState({
    //   searchText: ev.target.value,

    //   typingTimeout: setTimeout(() => {
    //     getAccountList(true);
    //   }, 700),
    // });
  };

  const updateActive = () => {
    setState((prevState) => ({
      ...prevState,
      active: !state.active,
    }));
  };

  const openAddAccountModal = () => {
    const statusRights = (props as any)?.rights?.statusRights;
    const createRight = statusRights.create;
    if (createRight) {
      (props as any).updateCommon({
        currentModal: { modalName: "ADD_ACCOUNT_MODAL", fetchAgain: false },
      });
    } else {
      (props as any).onNotify(
        "Rights Not Avilable",
        "Ask Admin to change your user rights.",
        "danger"
      );
    }
  };

  const closeModal = (fetchAgain: boolean) => {
    (props as any).updateCommon({
      currentModal: { modalName: "", fetchAgain },
    });
  };

  const openActiveModal = (status: any) => {
    setState((prevState) => ({
      ...prevState,
      selectedRow: status,
      showBackDrop: false,
    }));

    activeModalSetOpen(true);
  };

  const activeModalSetOpen = (open: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showActiveModal: open,
    }));
  };

  const openInActiveModal = (status: any) => {
    setState((prevState) => ({
      ...prevState,
      selectedRow: status,
      showBackDrop: false,
    }));

    inActiveModalSetOpen(true);
  };

  const inActiveModalSetOpen = (open: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showInActiveModal: open,
    }));
  };

  const openDeleteModal = (status: any) => {
    setState((prevState) => ({
      ...prevState,
      selectedRow: status,
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

  const openEditModal = (status: any) => {
    const statusRights = (props as any)?.rights?.statusRights;
    const editRight = statusRights.edit;
    if (editRight) {
      setState((prevState) => ({
        ...prevState,
        selectedRow: status,
        showBackDrop: false,
      }));

      editModalSetOpen(true);
    } else {
      (props as any).onNotify(
        "Rights Not Avilable",
        "Ask Admin to change your user rights.",
        "danger"
      );
    }
  };

  const editModalSetOpen = (open: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showEditModal: open,
    }));
  };

  // TagManager.dataLayer(tagManagerArgs);
  return (
    <Dashboard>
      <div className="gsts">
        {state.showEditModal && (
          <EditAccountModal
            state={state}
            onLoad={getAccountList}
            editModalSetOpen={editModalSetOpen}
          />
        )}

        {state.showInActiveModal && (
          <InActiveModal
            type={"status"}
            state={state}
            onLoad={getAccountList}
            inActiveModalSetOpen={inActiveModalSetOpen}
          />
        )}

        {state.showActiveModal && (
          <ActiveModal
            type={"status"}
            state={state}
            onLoad={getAccountList}
            activeModalSetOpen={activeModalSetOpen}
          />
        )}
        {state.showDeleteModal && (
          <DeleteModal
            type={"status"}
            state={state}
            onLoad={getAccountList}
            deleteModalSetOpen={deleteModalSetOpen}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
        </div>
        <div className="px-4 sm:px-6 md:px-8 grid grid-cols-3 gap-4 mt-6">
          <div className="w-fit">
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              onClick={openAddAccountModal}
            >
              {(props as any)?.rights?.statusRights.create ? (
                <Icon name="add" className="h-4 w-4 mr-2" />
              ) : (
                <Icon name="outline/lock-closed" className="h-4 w-4 mr-2" />
              )}
              Add Account
            </button>
          </div>

          {(state.totalRecords > 0 || state.searchText.length > 0) && (
            <div className="w-64 sm:w-80">
              <input
                id="name"
                name="name"
                type="text"
                value={state.searchText}
                placeholder="Search by Account Name or Account Description"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
                onChange={handleSearchTextChange}
              />
            </div>
          )}
        </div>

        <div className="relative flex items-start max-w-7xl mx-auto mt-6 px-4 sm:px-6 md:px-8">
          <div className="flex h-5 items-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-400 cursor-pointer text-indigo-600 focus:ring-indigo-500"
              checked={state.active === false}
              onChange={updateActive}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="comments"
              className="font-medium cursor-pointer text-gray-700"
            >
              Show Inactive Account
            </label>
          </div>
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

        {!state.loading && state.displayAccountDetails ? (
          state.totalRecords > 0 || state.searchText.length > 0 ? (
            <div className={"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"}>
              {/* Organisation List Table */}
              <div className="mt-4 flex flex-col max-h-screen">
                <div
                  id="table-scroll"
                  className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 overflow-auto"
                >
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                      <table
                        className="min-w-full border-separate border shadow-sm"
                        style={{ borderSpacing: 0 }}
                      >
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                            >
                              ACCOUNT NAME
                            </th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                            >
                              NATURE OF ACCOUNT
                            </th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                            >
                              COLOR
                            </th>
                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                            >
                              ACCOUNT
                            </th>

                            <th
                              style={{ zIndex: 6 }}
                              scope="col"
                              className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
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
                            {state.displayAccountDetails?.map(
                              (status: any, index: any) => (
                                <tr
                                  key={status._id}
                                  className={
                                    index % 2 === 0 ? undefined : "bg-gray-100"
                                  }
                                >
                                  <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                    <button
                                      title="Edit"
                                      className="hover:underline font-bold"
                                      onClick={() => openEditModal(status)}
                                    >
                                      {status.name}
                                    </button>
                                  </td>

                                  <td
                                    id="description"
                                    className="w-4/12 px-6 py-3 text-sm text-gray-500 relative"
                                  >
                                    <div
                                      id="hover-description"
                                      title={status.nature}
                                      // onMouseEnter={onDescriptionHover}
                                    >
                                      <p className="truncate">
                                        {status.nature ? status.nature : "-"}
                                      </p>
                                      {/* {status.description && (
                                          <span
                                            style={{ zIndex: 4 }}
                                            className="absolute bg-gray-800 text-white p-2 rounded	mt-2 text-center break-words leading-6 tracking-wide"
                                          >
                                            {status.description}
                                          </span>
                                        )} */}
                                    </div>
                                  </td>

                                  <td className="w-3/10 px-6 py-3 whitespace-nowrap text-sm text-gray-900 font-bold">
                                    {status.color}
                                  </td>
                                  <td className="w-3/10 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {status.active ? "Active" : "Inactive"}
                                  </td>
                                  <td className="w-3/10 px-6 py-3 mx-4 text-center whitespace-nowrap text-sm text-gray-500">
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
                                                    openEditModal(status)
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
                                                {status.active ? (
                                                  <button
                                                    className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                    onClick={() =>
                                                      openInActiveModal(status)
                                                    }
                                                  >
                                                    <Icon
                                                      name="warning"
                                                      className="h-5 w-5 mr-2"
                                                    />
                                                    <span>Mark Inactive</span>
                                                  </button>
                                                ) : (
                                                  <button
                                                    className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                    onClick={() =>
                                                      openActiveModal(status)
                                                    }
                                                  >
                                                    <Icon
                                                      name="warning"
                                                      className="h-5 w-5 mr-2"
                                                    />
                                                    <span>Mark Active</span>
                                                  </button>
                                                )}
                                              </Menu.Item>
                                              <Menu.Item>
                                                <button
                                                  className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                  onClick={() =>
                                                    openDeleteModal(status)
                                                  }
                                                >
                                                  <Icon
                                                    name="delete"
                                                    className="h-5 w-5 mr-2"
                                                  />
                                                  <span>Delete</span>
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
                No Account Entry
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new Account.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  onClick={openAddAccountModal}
                >
                  {(props as any)?.rights?.statusRights.create ? (
                    <Icon name="add" className="h-4 w-4 mr-2" />
                  ) : (
                    <Icon name="outline/lock-closed" className="h-4 w-4 mr-2" />
                  )}
                  Add Account
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
                              className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              ACCOUNT NAME
                            </th>
                            <th
                              scope="col"
                              className="w-4/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              Nature of Account
                            </th>
                            <th
                              scope="col"
                              className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              COLOR
                            </th>
                            <th
                              scope="col"
                              className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >
                              ACCOUNT
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
        {state.displayAccountDetails.length > 0 ? (
          <div className="bg-white px-4 py-3 my-4 lg:mx-8 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {currPage * chunkSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {(currPage + 1) * chunkSize > state.totalRecords
                      ? state.totalRecords
                      : (currPage + 1) * chunkSize}
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

export default compose(connector, withRouter)(Clients) as React.ComponentType;
