import { types } from "../actionAndTypes/types";

export const modelReducer: (
  store: any,
  action: {
    type: any;
    payload: any;
  }
) => any = (store, action) => {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...store,
      };
    default:
      return store || {};
  }
};
