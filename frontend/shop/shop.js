import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import liveOrderReducer from "./slices/liveOrderSlice";
import socketReducer from "./slices/socketSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    liveOrder: liveOrderReducer,
    socket: socketReducer,
  },
});

export default store;
