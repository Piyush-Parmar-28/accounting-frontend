import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import agent from "../agent";
import { connect, ConnectedProps } from "react-redux";
import { ADD_NOTIFICATION } from "../store/types";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Icon from "./Icon";

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

type Props = {
  onLoad?: (forSearch: boolean) => void;
  logModalSetOpen?: (open: boolean) => void;
  state?: any;
  type?: any;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function LogModal(props: Props & PropsFromRedux) {
  interface state {
    logging: boolean;
    logs: any;
  }

  // onKeyUpFunction = onKeyUpFunction.bind(this);

  const initialState = {
    logging: false,
    logs: [],
  };

  const [state, setState] = React.useState<state>(initialState);
  // onKeyUpFunction(event: any) {
  //   if (event.keyCode === 27) {
  //     setOpen(false);
  //   }

  //   if (event.keyCode === 13) {
  //     activeRow();
  //   }
  // }

  // componentDidMount() {
  //   {
  //     console.log("compenent mounted");
  //   }
  //   document.addEventListener("keydown", onKeyUpFunction, false);
  // }

  // componentWillUnmount() {
  //   document.removeEventListener("keydown", onKeyUpFunction, false);
  // }

  const getAccountLog = () => {
    const organisationId = (props as any)?.currentOrganisation._id;
    const accountId = props.state.selectedRow._id;
    if (accountId !== undefined) {
      setState((prevState) => ({ ...prevState, logging: true }));

      agent.Account.getAccountLog(organisationId, accountId)
        .then((response: any) => {
          console.log(response);
          setState((prevState) => ({ ...prevState, logging: false }));
          setState((prevState) => ({
            ...prevState,
            logs: response.accountLog,
          }));
          onLoad();
        })
        .catch((err: any) => {
          setState((prevState) => ({ ...prevState, logging: false }));
        });
    }
  };

  const activeRow = () => {
    switch (props.type) {
      case "account":
        return getAccountLog();
      default:
        return;
    }
  };

  useEffect(() => {
    activeRow();
  }, []);

  const setOpen = (open: boolean) => {
    (props as any).logModalSetOpen(open);
  };

  const onLoad = () => {
    (props as any).onLoad();
  };

  return (
    <>
      <Transition.Root show={(props as any).state.showLogModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => null}
        >
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
              <div className="inline-block align-bottom bg-white rounded-lg px-12 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
                {/* <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5"> */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {"Account Log"}
                  </h3>
                </div>
                <form className="space-y-8 divide-y">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Name*
                    </label>
                    <div>Prateek</div>
                  </div>

                  {/* button */}
                  <div className="space-y-8 divide-y  right-0  divide-gray-200 sm:space-y-5">
                    <div></div>
                    <button
                      type="button"
                      disabled={state.logging}
                      className={
                        "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm  "
                      }
                      onClick={() => setOpen(false)}
                    >
                      <span className="w-full flex justify-end">
                        {state.logging ? (
                          <Icon name="loading" className="mr-2" />
                        ) : null}
                      </span>
                      <span>Close</span>
                      <span className="w-full"></span>
                    </button>
                  </div>
                </form>

                {/* </div> */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default connector(LogModal);
