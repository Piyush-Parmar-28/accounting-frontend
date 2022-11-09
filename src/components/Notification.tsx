import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import { REMOVE_NOTIFICATION } from "../store/types";

const mapStateToProps = (state: any) => ({
  ...state.notification,
});

const mapDispatchToProps = (dispatch: any) => ({
  onRemoveNotification: (id: string) =>
    dispatch({ type: REMOVE_NOTIFICATION, payload: { id } }),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class Notification extends React.Component<PropsFromRedux> {
  componentDidUpdate(prevProps: any) {
    if (
      prevProps.notifications?.length <
      (this.props as any).notifications?.length
    ) {
      const id = (this.props as any).notifications[
        (this.props as any).notifications.length - 1
      ].id;
      setTimeout(() => {
        (this.props as any).onRemoveNotification(id);
      }, 5000);
    }
  }

  render() {
    return (
      <>
        {/* Global notification live region, render this permanently at the end of the document */}
        <div
          aria-live="assertive"
          className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
        >
          <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
            {(this.props as any).notifications.map((notification: any) => {
              return (
                <Transition
                  show={true}
                  as={Fragment}
                  enter="transform ease-out duration-300 transition"
                  enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                  enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                  key={notification.id}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <notification.icon
                            className={
                              notification.color === "red"
                                ? "h-6 w-6 text-red-400"
                                : notification.color === "green"
                                ? "h-6 w-6 text-green-400"
                                : "h-6 w-6 text-yellow-400"
                            }
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {notification.message}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                          <button
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => {
                              (this.props as any).onRemoveNotification(
                                notification.id
                              );
                            }}
                          >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default connector(Notification);
