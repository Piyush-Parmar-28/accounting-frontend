import { GET_GSTS, ADD_GST } from "../types";

const initialState: any = {};

const gstsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_GSTS:
      return {
        ...state,
        gsts: action.payload.gsts
      };
    case ADD_GST:
      return {
        ...state,
        gsts: state.gsts.concat(action.payload.gst).sort((a: any, b: any) => {
          let fa = a.lgnm.toLowerCase(),
            fb = b.lgnm.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        })
      };
    default:
      return state;
  }
};

export default gstsReducer;
