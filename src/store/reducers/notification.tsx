import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ADD_NOTIFICATION,
  NotificationAction,
  REMOVE_NOTIFICATION,
} from "../types";

// Defining Structure of notification object
interface INotification {
  notifications: {
    color: string;
    icon: any;
    id?: string;
    message?: string;
    title: string;
    type?: string;
  }[];
}

// Initializing empty Notification Array
const initialState: INotification = {
  notifications: [],
};

// Types of Notifications
const notifyTypes = [
  {
    type: "success",
    icon: CheckCircleIcon,
    color: "green",
  },
  {
    type: "danger",
    icon: ExclamationCircleIcon,
    color: "red",
  },
  {
    type: "warn",
    icon: InformationCircleIcon,
    color: "orange",
  },
];

// Notifications Reducer
const notificationReducer = (
  state = initialState,
  action: NotificationAction
) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      const id = Date.now().toString(36);
      const notify =
        action.payload.type === "success"
          ? notifyTypes[0]
          : action.payload.type === "danger"
          ? notifyTypes[1]
          : notifyTypes[2];

      return {
        ...state,
        notifications: state.notifications.concat([
          {
            color: notify.color,
            icon: notify.icon,
            id,
            message: action.payload.message,
            title: action.payload.title,
            type: action.payload.type,
          },
        ]),
      };
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((notification) => {
          return action.payload.id !== notification.id;
        }),
      };
    default:
      return state;
  }
};

//ACTIONS

export const onNotify = (title: string, message: string, type: string) => {
  return {
    type: ADD_NOTIFICATION,
    payload: {
      title,
      message,
      type,
    },
  };
};

export default notificationReducer;
