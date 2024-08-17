import axios from "axios";
import { setIsAuthenticated, setUser } from "./shop/slices/userSlice";
import { backendUrl } from "./utils";

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    // token = JSON.parse(token);
    if (token) {
      const res = await axios.get(`${backendUrl}isauthenticated`, {
        headers: { Authorization: token },
      });
      return res;
    }
  } catch (error) {
    console.log(error.message);
  }
};
