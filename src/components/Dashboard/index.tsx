import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import agent from "../../agent";
import { adminRights } from "../../constants/defaultUserRights";
import { withRouter } from "../../helpers/withRouter";
import {
  ADD_NOTIFICATION,
  GET_GSTS,
  LOGOUT,
  UPDATE_COMMON,
} from "../../store/types";
import Icon from "../Icon";
import MultiSelect from "../MultiSelect";
import SearchNavigation from "../SearchNavigation";

import { todoList } from "../../pages/Todo/Index";


const menuItems = (firmId: string) => {
	const list = todoList.map((item) => {
		return {
				name: item.name || "Default",
				iconName: "outline/document-text",
				route: `/${firmId}/todo/${item._id}`,
			}		
	});
  
	return [
		{
			name: "Clients",
			iconName: "outline/users",
			route: `/${firmId}/clients/list`,
		},
		{
			name: "Contact Person",
			iconName: "outline/user",
			route: `/${firmId}/contact-person/list`,
		},
		list.length > 0
			? {
					name: "To Do List",
					iconName: "outline/document-text",
					route: `/${firmId}/todo`,
					children: [
						{
							name: "Starred",
							iconName: "outline/star",
							route: `/${firmId}/todo/list/starred`,
						},
						{
							name: "Today",
							iconName: "outline/calendar",
							route: `/${firmId}/todo/list/today`,
						},
						{
							name: "Overdue",
							iconName: "outline/calendar",
							route: `/${firmId}/todo/list/overdue`,
						},
						{
							name: "Week",
							iconName: "outline/calendar",
							route: `/${firmId}/todo/list/week`,
						},
						...list,
					],
			  }
			: {
					name: "To Do List",
					iconName: "outline/document-text",
					route: `/${firmId}/todo/list/starred`,
			  },
		{
			name: "Settings",
			iconName: "outline/settings",
			route: "/settings",
			children: [
				{
					name: "Custom Field",
					iconName: "outline/document-add",
					route: `/${firmId}/custom-field/list`,
				},
				{
					name: "Groups",
					iconName: "outline/group",
					route: `/${firmId}/groups/list`,
				},
				{
					name: "Status",
					iconName: "outline/document-text",
					route: `/${firmId}/status/list`,
				},
				{
					name: "Tags",
					iconName: "outline/tag",
					route: `/${firmId}/tags/list`,
				},
				{
					name: "User",
					iconName: "outline/user-plus",
					route: `/${firmId}/user/list`,
				},
			],
		},
	];
};

interface DashboardProps {
  children: any;
}

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.common,
  ...state.gsts,
  ...state.notification,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLoad: (gsts: any) => dispatch({ type: GET_GSTS, payload: { gsts } }),
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
  onLogout: () => dispatch({ type: LOGOUT }),
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

class Dashboard extends React.Component<DashboardProps, PropsFromRedux> {
  state: {
    menuShow: boolean;
    gsts: any;
    loading: boolean;
    menuState: any;
    subMenuState: any;
    profileMenuShow: boolean;
  };

  constructor(props: DashboardProps) {
    super(props);

    this.state = {
      gsts: undefined,
      loading: false,
      menuShow: false,
      menuState: {},
      subMenuState: {},
      profileMenuShow: false,
    };
  }

  getAllFirms = () => {
    this.setState({ loading: true });
    agent.Firm.getFirms()
      .then((response: any) => {
        (this.props as any).updateCommon({ firms: response.workspaces });
        this.selectDefaultFirm();
        this.setState({ loading: false });
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not fetch Firms",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  selectDefaultFirm = () => {
    const firmId = (this.props as any).params?.firmId;
    const firms = (this.props as any).firms;
    const currentFirmId = (this.props as any).currentFirm?._id;
    if (!currentFirmId && firms?.length > 0) {
      if (firmId) {
        const selectFirm = firms.find((firm: any) => firm._id === firmId);
        (this.props as any).updateCommon({ currentFirm: selectFirm });
      } else {
        (this.props as any).updateCommon({ currentFirm: firms[0] });
      }
    }
  };

  getUserRights = () => {
    const workSpaceId =
      (this.props as any).params?.firmId ||
      (this.props as any).currentFirm?._id;
    if (workSpaceId) {
      agent.User.getUserRights(workSpaceId)
        .then((response: any) => {
          console.log({ righstsss: response });
          if (response.hasOwnProperty("allRights") && response.allRights) {
            (this.props as any).updateCommon({ rights: adminRights });
          } else {
            (this.props as any).updateCommon({ rights: response.rights });
          }
        })
        .catch((err: any) => {
          (this.props as any).onNotify(
            "Could not fetch user rights",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    }
  };

  getStatusList = () => {
    const workSpaceId =
      (this.props as any).params?.firmId ||
      (this.props as any).currentFirm?._id;
    const searchText = "";
    const active = true;
    if (workSpaceId) {
      agent.Status.getStatusList(workSpaceId, active, searchText)
        .then((response: any) => {
          (this.props as any).updateCommon({ status: response.status });
        })
        .catch((err: any) => {
          (this.props as any).onNotify(
            "Could not fetch user status",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    }
  };

  settingMenuToggle = () => {
    const firmId = (this.props as any).params?.firmId;
    if (firmId) {
      let childrenMenus: any = [];
      menuItems(firmId).forEach((item: any) => {
        if (item.children) {
          item.children.forEach((child: any) => {
            const subMenu = { name: item.name, route: child.route };
            childrenMenus.push(subMenu);
          });
        }
      });
      const path = (this.props as any).location.pathname;
      const isSubMenu = childrenMenus.find((item: any) => item.route === path);
      if (isSubMenu) {
        this.setState({ menuState: { [isSubMenu.name]: true } });
      }
    }
  };

  componentDidMount = () => {
    this.getAllFirms();
    this.updateRoute();
    this.getInitialUserInfo();
    this.settingMenuToggle();

    // if (!this.state.loading) {
    //   if ((this.props as any).gsts) {
    //     this.setState({ gsts: (this.props as any).gsts });
    //   } else {
    //     this.setState({ loading: true });
    // agent.Gst.getAll()
    //   .then((response: any) => {
    //     this.setState({ gsts: response.gstin, loading: false });
    //     (this.props as any).updateCommon({
    //       currentGst: (this.props as any).currentGst
    //         ? (this.props as any).currentGst
    //         : response.gstin[0],
    //       currentMonth: (this.props as any).currentMonth
    //         ? (this.props as any).currentMonth
    //         : months[0].name,
    //       currentYear: (this.props as any).currentYear
    //         ? (this.props as any).currentYear
    //         : years[0].name,
    //     });
    //     // this.updatePathName();
    //     setTimeout(() => {
    //       if ((this.props as any).match.url === "/gsts") {
    //         (this.props as any).history.push(
    //           (this.props as any).urlInfo + "/gsts"
    //         );
    //       }
    //     }, 100);
    //     (this.props as any).onLoad(response.gstin);
    //   })
    //   .catch((err: any) => {
    //     this.setState({ loading: false });
    //   });
    // }
    // }
  };

  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (
      prevProps.currentFirm?._id === undefined &&
      (this.props as any)?.currentFirm?._id
    ) {
      this.getUserRights();
      this.getStatusList();
    }

    const prevFirmId = prevProps.params.firmId;
    const currFirmId = (this.props as any).params.firmId;
    if (prevFirmId !== currFirmId) {
      const selectFirm = (this.props as any).firms.find(
        (firm: any) => firm._id === currFirmId
      );
      (this.props as any).updateCommon({ currentFirm: selectFirm });
      this.getUserRights();
      this.getStatusList();
    }
  };

  updatePathName = () => {
    setTimeout(() => {
      if (!this.state.loading) {
        const path = (this.props as any).location.pathname;
        if (path !== "/firms") {
          if ((this.props as any).currentFirm) {
            let newParams = (this.props as any).currentFirm._id;
            let path = (this.props as any).location.pathname;
            (this.props as any).updateCommon({ urlInfo: "/" + newParams });
            let newPath;
            if ((this.props as any).params?.firmId) {
              let paramLength = (this.props as any).params.firmId.length;
              newPath = "/" + newParams + path.substring(paramLength + 1);
            } else {
              newPath = "/" + newParams + path;
            }
            (this.props as any).navigate(newPath);
          }
        }
      }
    }, 100);
  };

  updateRoute = () => {
    let url = (this.props as any).location.pathname;
    let paramLength = (this.props as any).params?.firmId?.length;
    let path = url.substring(paramLength + 1);
    const selectedFirmId = (this.props as any).currentFirm?._id;

    let menuState: any = {};
    let subMenuState: any = {};
    menuItems(selectedFirmId).forEach((menuItem: any) => {
      if (path.indexOf(menuItem.route) === 0) {
        menuState[menuItem.name] = true;
      }
      menuItem.children?.forEach((subItem: any) => {
        if (path.indexOf(subItem.route) === 0) {
          subMenuState[subItem.name] = true;
        }
      });
    });
    this.setState({ menuState, subMenuState });
  };

  getInitialUserInfo = () => {
    // let path = (this.props as any).match?.url;
    // if (path && !(path === "/gsts")) {
    //   let firmId = (this.props as any).match.params?.firmId;
    //   console.log({ firmId });
    //   if (!userId || !year || !month) {
    //     // this.updatePathName();
    //     (this.props as any).onNotify(
    //       "Invalid URL",
    //       "Gstn or year or month is not present",
    //       "danger"
    //     );
    //   } else {
    //     year = year.substring(0, 4) + "-" + year.substring(4);
    //     if (!validFinYear(year)) {
    //       (this.props as any).onNotify(
    //         "Invalid URL",
    //         "Year is not valid",
    //         "warning"
    //       );
    //     } else if (!validFinMonth(month)) {
    //       (this.props as any).onNotify(
    //         "Invalid URL",
    //         "Month is not valid",
    //         "warning"
    //       );
    //     } else {
    //       // (this.props as any).updateCommon({
    //       //   currentYear: year,
    //       //   currentMonth: month,
    //       // });
    //       this.setState({
    //         loading: true,
    //       });
    //       (this.props as any).updateCommon({
    //         urlInfo: "/" + (this.props as any).match.params.userInfo,
    //       });
    //       agent.Gst.getGst(userId)
    //         .then((response: any) => {
    //           console.log("get GST IN------>", response);
    //           if (response.gst) {
    //             (this.props as any).updateCommon({ currentGst: response.gst });
    //           }
    //           this.setState({ loading: false });
    //         })
    //         .catch((err: any) => {
    //           console.log("get GST UserID_____>", { err });
    //           if (err.response) {
    //             (this.props as any).onNotify(
    //               "Invalid URL",
    //               err.response.data?.message,
    //               "danger"
    //             );
    //           }
    //           this.setState({ loading: false });
    //         });
    //     }
    //   }
    // }
  };

  onFirmChange = (item: any) => {
    (this.props as any).updateCommon({ currentFirm: item });
    (this.props as any).onNotify(
      "Firm Changed",
      `Current Firm ${item.name}`,
      "success"
    );
    this.updatePathName();
  };

  toggleDropdown = (name: any) => {
    if (this.state.menuState[name]) {
      this.setState({ menuState: {} });
    } else {
      this.setState({ menuState: { [name]: true } });
    }
  };

  toggleSubItemDropdown = (name: any) => {
    if (this.state.subMenuState[name]) {
      this.setState({ subMenuState: {} });
    } else {
      this.setState({ subMenuState: { [name]: true } });
    }
  };

  openModalHandler = (modalName: string) => {
    (this.props as any).updateCommon({
      currentModal: { modalName, fetchAgain: false },
    });
  };

  toggleMenu = () => {
    this.setState({ menuShow: !this.state.menuShow });
  };

  toggleProfileMenu = () => {
    this.setState({ profileMenuShow: !this.state.profileMenuShow });
  };

  noFirmClickHandler = () => {
    const firmsCount = (this.props as any).firms
      ? (this.props as any).firms?.length
      : 0;

    if (!this.state.loading) {
      if (firmsCount === 0) {
        this.setState({ menuShow: false });
        (this.props as any).updateCommon({
          currentModal: { modalName: "ADD_FIRM_MODAL", fetchAgain: false },
        });
      } else {
        return;
      }
    }
  };

  linkRouteDirect = (route: string) => {
    const firmsCount = (this.props as any).firms
      ? (this.props as any).firms?.length
      : 0;

    if (firmsCount === 0) {
      return "/firms";
    } else {
      return route;
    }
  };

  logout = () => {
    (this.props as any).onLogout();
    (this.props as any).updateCommon({ firms: [], currentFirm: undefined });
    (this.props as any).onNotify(
      "Successful",
      "You have been successfully logged out.",
      "success"
    );
  };

  render() {
    return (
      <div className="h-screen flex overflow-hidden bg-gray-100">
        {/* <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. --> */}

        <Transition.Root show={this.state.menuShow} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={this.toggleMenu}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={this.toggleMenu}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="/images/Logo.png"
                      alt="Workflow"
                    />
                  </div>
                  <div className="mt-5 flex-1 h-0 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                      {menuItems((this.props as any).currentFirm?._id).map(
                        (menuItem: any) =>
                          !menuItem.children ? (
                            <div key={menuItem.name}>
                              <Link
                                to={this.linkRouteDirect(menuItem.route)}
                                key={menuItem.name}
                                className={
                                  (this.props as any).location.pathname ===
                                  menuItem.route
                                    ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                }
                                onClick={this.noFirmClickHandler}
                              >
                                <Icon
                                  name={menuItem.iconName}
                                  className={
                                    this.state.menuState[menuItem.name]
                                      ? "text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                                      : "text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                                  }
                                  aria-hidden="true"
                                />
                                {menuItem.name}
                              </Link>
                            </div>
                          ) : (
                            <div key={menuItem.name}>
                              <Disclosure
                                as="div"
                                key={menuItem.name}
                                className="space-y-1"
                              >
                                {({ open }) => (
                                  <div
                                    onClick={() =>
                                      this.toggleDropdown(menuItem.name)
                                    }
                                  >
                                    <Disclosure.Button className="text-gray-300 w-full justify-between hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                      <span className="flex items-center">
                                        <Icon
                                          name={menuItem.iconName}
                                          className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                          aria-hidden="true"
                                        />
                                        {menuItem.name}
                                      </span>
                                      <ChevronDownIcon
                                        className={
                                          !this.state.menuState[menuItem.name]
                                            ? "text-gray-400 -rotate-90 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                            : "text-gray-300 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                        }
                                      />
                                    </Disclosure.Button>
                                    {this.state.menuState[menuItem.name] ? (
                                      <Disclosure.Panel
                                        className="space-y-1 ml-11 border-l border-gray-700"
                                        static
                                      >
                                        {menuItem.children.map((subItem: any) =>
                                          !subItem.children ? (
                                            <div key={subItem.name}>
                                              <Link
                                                to={this.linkRouteDirect(
                                                  subItem.route
                                                )}
                                                key={subItem.name}
                                                className={
                                                  (this.props as any).location
                                                    .pathname === subItem.route
                                                    ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                    : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                }
                                                onClick={
                                                  this.noFirmClickHandler
                                                }
                                              >
                                                <Icon
                                                  name={subItem.iconName}
                                                  className={
                                                    this.state.menuState[
                                                      menuItem.name
                                                    ]
                                                      ? "text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                                                      : "text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                                                  }
                                                />
                                                {subItem.name}
                                              </Link>
                                            </div>
                                          ) : (
                                            <div key={subItem.name}>
                                              <Disclosure
                                                as="div"
                                                key={subItem.name}
                                                className="space-y-1"
                                              >
                                                {({ open }) => (
                                                  <div
                                                    onClick={() =>
                                                      this.toggleSubItemDropdown(
                                                        subItem.name
                                                      )
                                                    }
                                                  >
                                                    <Disclosure.Button className="text-gray-300 w-full justify-between hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                                      <span className="flex items-center">
                                                        {subItem.name}
                                                      </span>
                                                      <ChevronDownIcon
                                                        className={
                                                          !this.state
                                                            .subMenuState[
                                                            subItem.name
                                                          ]
                                                            ? "text-gray-400 -rotate-90 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                                            : "text-gray-300 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                                        }
                                                      />
                                                    </Disclosure.Button>
                                                    {this.state.subMenuState[
                                                      subItem.name
                                                    ] ? (
                                                      <Disclosure.Panel
                                                        className="space-y-1 ml-6 border-l border-gray-700"
                                                        static
                                                      >
                                                        {subItem.children.map(
                                                          (subSubItem: any) => (
                                                            <Link
                                                              to={this.linkRouteDirect(
                                                                subSubItem.route
                                                              )}
                                                              key={
                                                                subSubItem.name
                                                              }
                                                              className={
                                                                (
                                                                  this
                                                                    .props as any
                                                                ).location
                                                                  .pathname ===
                                                                subSubItem.route
                                                                  ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                                  : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                              }
                                                              onClick={
                                                                this
                                                                  .noFirmClickHandler
                                                              }
                                                            >
                                                              {subSubItem.name}
                                                            </Link>
                                                          )
                                                        )}
                                                      </Disclosure.Panel>
                                                    ) : null}
                                                  </div>
                                                )}
                                              </Disclosure>
                                            </div>
                                          )
                                        )}
                                      </Disclosure.Panel>
                                    ) : null}
                                  </div>
                                )}
                              </Disclosure>
                            </div>
                          )
                      )}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* <div
          className="fixed inset-0 flex z-40 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <Transition
            show={this.state.menuShow}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              aria-hidden="true"
            ></div>
          </Transition>

          <Transition
            show={this.state.menuShow}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
              <Transition
                show={this.state.menuShow}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                    onClick={this.toggleMenu}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <Icon name="outline/x" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </Transition>

              <div className="flex-shrink-0 flex items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="/images/Logo.png"
                  alt="Workflow"
                />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {menuItems((this.props as any).currentFirm?._id).map(
                    (menuItem: any) =>
                      !menuItem.children ? (
                        <div key={menuItem.name}>
                          <Link
                            to={menuItem.route}
                            key={menuItem.name}
                            className={
                              this.props.match.path === menuItem.route
                                ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                            }
                          >
                            <Icon
                              name={menuItem.iconName}
                              className={
                                this.state.menuState[menuItem.name]
                                  ? "text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
                                  : "text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
                              }
                              aria-hidden="true"
                            />
                            {menuItem.name}
                          </Link>
                        </div>
                      ) : (
                        <div key={menuItem.name}>
                          <Disclosure
                            as="div"
                            key={menuItem.name}
                            className="space-y-1"
                          >
                            {({ open }) => (
                              <div
                                onClick={() =>
                                  this.toggleDropdown(menuItem.name)
                                }
                              >
                                <Disclosure.Button className="text-gray-300 w-full justify-between hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                  <span className="flex items-center">
                                    <Icon
                                      name={menuItem.iconName}
                                      className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    {menuItem.name}
                                  </span>
                                  <ChevronDownIcon
                                    className={
                                      !this.state.menuState[menuItem.name]
                                        ? "text-gray-400 -rotate-90 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                        : "text-gray-300 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                    }
                                  />
                                </Disclosure.Button>
                                {this.state.menuState[menuItem.name] ? (
                                  <Disclosure.Panel
                                    className="space-y-1 ml-11 border-l border-gray-500"
                                    static
                                  >
                                    {menuItem.children.map((subItem: any) =>
                                      !subItem.children ? (
                                        <div key={subItem.name}>
                                          <Link
                                            to={subItem.route}
                                            key={subItem.name}
                                            className={
                                              this.props.match.path ===
                                              subItem.route
                                                ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                            }
                                          >
                                            {subItem.name}
                                          </Link>
                                        </div>
                                      ) : (
                                        <div key={subItem.name}>
                                          <Disclosure
                                            as="div"
                                            key={subItem.name}
                                            className="space-y-1"
                                          >
                                            {({ open }) => (
                                              <div
                                                onClick={() =>
                                                  this.toggleSubItemDropdown(
                                                    subItem.name
                                                  )
                                                }
                                              >
                                                <Disclosure.Button className="text-gray-300 w-full justify-between hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                                  <span className="flex items-center">
                                                    {subItem.name}
                                                  </span>
                                                  <ChevronDownIcon
                                                    className={
                                                      !this.state.subMenuState[
                                                        subItem.name
                                                      ]
                                                        ? "text-gray-400 -rotate-90 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                                        : "text-gray-300 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                                    }
                                                  />
                                                </Disclosure.Button>
                                                {this.state.subMenuState[
                                                  subItem.name
                                                ] ? (
                                                  <Disclosure.Panel
                                                    className="space-y-1 ml-6 border-l border-gray-500"
                                                    static
                                                  >
                                                    {subItem.children.map(
                                                      (subSubItem: any) => (
                                                        <Link
                                                          to={subSubItem.route}
                                                          key={subSubItem.name}
                                                          className={
                                                            this.props.match
                                                              .path ===
                                                            subSubItem.route
                                                              ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                              : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                          }
                                                        >
                                                          {subSubItem.name}
                                                        </Link>
                                                      )
                                                    )}
                                                  </Disclosure.Panel>
                                                ) : null}
                                              </div>
                                            )}
                                          </Disclosure>
                                        </div>
                                      )
                                    )}
                                  </Disclosure.Panel>
                                ) : null}
                              </div>
                            )}
                          </Disclosure>
                        </div>
                      )
                  )}
                </nav>
              </div>
            </div>
          </Transition>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            <!-- Dummy element to force sidebar to shrink to fit close icon -->
          </div>
        </div> */}

        {/* <!-- Static sidebar for desktop --> */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            {/* <!-- Sidebar component, swap this element with another sidebar if you like --> */}
            <div className="flex flex-col h-0 flex-1">
              <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
                <img
                  style={{ filter: "invert(1)" }}
                  className="h-8 m-auto w-auto"
                  src="/images/TaxAdda.png"
                  alt="Workflow"
                />
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
                  {menuItems((this.props as any).currentFirm?._id).map(
                    (menuItem: any) =>
                      !menuItem.children ? (
                        <div key={menuItem.name}>
                          <Link
                            to={this.linkRouteDirect(menuItem.route)}
                            key={menuItem.name}
                            className={
                              (this.props as any).location.pathname ===
                              menuItem.route
                                ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                            }
                            onClick={this.noFirmClickHandler}
                          >
                            <Icon
                              name={menuItem.iconName}
                              className={
                                this.state.menuState[menuItem.name]
                                  ? "text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                                  : "text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                              }
                              aria-hidden="true"
                            />
                            {menuItem.name}
                          </Link>
                        </div>
                      ) : (
                        <div key={menuItem.name}>
                          <Disclosure
                            as="div"
                            key={menuItem.name}
                            className="space-y-1"
                          >
                            {({ open }) => (
                              <div>
                                <div
                                  onClick={() =>
                                    this.toggleDropdown(menuItem.name)
                                  }
                                >
                                  <Disclosure.Button className="text-gray-300 w-full justify-between hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                    <span className="flex items-center">
                                      <Icon
                                        name={menuItem.iconName}
                                        className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                      />
                                      {menuItem.name}
                                    </span>
                                    <ChevronDownIcon
                                      className={
                                        !this.state.menuState[menuItem.name]
                                          ? "text-gray-400 -rotate-90 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                          : "text-gray-300 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                      }
                                    />
                                  </Disclosure.Button>
                                </div>
                                {this.state.menuState[menuItem.name] ? (
                                  <Disclosure.Panel
                                    className="space-y-1 ml-11 border-l border-gray-700"
                                    static
                                  >
                                    {menuItem.children.map((subItem: any) =>
                                      !subItem.children ? (
                                        <div key={subItem.name}>
                                          <Link
                                            to={this.linkRouteDirect(
                                              subItem.route
                                            )}
                                            key={subItem.name}
                                            className={
                                              (this.props as any).location
                                                .pathname === subItem.route
                                                ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                            }
                                            onClick={this.noFirmClickHandler}
                                          >
                                            <Icon
                                              name={subItem.iconName}
                                              className={
                                                this.state.menuState[
                                                  menuItem.name
                                                ]
                                                  ? "text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                                                  : "text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                                              }
                                            />
                                            {subItem.name}
                                          </Link>
                                        </div>
                                      ) : (
                                        <div key={subItem.name}>
                                          <Disclosure
                                            as="div"
                                            key={subItem.name}
                                            className="space-y-1"
                                          >
                                            {({ open }) => (
                                              <div
                                                onClick={() =>
                                                  this.toggleSubItemDropdown(
                                                    subItem.name
                                                  )
                                                }
                                              >
                                                <Disclosure.Button className="text-gray-300 w-full justify-between hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                                  <span className="flex items-center">
                                                    <Icon
                                                      name={subItem.iconName}
                                                      className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                      aria-hidden="true"
                                                    />
                                                    {subItem.name}
                                                  </span>
                                                  <ChevronDownIcon
                                                    className={
                                                      !this.state.subMenuState[
                                                        subItem.name
                                                      ]
                                                        ? "text-gray-400 -rotate-90 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                                        : "text-gray-300 ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                                    }
                                                  />
                                                </Disclosure.Button>
                                                {this.state.subMenuState[
                                                  subItem.name
                                                ] ? (
                                                  <Disclosure.Panel
                                                    className="space-y-1 ml-6 border-l border-gray-700"
                                                    static
                                                  >
                                                    {subItem.children.map(
                                                      (subSubItem: any) => (
                                                        <Link
                                                          to={this.linkRouteDirect(
                                                            subSubItem.route
                                                          )}
                                                          key={subSubItem.name}
                                                          className={
                                                            (this.props as any)
                                                              .location
                                                              .pathname ===
                                                            subSubItem.route
                                                              ? "bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                              : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                          }
                                                          onClick={
                                                            this
                                                              .noFirmClickHandler
                                                          }
                                                        >
                                                          {subSubItem.name}
                                                        </Link>
                                                      )
                                                    )}
                                                  </Disclosure.Panel>
                                                ) : null}
                                              </div>
                                            )}
                                          </Disclosure>
                                        </div>
                                      )
                                    )}
                                  </Disclosure.Panel>
                                ) : null}
                              </div>
                            )}
                          </Disclosure>
                        </div>
                      )
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
              onClick={this.toggleMenu}
            >
              <span className="sr-only">Open sidebar</span>
              <Icon
                name="outline/menu-alt-2"
                className="h-6 w-6"
                onClick={this.toggleMenu}
              />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex items-center">
                {((this.props as any).params.firmId ||
                  (this.props as any).location.pathname === "/firms") &&
                  (this.props as any).firms?.length > 1 && (
                    <div className="ml-4 mr-4 w-72 grow">
                      <MultiSelect
                        items={(this.props as any).firms?.map((firm: any) => {
                          return {
                            ...firm,
                            name: firm.name,
                          };
                        })}
                        selected={{
                          name: (this.props as any).currentFirm?.name,
                        }}
                        type="firms"
                        onChange={this.onFirmChange}
                        placeholder="Select Firm"
                      />
                    </div>
                  )}

                {/* <div>
                    <Menu as="div" className="relative">
                      <Menu.Button>
                        <Icon
                          name="add"
                          className="text-blue-700 h-6 w-6 mt-2.5"
                          aria-hidden="true"
                        />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <div>
                          <Menu.Items className="absolute bg-white z-10 left-1/2 rounded-lg transform -translate-x-1/2 mt-8 px-2 w-60 sm:px-0">
                            <span className="absolute -top-2.5 left-1/2 bg-white w-5 h-5 border border-b-0 border-r-0 transform -translate-x-1/2 rotate-45"></span>
                            <div className="py-3 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                              <Menu.Item>
                                <Link
                                  to={`/${
                                    (this.props as any).currentFirm?._id
                                  }/tags/add`}
                                  className="flex items-center w-full p-1 text-gray-700 border-b block px-4 py-2 text-sm text-gray-900"
                                >
                                  <Icon
                                    name="outline/document-text"
                                    className="h-5 w-5 mr-2"
                                  />
                                  <span className="text-blue-700">Tag</span>
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link
                                  to={`/${
                                    (this.props as any).currentFirm?._id
                                  }/status/add`}
                                  className="flex items-center w-full p-1 border-b text-gray-700 block px-4 py-2 text-sm text-gray-900"
                                >
                                  <Icon
                                    name="outline/settings"
                                    className="h-5 w-5 mr-2"
                                  />
                                  <span className="text-blue-700">Status</span>
                                </Link>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </div>
                      </Transition>
                    </Menu>
                  </div> */}
                {/* <Popover className="relative">
                    <>
                      <Popover.Button>
                        <Icon
                          name="add"
                          className="text-blue-700 h-6 w-6 mt-2.5"
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-6 px-2 w-screen max-w-xs sm:px-0">
                          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                              <div className="-m-3 p-3 block rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
                                <Link to="/62cd52e58003c725e4cbbfe2/tags/list">
                                  SKSSL
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  </Popover> */}
                <div>
                  <SearchNavigation openModalHandler={this.openModalHandler} />
                </div>
              </div>

              <div className="ml-4 flex items-center md:ml-6">
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <Icon name="outline/bell" className="h-6 w-6" />
                </button>

                {/* <!-- Profile dropdown --> */}
                <Menu as="div" className="inline-block ml-3 relative">
                  <Menu.Button>
                    <div
                      className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      onClick={this.toggleProfileMenu}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div>
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            <Link
                              to="/"
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              tabIndex={-1}
                              id="user-menu-item-0"
                            >
                              <Icon
                                name="outline/user"
                                className="h-5 w-5 mr-2 text-gray-700"
                              />
                              <span>Your Profile</span>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <Link
                              to="/firms"
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              tabIndex={-1}
                              id="user-menu-item-0"
                            >
                              <Icon
                                name="building-office-2"
                                className="h-5 w-5 mr-2 text-gray-700"
                              />
                              <span>Your Firms</span>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <Link
                              to="/some"
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              tabIndex={-1}
                              id="user-menu-item-0"
                            >
                              <Icon
                                name="outline/settings"
                                className="h-5 w-5 mr-2 text-gray-700"
                              />
                              <span>Settings</span>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              tabIndex={-1}
                              id="user-menu-item-0"
                              onClick={this.logout}
                            >
                              <Icon
                                name="outline/logout"
                                className="h-5 w-5 mr-2 text-gray-700"
                              />
                              <span>Sign out</span>
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </div>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {this.props.children}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default compose(
  connector,
  withRouter
)(Dashboard) as React.ComponentType<DashboardProps>;
