import agent from "../../agent";
import { APP_LOAD, LOGIN, LOGOUT } from "../types";

const authMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === LOGIN && !action.error) {
    agent.setToken(action.payload.token);
    document.cookie = `token=${action.payload.token}; expires=${new Date(
      Date.now() + 31536000000
    )}; path=/;`;
  } else if (action.type === LOGOUT) {
    agent.setToken(undefined);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } else if (action.type === APP_LOAD && action.error) {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  next(action);
};

export default authMiddleware;
