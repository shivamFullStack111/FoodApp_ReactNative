import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";

import { ScrollView } from "react-native-gesture-handler";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { backendUrl, colors, fonts } from "../utils";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQty,
  increaeQty,
  removeItem,
  setCart,
} from "../shop/slices/cartSlice";
import axios from "axios";
import { useSocket } from "../SocketContext";
import { setToggleForUserAllOrder } from "../shop/slices/userSlice";

const Cart = () => {
  const navigation = useNavigation();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { activeUsers } = useSelector((state) => state.socket);
  const { socket } = useSocket();

  const handleAddMoreItem = async (email) => {
    try {
      const res = await axios.get(`${backendUrl}get-seller/${email}`);

      navigation.navigate(`shop`, {
        shopdetail: res.data?.seller,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleConfirmPayment = async () => {
    if (!cart.length) return alert("please add item to bucket");

    const orderData = {
      foods: cart,
      user: user,
      tax: subTotal() * 0.3 || 0,
      amount: subTotal().split("$")[1],
      seller: cart[0]?.seller,
    };
    const addToAsyncStorage = async () => {
      try {
        await AsyncStorage.setItem("latestOrder", JSON.stringify(orderData));
      } catch (error) {
        console.log(error.message);
      }
    };
    addToAsyncStorage();

    const newOrder = null;

    const createOrder = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // const token = JSON.parse(tkn);

        if (!token)
          return alert("login token not found please login to continue");

        const res = await axios.post(`${backendUrl}create-order`, orderData, {
          headers: { Authorization: token },
        });

        if (res?.data?.success) {
          dispatch(setCart([]));
          await AsyncStorage.setItem("cart", JSON.stringify([]));
        }

        if (res.data?.success) {
          dispatch(setToggleForUserAllOrder());
          return res;
        }

        alert(res.data?.message);
      } catch (error) {
        console.log(error.message);
      }
    };

    const res = await createOrder();

    //?if seller in socket then sending notification.....................

    let sellerData = activeUsers?.find(
      (usr) => usr?.user?.email == cart[0]?.seller
    );

    sellerData = { ...sellerData, cart };

    if (sellerData && socket) {
      socket.emit("newOrder", { sellerData, order: res?.data?.order });
    }

    // navigation.navigate("paymentPage", { order: res.data?.order });
  };

  const subTotal = () => {
    const total = cart?.reduce((value, item) => {
      return value + item.price * item?.qty;
    }, 0);
    return "$" + (total + 6);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#eaf0f6" }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: "95%", alignSelf: "center" }}>
          {/* header */}
          <View
            style={{
              flexDirection: "row",
              gap: 7,
              alignItems: "center",
              padding: 5,
              paddingVertical: 10,
            }}
          >
            <AntDesign
              onPress={() => navigation.goBack()}
              name="left"
              size={24}
              color="black"
            />
            <View>
              <Text
                style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 17.5 }}
              >
                Sharma Sweets
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 14 }}
                >
                  Delivery at Home
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 13,
                    marginLeft: 3,
                  }}
                >
                  {user?.address?.houseno} {user?.address?.area}
                  {user?.address?.nearby} , {user?.address?.city}
                </Text>
              </View>
            </View>
          </View>

          {cart?.length > 0 && (
            <View>
              <Text
                style={{
                  fontFamily: fonts.Roboto_900Black,
                  alignSelf: "center",
                  color: "gray",
                  fontSize: 17,
                  marginTop: 15,
                }}
              >
                Item(S) Added
              </Text>
              <View
                style={{
                  borderRadius: 15,
                  padding: 13,
                  marginTop: 10,
                  backgroundColor: "white",
                  gap: 25,
                }}
              >
                {cart?.map((food, i) => (
                  <CartItem food={food} key={i}></CartItem>
                ))}
              </View>
            </View>
          )}

          {cart?.length == 0 && (
            <View
              style={{
                width: "100%",
                height: 200,
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5
                onPress={() => navigation.navigate("home")}
                name="cart-plus"
                size={40}
                color={colors.secondary}
              />
            </View>
          )}

          {/* requests */}

          <View
            style={{
              borderRadius: 15,
              backgroundColor: "white",
              marginTop: 20,
              padding: 10,
              paddingBottom: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => handleAddMoreItem(cart[0]?.seller)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: 0.7,
                  paddingVertical: 8,
                  paddingBottom: 14,
                  borderStyle: "dashed",
                }}
              >
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Feather name="plus-circle" size={20} color="black" />
                  <Text>Add more items</Text>
                </View>
                <AntDesign name="right" size={20} color="gray" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 14,
                  paddingBottom: 14,
                }}
              >
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <MaterialCommunityIcons
                    name="note-edit-outline"
                    size={20}
                    color="black"
                  />
                  <Text>Add cooking requests </Text>
                </View>
                <AntDesign name="right" size={20} color="gray" />
              </View>
            </TouchableOpacity>
          </View>

          {/* summary */}
          <View
            style={{
              borderRadius: 15,
              backgroundColor: "white",
              marginTop: 20,
              padding: 10,
              marginBottom: 20,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 18 }}
              >
                Subtotal
              </Text>
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 16 }}
              >
                {subTotal()}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontFamily: fonts.Roboto_400Regular, fontSize: 14 }}
              >
                GST and restaurant charges{" "}
              </Text>
              <Text>$6</Text>
            </View>
          </View>

          {/* address */}
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
          // position: "absolute",
          paddingTop: 4,
          bottom: 0,
          left: 0,
          height: 170,
          backgroundColor: "white",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 13,
          }}
        >
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Entypo name="location-pin" size={24} color={colors.secondary} />
            <View>
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 16 }}
              >
                Delivery at Home
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 14,
                  color: "gray",
                }}
              >
                16,rama mandi Surya Enclave
              </Text>
            </View>
          </View>

          <Text
            onPress={() => navigation.navigate("location")}
            style={{
              fontSize: 16,
              fontFamily: fonts.Roboto_500Medium,
              color: colors.secondary,
              marginTop: 10,
              marginRight: 5,
            }}
          >
            Change
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 6,
            marginLeft: 20,
            marginTop: 15,
          }}
        >
          <FontAwesome5 name="clock" size={20} color="green" />
          <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
            Delivery in 29 min
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: "90%",
            alignSelf: "center",
            height: 50,
            backgroundColor: colors.secondary,
            justifyContent: "center",
            borderRadius: 14,
            alignItems: "center",
            marginTop: 35,
          }}
          onPress={handleConfirmPayment}
        >
          <Text
            style={{
              color: "white",
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 17,
            }}
          >
            Continue to payment
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Cart;

const CartItem = ({ food }) => {
  const [qty, setqty] = useState(food?.qty);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [upCart, setupCart] = useState([]);

  const handleIncrement = async () => {
    dispatch(increaeQty(food?._id));
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleDecrement = async () => {
    if (food?.qty < 2) return;
    dispatch(decreaseQty(food?._id));

    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleRemoveItem = async (id) => {
    // dispatch(removeItem(id));

    const filterCart = cart?.filter((c) => c._id !== id);

    dispatch(setCart(filterCart));
    await AsyncStorage.setItem("cart", JSON.stringify(filterCart));
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
      <Entypo
        onPress={() => handleRemoveItem(food?._id)}
        style={{ position: "absolute", left: -10, top: -10, zIndex: 40 }}
        name="cross"
        size={24}
        color="black"
      />
      <Image
        style={{ width: 60, height: 60, borderRadius: 8 }}
        source={{ uri: food?.images[0] }}
      ></Image>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 14.5 }}>
            {food?.name.slice(0, 20)}
            {food?.name?.length > 20 && "..."}
          </Text>
          <View>
            <Text
              style={{
                fontFamily: fonts.Roboto_500Medium,
                fontSize: 14,
                marginTop: 9,
              }}
            >
              ${food?.price}
            </Text>
          </View>
        </View>
        <View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colors.secondary,
                borderRadius: 8,
                // paddingHorizontal: 12,
                // paddingVertical: 2,
                gap: 20,
                height: 28,
                // width: 80,
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 4,
              }}
            >
              <AntDesign
                onPress={() => {
                  handleDecrement();
                }}
                name="minus"
                size={14}
                color={colors.secondary}
              />
              <Text>{food?.qty}</Text>
              <AntDesign
                onPress={() => {
                  handleIncrement();
                }}
                name="plus"
                size={14}
                color={colors.secondary}
              />
            </View>
            <Text
              style={{
                fontFamily: fonts.Roboto_500Medium,
                fontSize: 14,
                marginTop: 3,
              }}
            >
              ${food?.price * food?.qty}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
