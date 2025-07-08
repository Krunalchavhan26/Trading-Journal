import { createSlice } from "@reduxjs/toolkit";

const orderbookSlice = createSlice({
  name: "Orderbook",
  initialState: {
    orderbooks: [],
  },
  reducers: {
    setOrderbooks: (state, action) => {
      state.orderbooks = action.payload;
    },
    addOrderbook: (state, action) => {
      state.orderbooks.push(action.payload);
    },
    updateOrderbook: (state, action) => {
      const index = state.orderbooks.findIndex(
        (ob) => ob._id === action.payload._id
      );
      if (index !== -1) {
        state.orderbooks[index] = action.payload;
      }
    },
    removeOrderbook: (state, action) => {
      state.orderbooks = state.orderbooks.filter(
        (ob) => ob._id !== action.payload
      );
    },
    resetOrderbooks: (state) => {
      state.orderbooks = [];
    },
  },
});

export const {
  setOrderbooks,
  addOrderbook,
  updateOrderbook,
  removeOrderbook,
  resetOrderbooks,
} = orderbookSlice.actions;

export default orderbookSlice.reducer;
