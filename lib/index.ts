import { createStore, applyMiddleware, compose } from "redux";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { modelReducer } from "./reducer/modelReducer";
import reduxThunk from "redux-thunk";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const bindMiddelware: (middlerWare: any[]) => any = (middlerWare: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(compose(applyMiddleware(reduxThunk)));
  }
  return compose(
    applyMiddleware(...middlerWare),
    window && (window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose)
  );
};

const reducer: (store: any, action: any) => any = (store, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...store,
      ...action.payload,
    };
    return nextState;
  }

  return modelReducer(store, action);
};

const initStore: () => any = () =>
  createStore(reducer, bindMiddelware([reduxThunk]));

export default createWrapper(initStore);
