import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendUrl } from "../utils";

export const updateStatusOfOrder = async (status, orderid) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) alert("token not found for update order status");

    const res = await axios.post(
      `${backendUrl}update-order-status`,
      { status, orderid },
      {
        headers: { Authorization: token },
      }
    );

    return res;
  } catch (error) {
    console.log(error.message);
  }
};
