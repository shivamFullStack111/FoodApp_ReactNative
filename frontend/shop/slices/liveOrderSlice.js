import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const LiveOrderSlice = createSlice({
  name: "liveOrder",
  initialState: {
    destination: {
      latitude: null,
      longitude: null,
    },
    origin: {
      latitude: null,
      longitude: null,
    },
    distance: null,
    minutes: null,
    partnerLiveOrder: null,
  },
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setMinutes: (state, action) => {
      state.minutes = action.payload;
    },
    setPartnerLiveOrder: (state, action) => {
      state.partnerLiveOrder = action.payload;
    },
  },
});

export default LiveOrderSlice.reducer;
export const {
  setOrigin,
  setDestination,
  setDistance,
  setMinutes,
  setPartnerLiveOrder,
} = LiveOrderSlice.actions;
