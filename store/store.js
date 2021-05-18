import { INIT_ACTION_TYPE } from "./actions.js";

export const createStore = (rootReducer, initialState) => {
  let state = rootReducer(initialState, { type: INIT_ACTION_TYPE });

  return {
    dispatch: (action) => {
      state = rootReducer(state, action);
    },
    getState: () => {
      return state;
    }
  }
}