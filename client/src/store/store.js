import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import accountReducer from "./slices/accountSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
  },
});

export default store;
