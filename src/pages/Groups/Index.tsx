import React, { Fragment } from "react";
// Import to Display skeleton while loading data
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// Pagination
import ReactPaginate from "react-paginate";
import { connect, ConnectedProps } from "react-redux";
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
import EditGroupModal from "./Edit";
import DeleteModal from "../../components/DeleteModal";
import ActiveModal from "../../components/ActiveModal";
import InActiveModal from "../../components/InActiveModal";
import { compose } from "redux";
import { withRouter } from "../../helpers/withRouter";

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

class Clients extends React.Component<PropsFromRedux> {
  state: {
    loading: boolean;
    posX: any;
    posY: any;
    showBackDrop: boolean;
    searchText: string;
    groups: any;
    totalRecords: number;
    displayGroupsDetails: any;
    selectedGstId: string;
    selectedFirm: any;
    modalOpen: boolean;
    typingTimeout: number;
    selectedRow: any;
    hoverX: any;
    hoverY: any;
    showDeleteModal: boolean;
    showActiveModal: boolean;
    showInActiveModal: boolean;
    showEditModal: boolean;
    active: boolean;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      posX: null,
      posY: null,
      showBackDrop: false,
      searchText: "",
      groups: [],
      totalRecords: 0,
      displayGroupsDetails: [],
      selectedGstId: "",
      selectedFirm: undefined,
      modalOpen: false,
      typingTimeout: 0,
      selectedRow: undefined,
      hoverX: null,
      hoverY: null,
      showDeleteModal: false,
      showActiveModal: false,
      showInActiveModal: false,
      showEditModal: false,
      active: true,
    };
  }

  // Chunk Size for number of table data displayed in each page during pagination
  chunkSize = 12;
  // Selected pagination value
  currPage = 0;

  //Get Firm Data

  getGroupList = (forSearch: boolean) => {
    const workSpaceId = (this.props as any).params?.firmId;
    const searchText = forSearch ? this.state.searchText : "";
    const active = this.state.active;
    this.setState({ loading: true });
    agent.ClientGroups.getClientGroupList(workSpaceId, active, searchText)
      .then((response: any) => {
        this.setState({
          groups: response.groups,
          loading: false,
          totalRecords: response.groups.length,
          displayGroupsDetails: response.groups.slice(
            this.currPage * this.chunkSize,
            this.currPage * this.chunkSize + this.chunkSize
          ),
        });
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not load Firm Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  // onMount Load data
  componentDidMount() {
    this.getGroupList(false);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const prevFirmId = prevProps.params.firmId;
    const currFirmId = (this.props as any).params.firmId;
    if (prevFirmId !== currFirmId) {
      this.setState({ searchText: "" });
      this.getGroupList(false);
    }

    const prevModal = prevProps.currentModal;
    const currentModal = (this.props as any)?.currentModal;
    if (
      prevModal?.modalName === "ADD_GROUP_MODAL" &&
      prevModal?.modalName !== currentModal?.modalName &&
      currentModal?.modalName === "" &&
      currentModal?.fetchAgain
    ) {
      this.getGroupList(false);
    }

    if (prevState.active !== this.state.active) {
      this.getGroupList(false);
    }
  }

  handlePageClick = (data: any) => {
    this.currPage = data.selected;
    this.setState({
      displayGroupsDetails: this.state.groups.slice(
        this.currPage * this.chunkSize,
        this.currPage * this.chunkSize + this.chunkSize
      ),
    });
  };

  fetchRequired = () => {
    this.setState({ requireFetch: true });
  };

  onFirmChange = (item: any) => {
    this.setState({ selectedFirm: item });
  };

  onActionClick = (e: any) => {
    const screenClosness = window.innerHeight - e.clientY;
    const positionY = screenClosness < 125 ? e.clientY - 125 : e.clientY;
    this.setState({
      posX: e.clientX,
      posY: positionY,
      showBackDrop: true,
    });
  };

  updateActive = () => {
    this.setState({ active: !this.state.active });
  };

  onDropdownClick = () => {
    this.setState({ showBackDrop: false });
  };

  handleSearchTextChange = (ev: any) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      searchText: ev.target.value,
      typingTimeout: setTimeout(() => {
        this.getGroupList(true);
      }, 700),
    });
  };

  openModals = (tag: any, modalName: string) => {
    this.setState({ selectedRow: tag, showBackDrop: false });
    (this.props as any).updateCommon({
      currentModal: { modalName, fetchAgain: false },
    });
  };

  openAddGroupModal = () => {
    (this.props as any).updateCommon({
      currentModal: { modalName: "ADD_GROUP_MODAL", fetchAgain: false },
    });
  };

  closeModal = (fetchAgain: boolean) => {
    (this.props as any).updateCommon({
      currentModal: { modalName: "", fetchAgain },
    });
  };

  onDescriptionHover = (e: any) => {
    const pos = e.target.getClientRects()[0];
    this.setState({ hoverX: pos.x, hoverY: pos.y });
  };

  openActiveModal = (tag: any) => {
    this.setState({ selectedRow: tag, showBackDrop: false });
    this.activeModalSetOpen(true);
  };

  activeModalSetOpen = (open: boolean) => {
    this.setState({
      showActiveModal: open,
    });
  };

  openInActiveModal = (tag: any) => {
    this.setState({ selectedRow: tag, showBackDrop: false });
    this.inActiveModalSetOpen(true);
  };

  inActiveModalSetOpen = (open: boolean) => {
    this.setState({
      showInActiveModal: open,
    });
  };

  openDeleteModal = (tag: any) => {
    this.setState({ selectedRow: tag, showBackDrop: false });
    this.deleteModalSetOpen(true);
  };

  deleteModalSetOpen = (open: boolean) => {
    this.setState({
      showDeleteModal: open,
    });
  };

  openEditModal = (tag: any) => {
    this.setState({ selectedRow: tag, showBackDrop: false });
    this.editModalSetOpen(true);
  };

  editModalSetOpen = (open: boolean) => {
    this.setState({
      showEditModal: open,
    });
  };

  render() {
    TagManager.dataLayer(tagManagerArgs);
    return (
      <Dashboard>
        <div className="gsts">
          {this.state.showEditModal && (
            <EditGroupModal
              state={this.state}
              onLoad={this.getGroupList}
              editModalSetOpen={this.editModalSetOpen}
            />
          )}

          {this.state.showInActiveModal && (
            <InActiveModal
              type={"group"}
              state={this.state}
              onLoad={this.getGroupList}
              inActiveModalSetOpen={this.inActiveModalSetOpen}
            />
          )}

          {this.state.showActiveModal && (
            <ActiveModal
              type={"group"}
              state={this.state}
              onLoad={this.getGroupList}
              activeModalSetOpen={this.activeModalSetOpen}
            />
          )}
          {this.state.showDeleteModal && (
            <DeleteModal
              type={"group"}
              state={this.state}
              onLoad={this.getGroupList}
              deleteModalSetOpen={this.deleteModalSetOpen}
            />
          )}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Client Groups
            </h1>
          </div>
          <div className="px-4 sm:px-6 md:px-8 grid grid-cols-3 gap-4 mt-6">
            <div className="w-fit">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                onClick={this.openAddGroupModal}
              >
                <Icon name="add" className="h-4 w-4 mr-2" />
                Add Group
              </button>
            </div>

            {(this.state.totalRecords > 0 ||
              this.state.searchText.length > 0) && (
              <div className="w-64 sm:w-80 col-span-2 mr-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={this.state.searchText}
                  placeholder="Search by Group Name or Group Description"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
                  onChange={this.handleSearchTextChange}
                />
              </div>
            )}
          </div>

          {/* {(this.state.totalRecords > 0 ||
            this.state.searchText.length > 0) && (
            <div className="w-80 mt-6 mx-auto">
              <input
                id="name"
                name="name"
                type="text"
                value={this.state.searchText}
                placeholder="Search in tag name or description"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                onChange={this.handleSearchTextChange}
              />
            </div>
          )} */}
          <div className="relative flex items-start max-w-7xl mx-auto mt-6 px-4 sm:px-6 md:px-8">
            <div className="flex h-5 items-center">
              <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-400 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                checked={this.state.active === false}
                onChange={this.updateActive}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="comments"
                className="font-medium cursor-pointer text-gray-700"
              >
                Show Inactive Groups
              </label>
            </div>
          </div>
          {!this.state.loading && this.state.displayGroupsDetails ? (
            this.state.totalRecords > 0 || this.state.searchText.length > 0 ? (
              <div className={"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"}>
                {/* Firm List Table */}
                <div className="mt-6 flex flex-col max-h-screen">
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
                                style={{ zIndex: 8 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                GROUP NAME
                              </th>
                              <th
                                style={{ zIndex: 8 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                DESCRIPTION
                              </th>

                              <th
                                style={{ zIndex: 8 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                STATUS
                              </th>

                              <th
                                style={{ zIndex: 8 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                ACTIONS
                              </th>
                            </tr>
                          </thead>
                          {this.state.totalRecords === 0 ? (
                            <div className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              No record found matching your search criteria
                            </div>
                          ) : (
                            <tbody className="bg-white">
                              {this.state.displayGroupsDetails?.map(
                                (tag: any, index: any) => (
                                  <tr
                                    key={tag._id}
                                    className={
                                      index % 2 === 0
                                        ? undefined
                                        : "bg-gray-100"
                                    }
                                  >
                                    <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                      <button
                                        title="Edit"
                                        className="hover:underline font-bold"
                                        onClick={() => this.openEditModal(tag)}
                                      >
                                        {tag.name}
                                      </button>
                                    </td>
                                    <td
                                      id="description"
                                      className="w-4/12 px-6 py-3 text-sm text-gray-500 relative"
                                    >
                                      <div
                                        id="hover-description"
                                        title={tag.description}
                                      >
                                        <p className="truncate">
                                          {tag.description
                                            ? tag.description
                                            : "-"}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="w-4/10 px-6 py-3 whitespace-nowrap font-bold text-sm text-gray-900">
                                      {tag.active ? "Active" : "Inactive"}
                                    </td>
                                    <td className="w-4/10 px-6 py-3 mx-4 text-center whitespace-nowrap text-sm text-gray-500">
                                      <Menu as="div" className="inline-block">
                                        <Menu.Button
                                          onClick={this.onActionClick}
                                        >
                                          <span className="sr-only">
                                            Open options
                                          </span>
                                          <Icon
                                            name="horizontal-dots"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </Menu.Button>
                                        {this.state.showBackDrop && (
                                          <div
                                            className="fixed top-0 left-0 z-10 w-full h-screen"
                                            onClick={this.onDropdownClick}
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
                                              top: `${this.state.posY}px`,
                                              left: `${
                                                this.state.posX - 230
                                              }px`,
                                              margin: "0.5rem",
                                            }}
                                          >
                                            <Menu.Items className="overscroll-none mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                              <div className="py-1">
                                                <Menu.Item>
                                                  <button
                                                    className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                    onClick={() =>
                                                      this.openEditModal(tag)
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
                                                  {tag.active ? (
                                                    <button
                                                      className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                      onClick={() =>
                                                        this.openInActiveModal(
                                                          tag
                                                        )
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
                                                        this.openActiveModal(
                                                          tag
                                                        )
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
                                                      this.openDeleteModal(tag)
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
                  No Groups Entry
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new group.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={this.openAddGroupModal}
                  >
                    <Icon name="add" className="h-4 w-4 mr-2" />
                    Add Group
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
                                GROUP NAME
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                              >
                                DESCRIPTION
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                              >
                                STATUS
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
                                {[...Array(4)].map((e, i) => (
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
          {this.state.displayGroupsDetails.length > 0 ? (
            <div className="bg-white px-4 py-3 my-4 lg:mx-8 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {this.currPage * this.chunkSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {(this.currPage + 1) * this.chunkSize >
                      this.state.totalRecords
                        ? this.state.totalRecords
                        : (this.currPage + 1) * this.chunkSize}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {this.state.totalRecords}
                    </span>{" "}
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
                  pageCount={Math.ceil(
                    this.state.totalRecords / this.chunkSize
                  )}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handlePageClick}
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
}

// export default connector(Clients);
export default compose(connector, withRouter)(Clients) as React.ComponentType;
