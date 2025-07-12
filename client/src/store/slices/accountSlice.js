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
    updateAccount(state, action) {
      const updated = action.payload;
      const index = state.accounts.findIndex(
        (account) => account._id === updated._id
      );

      if (index !== -1) {
        state.accounts[index] = updated;

        if (
          state.selectedAccount &&
          state.selectedAccount._id === updated._id
        ) {
          state.selectedAccount = updated;
        }
      }
    },
    clearAccount(state) {
      state.accounts = [];
      state.selectedAccount = null;
    },
  },
});

export const { setAccounts, addAccount, setSelectedAccount, clearAccounts, updateAccount } =
  accountSlice.actions;

export default accountSlice.reducer;
