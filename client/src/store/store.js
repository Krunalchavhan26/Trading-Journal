import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import accountReducer from "./slices/accountSlice";
import orderbookReducer from "./slices/orderbookSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
    orderbook: orderbookReducer,
  },
});

export default store;
