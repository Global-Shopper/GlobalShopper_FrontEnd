import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/lib/persistReducer";
import appReducer from "../features/app";
import userReducer from "../features/user";
import authReducer from "../features/auth";
import quotationReducer from "../features/quotation";
import storage from "redux-persist/lib/storage";
import onlineReqReducer from "../features/onlineReq";

const userPersistConfig = {
  key: "user",
  storage: storage,
  // blacklist: [ 'isLoading']
};

const combinedReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  user: persistReducer(userPersistConfig, userReducer),
  quotation: quotationReducer,
  onlineReq: onlineReqReducer,
});

const rootReducer = (state, action) => {
	return combinedReducer(state, action);
};
export default rootReducer;
