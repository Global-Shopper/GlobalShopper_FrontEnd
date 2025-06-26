import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/lib/persistReducer";
import appReducer from "../features/app";
import userReducer from "../features/user";
import authReducer from "../features/auth";
import storage from "redux-persist/lib/storage";

const userPersistConfig = {
  key: "user",
  storage: storage,
  // blacklist: [ 'isLoading']
};

const combinedReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  user: persistReducer(userPersistConfig, userReducer),
});

const rootReducer = (state, action) => {
	return combinedReducer(state, action);
};
export default rootReducer;
