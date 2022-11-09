import { applyMiddleware, combineReducers, createStore } from "redux";
import createLogger from "redux-logger";
import authMiddleware from "./middlewares/auth";
import common from "./reducers/common";
import gsts from "./reducers/gsts";
import notification from "./reducers/notification";
import user from "./reducers/userAuth";

const rootReducer = combineReducers({
  common,
  gsts,
  notification,
  user
});

const store = createStore(
  rootReducer,
  applyMiddleware(createLogger, authMiddleware)
);

export type RootState = ReturnType<typeof rootReducer>;

export default store;
