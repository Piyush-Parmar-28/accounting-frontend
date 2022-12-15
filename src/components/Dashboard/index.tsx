import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import agent from "../../agent";
import SelectMenu from "../SelectMenu";
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

const getCurrentFinYear = () => {
  const todayDate5 = new Date();
  todayDate5.setMonth(todayDate5.getMonth());
  const currentYear = todayDate5.getFullYear();
  const month = todayDate5.toLocaleString("default", { month: "long" });
  if (month === "January" || month === "February" || month === "March") {
    return currentYear - 1 + "-" + (currentYear - 2000);
  }
  return currentYear + "-" + (currentYear + 1 - 2000);
};

const menuItems = (organisationId: string) => {
  const list = todoList.map((item) => {
    return {
      name: item.name || "Default",
      iconName: "outline/document-text",
      route: `/${organisationId}/todo/${item._id}`,
    };
  });

  return [
    {
      name: "Clients",
      iconName: "outline/users",
      route: `/${organisationId}/clients/list`,
    },
    {
      name: "Contact Person",
      iconName: "outline/user",
      route: `/${organisationId}/contact-person/list`,
    },
    list.length > 0
      ? {
          name: "To Do List",
          iconName: "outline/document-text",
          route: `/${organisationId}/todo`,
          children: [
            {
              name: "Starred",
              iconName: "outline/star",
              route: `/${organisationId}/todo/list/starred`,
            },
            {
              name: "Today",
              iconName: "outline/calendar",
              route: `/${organisationId}/todo/list/today`,
            },
            {
              name: "Overdue",
              iconName: "outline/calendar",
              route: `/${organisationId}/todo/list/overdue`,
            },
            {
              name: "Week",
              iconName: "outline/calendar",
              route: `/${organisationId}/todo/list/week`,
            },
            ...list,
          ],
        }
      : {
          name: "To Do List",
          iconName: "outline/document-text",
          route: `/${organisationId}/todo/list/starred`,
        },

    {
      name: "Journal Entry",
      iconName: "outline/settings",
      route: `/${organisationId}/journal-entry/list`,
    },

    {
      name: "Accounts",
      iconName: "outline/settings",
      route: "/settings",
      children: [
        {
          name: "Year End Balances",
          iconName: "outline/document-add",
          route: `/${organisationId}/account/list`,
        },
        {
          name: "Opening Balances",
          iconName: "outline/group",
          route: `/${organisationId}/account/list-with-opening-balances`,
        },
      ],
    },
    {
      name: "Settings",
      iconName: "outline/settings",
      route: "/settings",
      children: [
        {
          name: "Custom Field",
          iconName: "outline/document-add",
          route: `/${organisationId}/custom-field/list`,
        },
        {
          name: "Groups",
          iconName: "outline/group",
          route: `/${organisationId}/groups/list`,
        },
        {
          name: "Status",
          iconName: "outline/document-text",
          route: `/${organisationId}/status/list`,
        },
        {
          name: "Tags",
          iconName: "outline/tag",
          route: `/${organisationId}/tags/list`,
        },
        {
          name: "User",
          iconName: "outline/user-plus",
          route: `/${organisationId}/user/list`,
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

  getAllOrganisations = () => {
    this.setState({ loading: true });
    agent.Organisation.getOrganisations()
      .then((response: any) => {
        (this.props as any).updateCommon({
          organisations: response.organisations,
        });
        this.selectDefaultOrganisation();
        this.setState({ loading: false });
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not fetch Organisations",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  selectDefaultOrganisation = () => {
    const organisationId = (this.props as any).params?.organisationId;
    const organisations = (this.props as any).organisations;
    const currentOrganisationId = (this.props as any).currentOrganisation?._id;
    if (!currentOrganisationId && organisations?.length > 0) {
      if (organisationId) {
        const selectOrganisation = organisations.find(
          (organisation: any) => organisation._id === organisationId
        );
        (this.props as any).updateCommon({
          currentOrganisation: selectOrganisation,
        });
      } else {
        (this.props as any).updateCommon({
          currentOrganisation: organisations[0],
        });
      }
    }
    (this.props as any).updateCommon({
      currentYear: getCurrentFinYear(),
    });
  };

  getAllYears = () => {
    const years = [
      "2021-22",
      "2022-23",
      "2023-24",
      "2024-25",
      "2025-26",
      "2026-27",
      "2027-28",
      "2028-29",
      "2029-30",
    ];
    let yearsToShow = [];
    const currentOrganisationStartingYear = (this.props as any)
      .currentOrganisation?.startingYear;
    const indexOfCurrentYear = years.indexOf(getCurrentFinYear());
    for (const year of years) {
      if (
        years.indexOf(year) >= years.indexOf(currentOrganisationStartingYear) &&
        years.indexOf(year) <= indexOfCurrentYear
      ) {
        yearsToShow.push(year);
      }
    }
    return yearsToShow;
  };

  getUserRights = () => {
    const organisationId =
      (this.props as any).params?.organisationId ||
      (this.props as any).currentOrganisation?._id;
    if (organisationId) {
      agent.User.getUserRights(organisationId)
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

  getAccountList = () => {
    const organisationId =
      (this.props as any).params?.organisationId ||
      (this.props as any).currentOrganisation?._id;
    const searchText = "";
    const active = true;
    if (organisationId) {
      agent.Account.getAccountList(organisationId, active, searchText, "all")
        .then((response: any) => {
          console.log(response);
          (this.props as any).updateCommon({ accounts: response.accounts });
        })
        .catch((err: any) => {
          (this.props as any).onNotify(
            "Could not fetch account list.",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    }
  };

  settingMenuToggle = () => {
    const organisationId = (this.props as any).params?.organisationId;
    if (organisationId) {
      let childrenMenus: any = [];
      menuItems(organisationId).forEach((item: any) => {
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
    this.getAllOrganisations();
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
      prevProps.currentOrganisation?._id === undefined &&
      (this.props as any)?.currentOrganisation?._id
    ) {
      this.getUserRights();
      this.getAccountList();
    }

    const prevOrganisationId = prevProps.params.organisationId;
    const currOrganisationId = (this.props as any).params.organisationId;
    if (prevOrganisationId !== currOrganisationId) {
      const selectOrganisation = (this.props as any).organisations.find(
        (organisation: any) => organisation._id === currOrganisationId
      );
      (this.props as any).updateCommon({
        currentOrganisation: selectOrganisation,
      });
      this.getUserRights();
      this.getAccountList();
    }
  };

  updatePathName = () => {
    setTimeout(() => {
      if (!this.state.loading) {
        const path = (this.props as any).location.pathname;
        if (path !== "/organisations") {
          if ((this.props as any).currentOrganisation) {
            let newParams = (this.props as any).currentOrganisation._id;
            let path = (this.props as any).location.pathname;
            (this.props as any).updateCommon({ urlInfo: "/" + newParams });
            let newPath;
            if ((this.props as any).params?.organisationId) {
              let paramLength = (this.props as any).params.organisationId
                .length;
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
    let paramLength = (this.props as any).params?.organisationId?.length;
    let path = url.substring(paramLength + 1);
    const selectedOrganisationId = (this.props as any).currentOrganisation?._id;

    let menuState: any = {};
    let subMenuState: any = {};
    menuItems(selectedOrganisationId).forEach((menuItem: any) => {
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
    //   let organisationId = (this.props as any).match.params?.organisationId;
    //   console.log({ organisationId });
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

  onOrganisationChange = (item: any) => {
    (this.props as any).updateCommon({ currentOrganisation: item });
    (this.props as any).onNotify(
      "Organisation Changed",
      `Current Organisation ${item.name}`,
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

  noOrganisationClickHandler = () => {
    const organisationsCount = (this.props as any).organisations
      ? (this.props as any).organisations?.length
      : 0;

    if (!this.state.loading) {
      if (organisationsCount === 0) {
        this.setState({ menuShow: false });
        (this.props as any).updateCommon({
          currentModal: {
            modalName: "ADD_ORGANISATION_MODAL",
            fetchAgain: false,
          },
        });
      } else {
        return;
      }
    }
  };

  linkRouteDirect = (route: string) => {
    const organisationsCount = (this.props as any).organisations
      ? (this.props as any).organisations?.length
      : 0;

    if (organisationsCount === 0) {
      return "/organisations";
    } else {
      return route;
    }
  };

  logout = () => {
    (this.props as any).onLogout();
    (this.props as any).updateCommon({
      organisations: [],
      currentOrganisation: undefined,
    });
    (this.props as any).onNotify(
      "Successful",
      "You have been successfully logged out.",
      "success"
    );
  };

  onYearChange = (year: any) => {
    (this.props as any).updateCommon({ currentYear: year.name });
    this.updatePathName();
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
                      {menuItems(
                        (this.props as any).currentOrganisation?._id
                      ).map((menuItem: any) =>
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
                              onClick={this.noOrganisationClickHandler}
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
                                                this.noOrganisationClickHandler
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
                                                                .noOrganisationClickHandler
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
                  {menuItems((this.props as any).currentOrganisation?._id).map(
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
                            onClick={this.noOrganisationClickHandler}
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
                                            onClick={
                                              this.noOrganisationClickHandler
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
                                                              .noOrganisationClickHandler
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
                {((this.props as any).params.organisationId ||
                  (this.props as any).location.pathname === "/organisations") &&
                  (this.props as any).organisations?.length > 0 && (
                    <div className="ml-4 w-72 grow">
                      <MultiSelect
                        items={(this.props as any).organisations?.map(
                          (organisation: any) => {
                            return {
                              ...organisation,
                              name: organisation.name,
                            };
                          }
                        )}
                        selected={{
                          name: (this.props as any).currentOrganisation?.name,
                        }}
                        type="organisations"
                        onChange={this.onOrganisationChange}
                        placeholder="Select Organisation"
                      />
                    </div>
                  )}

                <div className="ml-4 mr-4 flex">
                  <SelectMenu
                    items={this.getAllYears()?.map((year: any) => {
                      return {
                        ...year,
                        name: year,
                      };
                    })}
                    selected={{ name: (this.props as any).currentYear }}
                    onChange={this.onYearChange}
                  />
                </div>

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
                              to="/organisations"
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              tabIndex={-1}
                              id="user-menu-item-0"
                            >
                              <Icon
                                name="building-office-2"
                                className="h-5 w-5 mr-2 text-gray-700"
                              />
                              <span>Your Organisations</span>
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
