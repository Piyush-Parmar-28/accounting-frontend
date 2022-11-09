import { LOGIN, UserAction, LOGOUT, TOKEN_PRESENT } from "../types";

interface IUser {
  isAuthenticated: boolean;
}

let authState: IUser = {
  isAuthenticated: false
};

export default function authReducer(state = authState, action: UserAction) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false
      };
    case TOKEN_PRESENT:
      const token = action.payload.token;
      if (token === "PRESENT")
        return {
          ...state,
          isAuthenticated: true
        };
      else {
        return state;
      }
    default:
      return state;
  }
}
