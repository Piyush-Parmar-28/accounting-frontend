import { UPDATE_COMMON } from "../types";

const initialState = {
  bulkCopyDone: false,
  lock: undefined
};

const commonReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_COMMON:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default commonReducer;
