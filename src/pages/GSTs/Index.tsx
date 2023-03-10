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
import years from "../../constants/years";
// Redux Notify
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";
import "../style.css";
import TagManager from "react-gtm-module";
import { Menu, Transition } from "@headlessui/react";
import ActiveModal from "../../components/ActiveModal";
import InActiveModal from "../../components/InActiveModal";
import AddOrganisation from "./Add";
import EditOrganisation from "./Edit";
import DeleteModal from "../../components/DeleteModal";
import InvitationModal from "../../components/InvitationModal";
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

class Organisations extends React.Component<any, PropsFromRedux> {
  state: {
    organisationLoading: boolean;
    posX: number;
    posY: number;
    showBackDrop: boolean;
    organisationDetails: any;
    totalRecords: number;
    displayOrganisationDetails: any;
    selectedGstId: string;
    showAddModal: boolean;
    currentYear: any;
    showEditModal: boolean;
    selectedRow: any;
    sentLoading: boolean;
    invitationSentDetails: any;
    invitationSentTotalRecords: number;
    displayInvitationSentDetails: any;
    showActiveModal: boolean;
    showInActiveModal: boolean;
    showDeleteModal: boolean;
    recieveLoading: boolean;
    invitationRecieveDetails: any;
    invitationRecieveTotalRecords: number;
    displayInvitationRecieveDetails: any;
    showInvitationModal: boolean;
    invitationHeading: string;
    invitationType: string;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      organisationLoading: false,
      posX: 0,
      posY: 0,
      showBackDrop: false,
      organisationDetails: [],
      totalRecords: 0,
      displayOrganisationDetails: [],
      selectedGstId: "",
      showAddModal: false,
      currentYear: years[0].name,
      showEditModal: false,
      selectedRow: null,
      sentLoading: false,
      invitationSentDetails: [],
      invitationSentTotalRecords: 0,
      displayInvitationSentDetails: [],
      showActiveModal: false,
      showInActiveModal: false,
      showDeleteModal: false,
      recieveLoading: false,
      invitationRecieveDetails: [],
      invitationRecieveTotalRecords: 0,
      displayInvitationRecieveDetails: [],
      showInvitationModal: false,
      invitationHeading: "",
      invitationType: "",
    };
  }

  // Chunk Size for number of table data displayed in each page during pagination
  organisationChunkSize = 12;
  sentChunkSize = 12;
  recieveChunkSize = 12;
  // Selected pagination value
  currOrganisationPage = 0;
  currSentPage = 0;
  currRecievePage = 0;

  //Get Organisation Data

  getOrganisationData = () => {
    this.setState({ organisationLoading: true });
    agent.Organisation.getOrganisations()
      .then((response: any) => {
        this.setState({
          organisationDetails: response.organisations,
          organisationLoading: false,
          totalRecords: response.organisations.length,
          displayOrganisationDetails: response.organisations.slice(
            this.currOrganisationPage * this.organisationChunkSize,
            this.currOrganisationPage * this.organisationChunkSize +
              this.organisationChunkSize
          ),
        });
        (this.props as any).updateCommon({
          organisations: response.organisations,
        });
      })
      .catch((err: any) => {
        console.log({ err });
        this.setState({ organisationLoading: false });
        (this.props as any).onNotify(
          "Could not load Organisation Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  getInvitaionSentList = () => {
    const organisationId = (this.props as any)?.currentOrganisation?._id;
    this.setState({ sentLoading: true });
    agent.Organisation.listofInvitationSent(organisationId)
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

  getInvitaionRecievedList = () => {
    const organisationId = (this.props as any)?.currentOrganisation?._id;
    this.setState({ recieveLoading: true });
    agent.Organisation.listofInvitationReceived(organisationId)
      .then((response: any) => {
        this.setState({
          invitationRecieveDetails: response.invitations,
          recieveLoading: false,
          invitationRecieveTotalRecords: response.invitations.length,
          displayInvitationRecieveDetails: response.invitations.slice(
            this.currRecievePage * this.recieveChunkSize,
            this.currRecievePage * this.recieveChunkSize + this.recieveChunkSize
          ),
        });
      })
      .catch((err: any) => {
        this.setState({ recieveLoading: false });
        (this.props as any).onNotify(
          "Could not load Received Invitaion Lists",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  // onMount Load data
  componentDidMount() {
    this.getOrganisationData();
    const currentOrganisationId = (this.props as any)?.currentOrganisation?._id;
    if (currentOrganisationId) {
      this.getInvitaionSentList();
      this.getInvitaionRecievedList();
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const prevOrganisationId = prevProps.currentOrganisation?._id;
    const currOrganisationId = (this.props as any).currentOrganisation?._id;

    if (prevOrganisationId === undefined && currOrganisationId) {
      this.getInvitaionSentList();
      this.getInvitaionRecievedList();
    }

    if (prevOrganisationId !== currOrganisationId) {
      this.getInvitaionSentList();
    }
  }

  handleOrganisationPageClick = (data: any) => {
    this.currOrganisationPage = data.selected;
    this.setState({
      displayOrganisationDetails: this.state.organisationDetails.slice(
        this.currOrganisationPage * this.organisationChunkSize,
        this.currOrganisationPage * this.organisationChunkSize +
          this.organisationChunkSize
      ),
    });
  };

  handleRecievePageClick = (data: any) => {
    this.currRecievePage = data.selected;
    this.setState({
      displayInvitationRecieveDetails:
        this.state.invitationRecieveDetails.slice(
          this.currRecievePage * this.recieveChunkSize,
          this.currRecievePage * this.recieveChunkSize + this.recieveChunkSize
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

  extractPreference = (filingFreq: any[], quarter: string) => {
    const prefArray = filingFreq.filter(
      (item) => item.quarter === quarter && item.year === this.state.currentYear
    );
    return prefArray.length === 0
      ? "Unavailable"
      : prefArray[0].preference === "Q"
      ? "Quarterly"
      : "Monthly";
  };

  onActionClick = (e: any, menuHeight: number) => {
    const screenClosness = window.innerHeight - e.clientY;
    const positionY =
      screenClosness < menuHeight ? e.clientY - menuHeight : e.clientY;
    this.setState({
      posX: e.clientX,
      posY: positionY,
      showBackDrop: true,
    });
  };

  openAddOrganisationModal = () => {
    (this.props as any).updateCommon({
      currentModal: { modalName: "ADD_ORGANISATION_MODAL", fetchAgain: false },
    });
  };

  closeModal = (fetchAgain: boolean) => {
    (this.props as any).updateCommon({
      currentModal: { modalName: "", fetchAgain },
    });
  };

  openEditModal = (organisation: any) => {
    this.setState({ selectedRow: organisation, showBackDrop: false });
    this.editModalSetOpen(true);
  };

  editModalSetOpen = (open: boolean) => {
    this.setState({
      showEditModal: open,
    });
  };

  openDeleteModal = (organisation: any) => {
    this.setState({ selectedRow: organisation, showBackDrop: false });
    this.deleteModalSetOpen(true);
  };

  deleteModalSetOpen = (open: boolean) => {
    this.setState({
      showDeleteModal: open,
    });
  };

  openActiveModal = (organisation: any) => {
    this.setState({ selectedRow: organisation, showBackDrop: false });
    this.activeModalSetOpen(true);
  };

  activeModalSetOpen = (open: boolean) => {
    this.setState({
      showActiveModal: open,
    });
  };

  openInActiveModal = (organisation: any) => {
    this.setState({ selectedRow: organisation, showBackDrop: false });
    this.inActiveModalSetOpen(true);
  };

  inActiveModalSetOpen = (open: boolean) => {
    this.setState({
      showInActiveModal: open,
    });
  };

  openRevokeModal = (item: any) => {
    this.setState({
      selectedRow: item,
      showBackDrop: false,
      invitationHeading: "Revoke Invitation",
      invitationType: "Revoke",
    });
    this.invitationModalSetOpen(true);
  };

  openRejectModal = (item: any) => {
    this.setState({
      selectedRow: item,
      showBackDrop: false,
      invitationHeading: "Reject Invitation",
      invitationType: "Reject",
    });
    this.invitationModalSetOpen(true);
  };

  openAcceptModal = (item: any) => {
    this.setState({
      selectedRow: item,
      showBackDrop: false,
      invitationHeading: "Accept Invitation",
      invitationType: "Accept",
    });
    this.invitationModalSetOpen(true);
  };

  openLeaveOrganisationModal = (item: any) => {
    this.setState({
      selectedRow: item,
      showBackDrop: false,
      invitationHeading: "Leave Organisation",
      invitationType: "Leave",
    });
    this.invitationModalSetOpen(true);
  };

  invitationModalSetOpen = (open: boolean) => {
    this.setState({
      showInvitationModal: open,
    });
  };

  onInvitationLoad = () => {
    const type = this.state.invitationType;
    if (type === "Revoke") {
      this.getInvitaionSentList();
    } else if (type === "Reject") {
      this.getInvitaionRecievedList();
    } else if (type === "Accept") {
      this.getInvitaionRecievedList();
      this.getOrganisationData();
    } else if (type === "Leave") {
      this.getOrganisationData();
    }
  };

  render() {
    TagManager.dataLayer(tagManagerArgs);
    return (
      <Dashboard>
        <div className="gsts">
          {(this.props as any)?.currentModal?.modalName ===
            "ADD_ORGANISATION_MODAL" && (
            <AddOrganisation
              state={this.state}
              onLoad={this.getOrganisationData}
              addModalSetOpen={this.closeModal}
            />
          )}

          {this.state.showEditModal && (
            <EditOrganisation
              state={this.state}
              onLoad={this.getOrganisationData}
              editModalSetOpen={this.editModalSetOpen}
            />
          )}

          {this.state.showInActiveModal && (
            <InActiveModal
              type={"organisation"}
              state={this.state}
              onLoad={this.getOrganisationData}
              inActiveModalSetOpen={this.inActiveModalSetOpen}
            />
          )}

          {this.state.showActiveModal && (
            <ActiveModal
              type={"organisation"}
              state={this.state}
              onLoad={this.getOrganisationData}
              activeModalSetOpen={this.activeModalSetOpen}
            />
          )}

          {this.state.showDeleteModal && (
            <DeleteModal
              type={"organisation"}
              state={this.state}
              onLoad={this.getOrganisationData}
              deleteModalSetOpen={this.deleteModalSetOpen}
            />
          )}

          {this.state.showInvitationModal && (
            <InvitationModal
              heading={this.state.invitationHeading}
              type={this.state.invitationType}
              state={this.state}
              onLoad={this.onInvitationLoad}
              invitationModalSetOpen={this.invitationModalSetOpen}
            />
          )}

          <div className="max-w-7xl mx-auto flex justify-between px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Organisations
            </h1>
            <div>
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                onClick={this.openAddOrganisationModal}
              >
                <Icon name="add" className="h-4 w-4 mr-2" />
                Add Organisations
              </button>
            </div>
          </div>

          {!this.state.organisationLoading &&
          this.state.displayOrganisationDetails ? (
            this.state.totalRecords > 0 ? (
              <div className={"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"}>
                {/* Organisation List Table */}
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
                                ORGANISATION NAME
                              </th>
                              <th
                                scope="col"
                                className="sticky top-0 z-8 border-b font-bold border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                OWNER'S EMAIL
                              </th>

                              <th
                                scope="col"
                                className="sticky top-0 z-8 border-b font-bold border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sm:pl-6"
                              >
                                PLAN
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
                          <tbody className="bg-white">
                            {this.state.displayOrganisationDetails?.map(
                              (organisation: any, index: any) => (
                                <tr
                                  key={organisation._id}
                                  className={
                                    index % 2 === 0 ? undefined : "bg-gray-100"
                                  }
                                >
                                  <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 font-bold text-sm text-gray-900 sm:pl-6">
                                    {organisation.isOwner ? (
                                      <button
                                        title="Edit"
                                        className="hover:underline font-bold"
                                        onClick={() =>
                                          this.openEditModal(organisation)
                                        }
                                      >
                                        {organisation.name}
                                      </button>
                                    ) : (
                                      organisation.name
                                    )}
                                  </td>
                                  <td className="w-3/10 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {organisation.owner}
                                  </td>
                                  <td className="w-2/10 px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {/* {organisation.gstRegType &&
                                      organisation.gstRegType.toUpperCase()} */}
                                  </td>
                                  <td className="w-2/10 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {organisation.active
                                      ? "Active"
                                      : "Inactive"}
                                  </td>

                                  <td className="w-2/10 px-6 py-3 text-center whitespace-nowrap text-sm text-gray-900">
                                    <Menu as="div" className="inline-block">
                                      <Menu.Button
                                        onClick={(e: any) =>
                                          this.onActionClick(e, 120)
                                        }
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
                                            left: `${this.state.posX - 230}px`,
                                            zIndex: 100,
                                            margin: "0.5rem",
                                          }}
                                        >
                                          <Menu.Items className="overscroll-none mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {organisation.isOwner ? (
                                              <div className="py-1">
                                                <Menu.Item>
                                                  <button
                                                    className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                    onClick={() =>
                                                      this.openEditModal(
                                                        organisation
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
                                                  {organisation.active ? (
                                                    <button
                                                      className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                      onClick={() =>
                                                        this.openInActiveModal(
                                                          organisation
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
                                                          organisation
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
                                                      this.openDeleteModal(
                                                        organisation
                                                      )
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
                                            ) : (
                                              <div className="py-1">
                                                <Menu.Item>
                                                  <button
                                                    className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                    onClick={() =>
                                                      this.openLeaveOrganisationModal(
                                                        organisation
                                                      )
                                                    }
                                                  >
                                                    <Icon
                                                      name="outline/logout"
                                                      className="h-5 w-5 mr-2"
                                                    />
                                                    <span>Leave</span>
                                                  </button>
                                                </Menu.Item>
                                              </div>
                                            )}
                                          </Menu.Items>
                                        </div>
                                      </Transition>
                                    </Menu>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
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
                  No Organisation Entry
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new Organisation.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={this.openAddOrganisationModal}
                  >
                    <Icon name="add" className="h-4 w-4 mr-2" />
                    Add Organisations
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
                                className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                ORGANISATION NAME
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                OWNER'S EMAIL
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                PlAN
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                STATUS
                              </th>
                              <th
                                scope="col"
                                className="w-2/12 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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
          {this.state.displayOrganisationDetails.length > 0 && (
            <div className="bg-white px-4 py-3 my-4 lg:mx-8 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {this.currOrganisationPage * this.organisationChunkSize +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {(this.currOrganisationPage + 1) *
                        this.organisationChunkSize >
                      this.state.totalRecords
                        ? this.state.totalRecords
                        : (this.currOrganisationPage + 1) *
                          this.organisationChunkSize}
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
                    this.state.totalRecords / this.organisationChunkSize
                  )}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  onPageChange={this.handleOrganisationPageClick}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          )}

          {/*   Organisation Invitation Received */}
          <>
            <div className="max-w-7xl pt-10 mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Organisation Invitation Received
              </h1>
            </div>
            {!this.state.recieveLoading &&
            this.state.displayInvitationRecieveDetails ? (
              <>
                {/*  Organisation Invitation Received Table*/}
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
                                  ORGANISATION NAME
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
                            {this.state.displayInvitationRecieveDetails
                              .length === 0 ? (
                              <tbody>
                                <tr>
                                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    No Invitations Recieved
                                  </td>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody className="bg-white">
                                {this.state.displayInvitationRecieveDetails?.map(
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
                                        {invitation.organisationId.name}
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
                                            onClick={(e: any) =>
                                              this.onActionClick(e, 90)
                                            }
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
                                                        this.openAcceptModal(
                                                          invitation
                                                        )
                                                      }
                                                    >
                                                      <Icon
                                                        name="signin"
                                                        className="h-5 w-5 mr-2"
                                                      />
                                                      <span>
                                                        Accept Invitation
                                                      </span>
                                                    </button>
                                                  </Menu.Item>
                                                  <Menu.Item>
                                                    <button
                                                      className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                      onClick={() =>
                                                        this.openRejectModal(
                                                          invitation
                                                        )
                                                      }
                                                    >
                                                      <Icon
                                                        name="x-circle"
                                                        className="h-5 w-5 mr-2"
                                                      />
                                                      <span>
                                                        Reject Invitation
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
                {this.state.displayInvitationRecieveDetails.length > 0 && (
                  <div className="bg-white px-4 py-3 my-4 lg:mx-8 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {this.currRecievePage * this.recieveChunkSize + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {(this.currRecievePage + 1) *
                              this.recieveChunkSize >
                            this.state.invitationRecieveTotalRecords
                              ? this.state.invitationRecieveTotalRecords
                              : (this.currRecievePage + 1) *
                                this.recieveChunkSize}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {this.state.invitationRecieveTotalRecords}
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
                          this.state.invitationRecieveTotalRecords /
                            this.recieveChunkSize
                        )}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={this.handleRecievePageClick}
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
                                  ORGANISATION NAME
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

          {/* User Invitation Sent */}
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
                                  ORGANISATION NAME
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
                                        {invitation.organisationId.name}
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
                                            onClick={(e: any) =>
                                              this.onActionClick(e, 50)
                                            }
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
                                  ORGANISATION NAME
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

export default compose(
  connector,
  withRouter
)(Organisations) as React.ComponentType;
