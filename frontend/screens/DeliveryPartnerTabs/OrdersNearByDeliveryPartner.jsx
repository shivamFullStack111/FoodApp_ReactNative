import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { backendUrl, colors, fonts } from "../../utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import haversine from "haversine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  addMultipleItemToNearOrderForDelivery,
  updateOrderToAccepted,
} from "../../shop/slices/socketSlice";

const OrdersNearByDeliveryPartner = () => {
  const isfocus = useIsFocused();
  const { nearOrdersForSeller } = useSelector((state) => state.socket);
  const [isdatafetched, setisdatafetched] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { partnerLiveOrder } = useSelector((state) => state.liveOrder);

  const handleAcceptOrder = async (id) => {
    try {
      if (partnerLiveOrder) {
        return alert("You are already accepted one order");
      }
      const token = await AsyncStorage.getItem("token");
      if (!token) return alert("token is not found to confirm delivery");

      const res = await axios.post(
        `${backendUrl}confirm-order-partner`,
        { orderid: id },
        { headers: { Authorization: token } }
      );
      console.log(res.data.success);
      if (res?.data?.success) {
        console.log(id);
        dispatch(updateOrderToAccepted(id));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getAllOrderOfNear = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return alert("fetch failed because token not found");
        const res = await axios.get(
          `${backendUrl}getAll_Near_OrderOf_DeliveryPartner`,
          { headers: { Authorization: token } }
        );

        if (res?.data?.success) setisdatafetched(true);
        dispatch(addMultipleItemToNearOrderForDelivery(res?.data?.orders));
      } catch (error) {
        console.log(error.message);
      }
    };

    if (user?.isdeliverypartner && !isdatafetched) {
      getAllOrderOfNear();
    }
  }, [user]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ width: "95%", alignSelf: "center", height: "100%" }}>
        <Text
          style={{
            fontFamily: fonts.Roboto_700Bold,
            fontSize: 23,
            marginTop: 20,
            alignSelf: "center",
            marginBottom: 10,
          }}
        >
          Order
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold_Italic,
              color: colors.secondary,
            }}
          >
            s
          </Text>{" "}
          <Text
            style={{ fontFamily: fonts.Roboto_500Medium_Italic, fontSize: 16 }}
          >
            near by you
          </Text>
        </Text>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: "42%",
              marginLeft: "5%",
              height: 80,
              backgroundColor: "white",
              borderRadius: 10,
              elevation: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16 }}>
              Orders
            </Text>
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold_Italic,
                color: colors.secondary,
                elevation: 10,
              }}
            >
              {nearOrdersForSeller?.length}
            </Text>
          </View>
          <View
            style={{
              width: "42%",
              marginRight: "5%",
              height: 80,
              backgroundColor: "white",
              borderRadius: 10,
              elevation: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16 }}>
              Today Earning
            </Text>
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold_Italic,
                color: colors.secondary,
                elevation: 10,
              }}
            >
              $89
            </Text>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            gap: 13,
            // marginTop: 20,
            flex: 1,
            paddingBottom: 20,
          }}
        >
          {nearOrdersForSeller?.map((food, i) => {
            if (food?.isorderacceptedbydelivery == true) {
              return;
            }
            return (
              <Card
                handleAcceptOrder={handleAcceptOrder}
                isfocus={isfocus}
                food={food}
                index={i}
                key={i}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default OrdersNearByDeliveryPartner;

const Card = ({ food, index, isfocus, handleAcceptOrder }) => {
  const seller = food.order?.foods[0]?.sellerDetails;
  const item = food.order;
  const sharedValue = useSharedValue(0);
  const [isVisible, setisVisible] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: sharedValue.value == 0 ? 0 : 10 + sharedValue.value,
        },
      ],
      opacity: sharedValue.value,
    };
  });

  useEffect(() => {
    if (isfocus && food) {
      sharedValue.value = withDelay(
        300 * index,
        withTiming(1, { duration: 500 })
      );
    }

    return () => {
      sharedValue.value = 0;
    };
  }, [food, isfocus]);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: "100%",
          minHeight: 100,
          // borderWidth: 1,
          borderRadius: 15,
          padding: 10,
          // paddingVertical: 6,
          elevation: 10,
          backgroundColor: "white",
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          borderBottomWidth: 1,
          paddingBottom: 15,
          borderStyle: "dashed",
          borderColor: "gray",
        }}
      >
        <Image
          style={{ width: 50, height: 50, borderRadius: 100 }}
          source={{
            uri: seller?.image,
          }}
        ></Image>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16 }}>
              Shop:{" "}
            </Text>
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold_Italic,
                color: colors.secondary,
              }}
            >
              {seller?.shopname}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16 }}>
              distance from you:{" "}
            </Text>
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold_Italic,
                color: colors.secondary,
              }}
            >
              3.7 Km
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Entypo name="location-pin" size={28} color={colors.secondary} />
          <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
            hno 16 new bashirpura kamal vihar, jalandhar
          </Text>
        </View>

        <View>
          <View style={{ marginTop: 3 }}>
            <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
              Order of: <Text style={{ color: "gray" }}>3.5 Km</Text>
            </Text>
            <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
              Estimate time: <Text style={{ color: "gray" }}>39 Mins</Text>
            </Text>
            <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
              amount: <Text style={{ color: "gray" }}>${food?.amount}</Text>
            </Text>
            <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
              Payment Type:{" "}
              <Text style={{ color: "gray" }}>Cash on delivery</Text>
            </Text>
            <View
              style={{
                alignSelf: "center",
                marginTop: 10,
                marginBottom: 5,
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor: "#5dcf34",
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.Roboto_700Bold,
                  fontSize: 16,
                  color: "white",
                }}
              >
                Earning: <Text>$39</Text>
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: "40%",
              height: 40,
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: colors.secondary,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginRight: "7%",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold,
                fontSize: 15,
                color: colors.secondary,
              }}
            >
              Remove
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "40%",
              height: 40,
              backgroundColor: colors.secondary,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              if (food?.order) {
                handleAcceptOrder(food?.order?._id);
              } else {
                handleAcceptOrder(food?._id);
              }
            }}
          >
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold,
                fontSize: 15,
                color: "white",
              }}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};
