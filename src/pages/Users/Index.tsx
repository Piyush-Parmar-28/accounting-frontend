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
import DeleteModal from "../../components/DeleteModal";
import { withRouter } from "../../helpers/withRouter";
import { compose } from "redux";
import InvitationModal from "../../components/InvitationModal";
import ActiveModal from "../../components/ActiveModal";
import InActiveModal from "../../components/InActiveModal";

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

class Clients extends React.Component<any, PropsFromRedux> {
  state: {
    loading: boolean;
    posX: any;
    posY: any;
    showBackDrop: boolean;
    searchText: string;
    users: any;
    totalRecords: number;
    displayUserDetails: any;
    selectedGstId: string;
    selectedFirm: any;
    modalOpen: boolean;
    typingTimeout: number;
    selectedRow: any;
    hoverX: any;
    hoverY: any;
    showDeleteModal: boolean;
    showEditModal: boolean;
    active: boolean;
    sentLoading: boolean;
    invitationSentDetails: any;
    invitationSentTotalRecords: number;
    displayInvitationSentDetails: any;
    showInvitationModal: boolean;
    showActiveModal: boolean;
    showInActiveModal: boolean;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      posX: null,
      posY: null,
      showBackDrop: false,
      searchText: "",
      users: [],
      totalRecords: 0,
      displayUserDetails: [],
      selectedGstId: "",
      selectedFirm: undefined,
      modalOpen: false,
      typingTimeout: 0,
      selectedRow: undefined,
      hoverX: null,
      hoverY: null,
      showDeleteModal: false,
      showEditModal: false,
      active: true,
      sentLoading: false,
      invitationSentDetails: [],
      invitationSentTotalRecords: 0,
      displayInvitationSentDetails: [],
      showInvitationModal: false,
      showActiveModal: false,
      showInActiveModal: false,
    };
  }

  // Chunk Size for number of table data displayed in each page during pagination
  chunkSize = 12;
  sentChunkSize = 12;
  // Selected pagination value
  currPage = 0;
  currSentPage = 0;

  //Get User Data

  getUsersList = (forSearch: boolean) => {
    const workSpaceId = (this.props as any).params?.firmId;
    const searchText = forSearch ? this.state.searchText : "";
    const active = this.state.active;
    this.setState({ loading: true });
    agent.User.getUserList(workSpaceId, active, searchText)
      .then((response: any) => {
        console.log({ response });
        this.setState({
          users: response.users,
          loading: false,
          totalRecords: response.users.length,
          displayUserDetails: response.users.slice(
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

  getInvitaionSentList = () => {
    const workSpaceId = (this.props as any).params?.firmId;
    this.setState({ sentLoading: true });
    agent.Firm.listofInvitationSent(workSpaceId)
      .then((response: any) => {
        this.setState({
          invitationSentDetails: response.invitations,
          sentLoading: false,
          invitationSentTotalRecords: response.invitations.length,
          displayInvitationSentDetails: response.invitations.slice(
            this.currSentPage * this.sentChunkSize,
            this.currSentPage * this.sentChunkSize + this.sentChunkSize
          ),
        });
      })
      .catch((err: any) => {
        this.setState({ sentLoading: false });
        (this.props as any).onNotify(
          "Could not load Sent Invitaion Lists",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  // onMount Load data
  componentDidMount() {
    this.getUsersList(false);
    this.getInvitaionSentList();
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const prevFirmId = prevProps.params?.firmId;
    const currFirmId = (this.props as any).params?.firmId;

    if (prevFirmId !== currFirmId) {
      this.setState({ searchText: "" });
      this.getUsersList(false);
      this.getInvitaionSentList();
    }

    if (prevState.active !== this.state.active) {
      this.getUsersList(false);
    }
  }

  handlePageClick = (data: any) => {
    this.currPage = data.selected;
    this.setState({
      displayUserDetails: this.state.users.slice(
        this.currPage * this.chunkSize,
        this.currPage * this.chunkSize + this.chunkSize
      ),
    });
  };

  handleSentPageClick = (data: any) => {
    this.currSentPage = data.selected;
    this.setState({
      displayInvitationSentDetails: this.state.invitationSentDetails.slice(
        this.currSentPage * this.sentChunkSize,
        this.currSentPage * this.sentChunkSize + this.sentChunkSize
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
        this.getUsersList(true);
      }, 700),
    });
  };

  updateActive = () => {
    this.setState({ active: !this.state.active });
  };

  openAddUserPage = () => {
    const clientRights = (this.props as any)?.rights?.userRights;
    const createRight = clientRights.add;
    const currentFirmId = (this.props as any).params?.firmId;
    if (createRight) {
      (this.props as any).navigate(`/${currentFirmId}/user/add`);
    } else {
      (this.props as any).onNotify(
        "Rights Not Avilable",
        "Ask Admin to change your user rights.",
        "danger"
      );
    }
  };

  openDeleteModal = (user: any) => {
    this.setState({ selectedRow: user, showBackDrop: false });
    this.deleteModalSetOpen(true);
  };

  deleteModalSetOpen = (open: boolean) => {
    this.setState({
      showDeleteModal: open,
    });
  };

  openRevokeModal = (item: any) => {
    this.setState({
      selectedRow: item,
      showBackDrop: false,
    });
    this.invitationModalSetOpen(true);
  };

  invitationModalSetOpen = (open: boolean) => {
    this.setState({
      showInvitationModal: open,
    });
  };

  openEditModal = (user: any) => {
    const userRights = (this.props as any)?.rights?.userRights;
    const editRight = userRights.edit;
    const currentFirmId = (this.props as any).params?.firmId;
    if (editRight) {
      (this.props as any).updateCommon({ editUser: user });
      (this.props as any).navigate(`/${currentFirmId}/user/edit`);
    } else {
      (this.props as any).onNotify(
        "Rights Not Avilable",
        "Ask Admin to change your user rights.",
        "danger"
      );
    }
  };

  editModalSetOpen = (open: boolean) => {
    this.setState({
      showEditModal: open,
    });
  };

  openActiveModal = (user: any) => {
    this.setState({ selectedRow: user, showBackDrop: false });
    this.activeModalSetOpen(true);
  };

  activeModalSetOpen = (open: boolean) => {
    this.setState({
      showActiveModal: open,
    });
  };

  openInActiveModal = (user: any) => {
    this.setState({ selectedRow: user, showBackDrop: false });
    this.inActiveModalSetOpen(true);
  };

  inActiveModalSetOpen = (open: boolean) => {
    this.setState({
      showInActiveModal: open,
    });
  };

  render() {
    TagManager.dataLayer(tagManagerArgs);
    return (
      <Dashboard>
        <div className="gsts">
          {this.state.showDeleteModal && (
            <DeleteModal
              type={"user"}
              state={this.state}
              onLoad={this.getUsersList}
              deleteModalSetOpen={this.deleteModalSetOpen}
            />
          )}
          {this.state.showInvitationModal && (
            <InvitationModal
              heading={"Revoke Invitation"}
              type={"Revoke"}
              state={this.state}
              onLoad={this.getInvitaionSentList}
              invitationModalSetOpen={this.invitationModalSetOpen}
            />
          )}
          {this.state.showInActiveModal && (
            <InActiveModal
              type={"user"}
              state={this.state}
              onLoad={this.getUsersList}
              inActiveModalSetOpen={this.inActiveModalSetOpen}
            />
          )}

          {this.state.showActiveModal && (
            <ActiveModal
              type={"user"}
              state={this.state}
              onLoad={this.getUsersList}
              activeModalSetOpen={this.activeModalSetOpen}
            />
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          </div>
          <div className="px-4 sm:px-6 md:px-8 grid grid-cols-3 gap-4 mt-6">
            <div className="w-fit">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                onClick={this.openAddUserPage}
              >
                {(this.props as any)?.rights?.userRights.add ? (
                  <Icon name="add" className="h-4 w-4 mr-2" />
                ) : (
                  <Icon name="outline/lock-closed" className="h-4 w-4 mr-2" />
                )}
                Add User
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
                  placeholder="Search by User Name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
                  onChange={this.handleSearchTextChange}
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
                checked={this.state.active === false}
                onChange={this.updateActive}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="comments"
                className="font-medium cursor-pointer text-gray-700"
              >
                Show Inactive Users
              </label>
            </div>
          </div>
          {!this.state.loading && this.state.displayUserDetails ? (
            this.state.totalRecords > 0 || this.state.searchText.length > 0 ? (
              <div className={"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"}>
                {/* Firm List Table */}
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
                                style={{ zIndex: 8 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                USER NAME
                              </th>
                              <th
                                style={{ zIndex: 8 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                SHORT NAME
                              </th>

                              <th
                                style={{ zIndex: 8 }}
                                scope="col"
                                className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                EMAIL
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
                              {this.state.displayUserDetails?.map(
                                (user: any, index: any) => (
                                  <tr
                                    key={user._id}
                                    className={
                                      index % 2 === 0
                                        ? undefined
                                        : "bg-gray-100"
                                    }
                                  >
                                    <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 font-bold text-sm text-gray-900 sm:pl-6">
                                      {user.name}
                                    </td>
                                    <td className="w-3/10 px-6 py-3 text-sm text-gray-500 relative">
                                      {user.shortname}
                                    </td>
                                    <td className="w-4/10 px-6 py-3 whitespace-nowrap font-bold text-sm text-gray-900">
                                      {user.email}
                                    </td>
                                    <td className="w-4/10 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {user.active ? "Active" : "Inactive"}
                                    </td>
                                    <td className="w-4/10 px-6 py-3 mx-4 text-center whitespace-nowrap text-sm text-gray-900">
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
                                                      this.openEditModal(user)
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
                                                  {user.active ? (
                                                    <button
                                                      className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                      onClick={() =>
                                                        this.openInActiveModal(
                                                          user
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
                                                          user
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
                                                      this.openDeleteModal(user)
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
                  No Users Entry
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new User.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={this.openAddUserPage}
                  >
                    {(this.props as any)?.rights?.userRights.add ? (
                      <Icon name="add" className="h-4 w-4 mr-2" />
                    ) : (
                      <Icon
                        name="outline/lock-closed"
                        className="h-4 w-4 mr-2"
                      />
                    )}
                    Add User
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
                                USER NAME
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                              >
                                SHORT NAME
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                              >
                                EMAIL
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
          {this.state.displayUserDetails.length > 0 ? (
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

          {/* User Sent Invitation */}

          <>
            <div className="max-w-7xl pt-10 mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                User Invitation Sent
              </h1>
            </div>
            {!this.state.sentLoading &&
            this.state.displayInvitationSentDetails ? (
              <>
                {/* User Invitation Sent Table*/}
                <div className={"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"}>
                  <div className="mt-8 flex flex-col max-h-screen ">
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
                                  scope="col"
                                  className="sticky top-0 z-8 border-b font-bold border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sm:pl-6"
                                >
                                  FIRM NAME
                                </th>
                                <th
                                  scope="col"
                                  className="sticky top-0 z-8 border-b font-bold border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sm:pl-6"
                                >
                                  SEND BY
                                </th>
                                <th
                                  scope="col"
                                  className="sticky top-0 z-8 border-b font-bold border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sm:pl-6"
                                >
                                  USER ACCESS RIGHT
                                </th>
                                <th
                                  scope="col"
                                  className="sticky top-0 z-8 border-b font-bold border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sm:pl-6"
                                >
                                  STATUS
                                </th>
                                <th
                                  scope="col"
                                  className="sticky top-0 z-8 border-b font-bold text-center border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-500 uppercase tracking-wider sm:pl-6"
                                >
                                  ACTIONS
                                </th>
                              </tr>
                            </thead>
                            {this.state.displayInvitationSentDetails.length ===
                            0 ? (
                              <tbody>
                                <tr>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    No Invitations Sent
                                  </td>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody className="bg-white">
                                {this.state.displayInvitationSentDetails?.map(
                                  (invitation: any, index: any) => (
                                    <tr
                                      key={invitation._id}
                                      className={
                                        index % 2 === 0
                                          ? undefined
                                          : "bg-gray-100"
                                      }
                                    >
                                      <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 font-bold text-sm text-gray-900 sm:pl-6">
                                        {invitation.workSpaceId.name}
                                      </td>
                                      <td className="w-4/10 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {invitation.sentBy}
                                      </td>
                                      <td className="w-2/10 px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {invitation.userAccessRole}
                                      </td>
                                      <td className="w-2/10 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {invitation.status}
                                      </td>
                                      <td className="w-2/10 px-6 py-3 text-center whitespace-nowrap text-sm text-gray-900">
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
                                              onClick={() =>
                                                this.setState({
                                                  showBackDrop: false,
                                                })
                                              }
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
                                                top: `${this.state.posY}px`,
                                                left: `${
                                                  this.state.posX - 230
                                                }px`,
                                                zIndex: 100,
                                                margin: "0.5rem",
                                              }}
                                            >
                                              <Menu.Items className="overscroll-none mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                  <Menu.Item>
                                                    <button
                                                      className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                      onClick={() =>
                                                        this.openRevokeModal(
                                                          invitation
                                                        )
                                                      }
                                                    >
                                                      <Icon
                                                        name="warning"
                                                        className="h-5 w-5 mr-2"
                                                      />
                                                      <span>
                                                        Revoke Invitation
                                                      </span>
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
                {this.state.displayInvitationSentDetails.length > 0 && (
                  <div className="bg-white px-4 py-3 my-4 lg:mx-8 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {this.currSentPage * this.sentChunkSize + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {(this.currSentPage + 1) * this.sentChunkSize >
                            this.state.invitationSentTotalRecords
                              ? this.state.invitationSentTotalRecords
                              : (this.currSentPage + 1) * this.sentChunkSize}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {this.state.invitationSentTotalRecords}
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
                          this.state.invitationSentTotalRecords /
                            this.sentChunkSize
                        )}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this.handleSentPageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                      />
                    </div>
                  </div>
                )}
              </>
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
                                  className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  FIRM NAME
                                </th>
                                <th
                                  scope="col"
                                  className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  SEND BY
                                </th>
                                <th
                                  scope="col"
                                  className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  USER ACCESS RIGHT
                                </th>
                                <th
                                  scope="col"
                                  className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  STATUS
                                </th>
                                <th
                                  scope="col"
                                  className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  ACTIONS
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {[...Array(6)].map((e, i) => (
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
          </>
        </div>
      </Dashboard>
    );
  }
}

export default compose(connector, withRouter)(Clients) as React.ComponentType;
