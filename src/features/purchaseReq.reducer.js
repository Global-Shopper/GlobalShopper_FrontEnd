import { resetOfflineRequest } from "./offlineReq";
import { resetOnlRequest } from "./onlineReq";

export const resetAllPurchaseReq = () => dispatch => {
  dispatch(resetOnlRequest());
  dispatch(resetOfflineRequest());
}