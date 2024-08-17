import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";
import { accessToken, backendUrl, colors, fonts } from "../../utils";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import axios from "axios";
import { useSocket } from "../../SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPartnerLiveOrder } from "../../shop/slices/liveOrderSlice";
import OrderTakeByPartner from "../OrderTakeByPartner";
import { updateStatusOfOrder } from "../functions";

const AcceptedOrders = () => {
  // { latitude: 37.78825, longitude: -122.4324 }

  const [coordinates, setCoordinates] = useState(null);
  const [partnerLocation, setpartnerLocation] = useState(null);
  const [user, setuser] = useState(null);
  const { socket } = useSocket();
  const { partnerLiveOrder } = useSelector((state) => state.liveOrder);
  const isfocused = useIsFocused();
  const dispatch = useDispatch();
  const [status, setstatus] = useState();

  useEffect(() => {
    if (partnerLiveOrder) setstatus(partnerLiveOrder?.status);
  }, [partnerLiveOrder]);

  const getParnerLiveOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return alert("token not found to get live order");

      const res = await axios.get(`${backendUrl}get-partner-live-order`, {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        // setactiveOrder(res?.data?.order);
        dispatch(setPartnerLiveOrder(res?.data?.order));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (partnerLiveOrder) return;
    getParnerLiveOrder();
  }, [isfocused]);

  useEffect(() => {
    const getBuyerData = async () => {
      try {
        const res = await axios.get(`${backendUrl}get-seller/user@gmail.com`);
        setuser(res?.data?.seller);
      } catch (error) {
        console.log(error.message);
      }
    };
    getBuyerData();
  }, []);

  const getloc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setpartnerLocation({
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    });
  };

  useEffect(() => {
    setInterval(() => {
      getloc();
    }, 5000);
  }, []);

  useEffect(() => {
    if (user?.address?.latitude && partnerLocation?.latitude) {
      getDirections(partnerLocation, {
        latitude: user?.address?.latitude,
        longitude: user?.address?.longitude,
      });
    }
  }, [partnerLocation, user]);

  const getDirections = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${origin?.longitude},${origin?.latitude};${destination?.longitude},${destination?.latitude}`,
        {
          params: {
            access_token: accessToken,
            geometries: "polyline",
          },
        }
      );

      if (response.data.code !== "Ok") {
        throw new Error(`API Response Code: ${response.data.code}`);
      }

      const points = polyline.decode(response.data.routes[0].geometry);
      const coords = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));

      setCoordinates(coords);
    } catch (error) {
      console.log(error.message);
    }
  };

  const { width, height } = Dimensions.get("window");
  return (
    <ScrollView style={{ flex: 1, position: "relative" }}>
      {partnerLiveOrder && (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              width: width,
            }}
          >
            {user?.address?.longitude && (
              <MapView
                initialRegion={{
                  latitude: user?.address?.latitude,
                  longitude: user?.address?.longitude,
                  longitudeDelta: 0.01, // Reduce for more zoom
                  latitudeDelta: 0.01, // Reduce for more zoom
                }}
                style={{ width: "100%", height: height - 300 }}
              >
                {coordinates ? (
                  <Polyline
                    strokeWidth={3}
                    strokeColor="red"
                    coordinates={coordinates}
                  />
                ) : null}

                {user?.address?.latitude && user?.address?.longitude && (
                  <Marker
                    title="destination"
                    coordinate={{
                      latitude: user?.address?.latitude,
                      longitude: user?.address?.longitude,
                    }}
                  >
                    <Image
                      source={{
                        uri: "data:image/jpeg;base64,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",
                      }}
                      style={{ width: 40, height: 40, borderRadius: 100 }}
                    ></Image>
                  </Marker>
                )}

                {partnerLocation?.latitude && partnerLocation?.longitude && (
                  <Marker
                    title="origin"
                    coordinate={{
                      latitude: partnerLocation?.latitude,
                      longitude: partnerLocation?.longitude,
                    }}
                  >
                    <Image
                      style={{ width: 40, height: 40, borderRadius: 100 }}
                      source={{
                        uri: "data:image/jpeg;base64,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",
                      }}
                    ></Image>
                  </Marker>
                )}
              </MapView>
            )}
          </View>
          {status == "preparing..." && (
            <View
              style={{
                width: "100%",
                height: 150,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  const res = await updateStatusOfOrder(
                    "on the way",
                    partnerLiveOrder?._id
                  );
                  if (res?.data?.success) {
                    socket.emit("updateStatus", {
                      order: partnerLiveOrder,
                      status: "on the way",
                    });

                    setstatus("on the way");
                    console.log("status updated successfully");
                  }
                }}
                style={{
                  backgroundColor: colors.secondary,
                  width: "90%",
                  alignSelf: "center",
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 17, fontWeight: "500" }}
                >
                  Confirm order recived
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              width: "95%",
              alignSelf: "center",
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 15.5 }}>
            Currently showing shop address
          </Text> */}
              <Text style={{ fontFamily: fonts.Roboto_700Bold }}>
                Order id:{" "}
                <Text style={{ color: colors.secondary }}>
                  {partnerLiveOrder?._id}
                </Text>
              </Text>
            </View>
            <Text style={{ fontFamily: fonts.Roboto_700Bold, marginTop: 5 }}>
              Order Staus: <Text style={{ color: "gray" }}>{status}</Text>
            </Text>
            <Text
              style={{
                alignSelf: "center",
                color: colors.secondary,
                fontSize: 15,
                fontFamily: fonts.Roboto_700Bold,
                marginTop: 5,
              }}
            >
              3.7 Km left...{" "}
            </Text>
            <Text style={{ fontFamily: fonts.Roboto_500Medium, marginTop: 5 }}>
              Payment:{" "}
              <Text style={{ color: "gray" }}>
                {partnerLiveOrder?.paymentstatus}
              </Text>
            </Text>
            <View
              style={{
                marginTop: 20,
                alignSelf: "center",
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 18,
                paddingVertical: 4,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{ marginRight: 5, fontFamily: fonts.Roboto_500Medium }}
              >
                Picked
              </Text>
              <AntDesign name="down" size={20} color="black" />
            </View>
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 18 }}>
              Order{" "}
              <Text
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.Roboto_700Bold_Italic,
                }}
              >
                items
              </Text>
            </Text>
            <View style={{ flex: 1, marginTop: 15, marginBottom: 10, gap: 10 }}>
              {partnerLiveOrder?.foods?.map((food, i) => (
                <CartItem food={food} key={i} delay={i * 200} />
              ))}
            </View>
          </View>
        </View>
      )}

      {!partnerLiveOrder && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: height / 2 - 150,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 30,
              paddingVertical: 30,
              backgroundColor: "white",
              borderRadius: 15,
              color: colors.secondary,
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 19,
              textDecorationLine: "underline",
              elevation: 10,
              marginBottom: 30,
            }}
          >
            Currently no order accepted!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AcceptedOrders;

const CartItem = ({ food, delay }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const isfocus = useIsFocused();

  const sharedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: sharedValue.value == 0 ? -100 : sharedValue.value + 0 },
      ],
      opacity: sharedValue.value,
    };
  });

  useEffect(() => {
    if (isfocus) {
      sharedValue.value = withDelay(delay, withTiming(1, { duration: 500 }));
    } else {
      sharedValue.value = 0;
    }

    return () => {
      sharedValue.value = 0;
    };
  }, [food, delay, isfocus]);

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          flexDirection: "row",
          gap: 10,
          width: "100%",
          // borderWidth: 1,
          paddingVertical: 5,
          paddingHorizontal: 5,
          borderRadius: 10,
          borderColor: "gray",
          backgroundColor: "white",
          elevation: 5,
        },
        animatedStyle,
      ]}
    >
      <Image
        style={{ width: 60, height: 60, borderRadius: 8 }}
        source={{
          uri:
            food?.images[0] ||
            "data:image/jpeg;base64,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",
        }}
      ></Image>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 13.5 }}>
            {food?.name?.slice(0, 20) || "italian pizza sizzle"}
            {food?.name?.length > 20 && "..."}
          </Text>
          <View>
            <Text
              style={{
                fontFamily: fonts.Roboto_500Medium,
                fontSize: 13,
              }}
            >
              Price: ${food?.price || "38"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.Roboto_500Medium,
                fontSize: 13,
              }}
            >
              QTY: {food?.qty}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
