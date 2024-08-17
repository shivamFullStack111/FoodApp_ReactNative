import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    activeUsers: [],
    liveLocation: null,
    nearOrdersForSeller: [],
  },
  reducers: {
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    setLiveLocation: (state, action) => {
      state.liveLocation = action.payload;
    },
    setNearOrdersForDelivery: (state, action) => {
      state.nearOrdersForSeller = action.payload;
    },
    addMultipleItemToNearOrderForDelivery: (state, action) => {
      state.nearOrdersForSeller = [
        ...state.nearOrdersForSeller,
        ...action.payload,
      ];
    },
    addOneItemToNearOrdersDelivery: (state, action) => {
      let data = action?.payload?.order
        ? action?.payload?.order
        : action.payload;
      state.nearOrdersForSeller = [...state.nearOrdersForSeller, data];
    },
    updateOrderToAccepted: (state, action) => {
      console.log(action.payload, "h");
      let updateData = state.nearOrdersForSeller?.map((ordr) => {
        if (action.payload !== ordr._id) return ordr;
        else
          return {
            ...ordr,
            isorderacceptedbydelivery: true,
          };
      });

      console.log(updateData);

      state.nearOrdersForSeller = updateData;
    },
  },
});

export const {
  setActiveUsers,
  setLiveLocation,
  setNearOrdersForDelivery,
  addOneItemToNearOrdersDelivery,
  addMultipleItemToNearOrderForDelivery,
  updateOrderToAccepted,
} = socketSlice.actions;
export default socketSlice.reducer;
