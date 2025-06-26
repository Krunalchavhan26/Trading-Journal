import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accounts: [],
  selectedAccount: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts(state, action) {
      state.accounts = action.payload;
    },
    addAccount(state, action) {
      state.accounts.push(action.payload);
    },
    setSelectedAccount(state, action) {
      state.selectedAccount = action.payload;
    },
    clearAccount(state) {
      state.accounts = [];
      state.selectedAccount = null;
    },
  },
});

export const {
  setAccounts,
  addAccount,
  setSelectedAccount,
  clearAccounts
} = accountSlice.actions;

export default accountSlice.reducer;