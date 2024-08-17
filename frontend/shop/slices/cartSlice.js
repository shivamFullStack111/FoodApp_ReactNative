import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "user",
  initialState: {
    cart: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload || [];
    },
    increaeQty: (state, action) => {
      const food = state?.cart.find((c) => c._id == action.payload);

      if (food) {
        food.qty += 1;
      }
    },
    decreaseQty: (state, action) => {
      const food = state.cart.find((c) => c._id == action.payload);
      if (food) {
        food.qty -= 1;
      }
    },
    removeItem: async (state, action) => {
      const filterCart = state.cart?.filter((c) => c._id !== action.payload);
      state.cart = filterCart;

      await AsyncStorage.setItem("cart", JSON.stringify(filterCart));
    },
  },
});

export default cartSlice.reducer;
export const { setCart, increaeQty, decreaseQty, removeItem } =
  cartSlice.actions;
