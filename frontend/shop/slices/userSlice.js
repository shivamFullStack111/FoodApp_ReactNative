import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isSeller: false,
    allFoodsOfSeller: [],
    allShops: [],
    allFoods: [],
    toggleForUserAllOrder: 0,
    sellerAllOrders: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setIsSeller: (state, action) => {
      state.isSeller = action.payload;
    },
    setAllFoodsOfSeller: (state, action) => {
      state.allFoodsOfSeller = action.payload;
    },
    setAllShops: (state, action) => {
      state.allShops = action.payload;
    },
    setAllFoods: (state, action) => {
      state.allFoods = action.payload;
    },
    setToggleForUserAllOrder: (state, action) => {
      state.toggleForUserAllOrder = state.toggleForUserAllOrder + 1;
    },
    setSellerAllOrders: (state, action) => {
      state.sellerAllOrders = action.payload;
    },
    addOneItemToSellerAllOrder: (state, action) => {
      console.log(action.payload, "reduxxxxxxxxxxxxxxxxxxxxx");
      state.sellerAllOrders = [...state.sellerAllOrders, action.payload];
    },
  },
});

export default userSlice.reducer;
export const {
  setUser,
  setSellerAllOrders,
  addOneItemToSellerAllOrder,
  setIsLoading,
  setIsAuthenticated,
  setIsSeller,
  setAllFoodsOfSeller,
  setAllShops,
  setAllFoods,
  setToggleForUserAllOrder,
} = userSlice.actions;
