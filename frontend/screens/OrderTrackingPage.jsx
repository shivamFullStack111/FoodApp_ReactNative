import {
  View,
  KeyboardAvoidingView,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { accessToken, backendUrl, colors, fonts } from "../utils";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import MapView, { Polyline, Marker } from "react-native-maps";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDestination } from "../shop/slices/liveOrderSlice";

import polyline from "@mapbox/polyline";
import { useSocket } from "../SocketContext";

const OrderTrackingPage = ({ route }) => {
  // const { order, sellerEmail } = useRoute().params;
  const [sellerEmail, setsellerEmail] = useState(route?.params?.sellerEmail);
  const [order, setorder] = useState(route?.params?.order);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { origin, destination } = useSelector((state) => state.liveOrder);
  const [coordinates, setCoordinates] = useState([]);
  const dispatch = useDispatch();
  const [pageLoading, setpageLoading] = useState(false);
  const { width, height } = Dimensions.get("window");
  const [review, setreview] = useState("");
  const [ratings, setratings] = useState(0);
  const [isreviwing, setisreviwing] = useState(false);
  const [israted, setisrated] = useState(false);
  const [deliveryLocation, setdeliveryLocation] = useState({
    longitude: null,
    latitude: null,
  });
  const { user } = useSelector((state) => state.user);
  const { socket } = useSocket();

  useEffect(() => {
    if (order) {
      if (order?.israted) setisrated(true);
    }
  }, [order]);

  useEffect(() => {
    if (socket) {
      socket.on("updatedStatusToBuyer", ({ status, order }, data) => {
        if (data?.order?._id == order?._id) {
          setorder({ ...order, status });
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    const getDirectionss = async () => {
      // if (deliveryLocation?.latitude && deliveryLocation?.longitude)
      // if (!user?.address?.latitude || user?.address?.longitude)
      // return alert("to track user address not found");
      try {
        const response = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${user?.address?.longitude},${user?.address?.latitude};${deliveryLocation?.longitude},${deliveryLocation?.latitude}`,
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
        setCoordinates(coords || undefined);
      } catch (error) {
        alert(error.message);
      }
    };

    if (deliveryLocation?.latitude && deliveryLocation?.longitude) {
      getDirectionss();
    }
  }, [deliveryLocation]);

  useEffect(() => {
    if (!deliveryLocation?.latitude && !deliveryLocation?.longitude) return;
  }, [deliveryLocation]);

  useEffect(() => {
    if (socket) {
      socket.on("partnerNewLocation", (data) => {
        console.log(data);
        setdeliveryLocation({
          latitude: data?.latitude,
          longitude: data?.longitude,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("partnerNewLocation");
      }
    };
  }, [socket]);

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const submitReview = async () => {
    try {
      setisreviwing(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) return alert("token not found please login to continue");
      const res = await axios.post(
        `${backendUrl}send-review`,
        {
          orderid: order?._id,
          review,
          ratings,
        },
        { headers: { Authorization: token } }
      );
      setisreviwing(false);
      if (res.data.success) {
        setisrated(true);
      }
    } catch (error) {
      setisreviwing(false);

      console.log(error.message);
    }
  };

  const getDirections = async (sellerLocation) => {
    if (!origin) return;
    if (deliveryLocation?.latitude && deliveryLocation?.longitude) return;
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin?.longitude},${origin?.latitude};${sellerLocation?.longitude},${sellerLocation?.latitude}`,
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
      alert(error.message);
    }
  };

  useEffect(() => {
    setpageLoading(true);

    const getSellerAddress = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) alert("please login to continue");

        const res = await axios.post(
          `${backendUrl}get-seller-address`,
          { email: sellerEmail },
          { headers: { Authorization: token } }
        );

        if (res.data.success) {
          getDirections({
            latitude: res?.data?.address?.latitude,
            longitude: res?.data?.address?.longitude,
          });

          dispatch(
            setDestination({
              latitude: res?.data?.address?.latitude,
              longitude: res?.data?.address?.longitude,
            })
          );
        }

        setpageLoading(false);
      } catch (error) {
        setpageLoading(false);
      }
    };
    if (sellerEmail) {
      getSellerAddress();
    }
  }, [sellerEmail]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {pageLoading || !coordinates ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: width,
              height: height,
            }}
          >
            <ActivityIndicator color={colors.secondary} size={38} />
          </View>
        ) : (
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <AntDesign
                  onPress={() => navigation.navigate("home")}
                  style={{
                    position: "absolute",
                    zIndex: 40,
                    top: 10,
                    left: 10,
                    borderRadius: 100,
                    backgroundColor: "white",
                  }}
                  name="leftcircle"
                  size={30}
                  color="black"
                />

                {order?.status !== "delivered" && (
                  <View
                    style={{
                      width: "100%",
                      height: "60%",
                    }}
                  >
                    <MapView
                      initialRegion={{
                        latitude: destination?.latitude,
                        longitude: destination?.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      }}
                      style={{ flex: 1 }}
                    >
                      {origin && (
                        <Marker
                          coordinate={{
                            // latitude: deliveryLocation?.latitude
                            //   ? deliveryLocation?.latitude
                            //   : origin?.latitude,
                            // longitude: deliveryLocation?.longitude
                            //   ? deliveryLocation?.longitude
                            //   : origin?.longitude,
                            latitude: deliveryLocation?.latitude
                              ? deliveryLocation?.latitude
                              : order?.foods[0]?.sellerDetails?.shopaddress
                                  ?.latitude,
                            longitude: deliveryLocation?.longitude
                              ? deliveryLocation?.longitude
                              : order?.foods[0]?.sellerDetails?.shopaddress
                                  .longitude,
                          }}
                          title="Origin"
                        >
                          <Image
                            source={{
                              uri: "data:image/jpeg;base64,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",
                            }}
                            style={{ width: 40, height: 40, borderRadius: 100 }}
                          />
                        </Marker>
                      )}
                      {destination?.latitude && destination?.longitude && (
                        <Marker
                          coordinate={{
                            latitude: order?.user?.address?.latitude,
                            longitude: order?.user?.address?.longitude,
                          }}
                          title="Destination"
                        >
                          <Image
                            style={{ width: 40, height: 40, borderRadius: 100 }}
                            source={{
                              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6epuyk4JDdG6RPW7c_5CrHuPe1TzQW77sOA&s",
                            }}
                          ></Image>
                        </Marker>
                      )}
                      {coordinates && coordinates?.length > 0 && (
                        <Polyline
                          coordinates={coordinates}
                          strokeWidth={3}
                          strokeColor="#4665F5"
                        />
                      )}
                    </MapView>
                  </View>
                )}

                <View
                  style={{
                    width: "95%",
                    height: "100%",
                    alignSelf: "center",
                  }}
                >
                  {/*
                 <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 15,
                    borderWidth: 0.3,
                    marginTop: 10,
                  }}
                >
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 100,
                    }}
                    source={{
                      uri: "data:image/jpeg;base64,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",
                    }}
                  ></Image>
                  <Text
                    style={{
                      width: "70%",
                      height: 1,
                      borderBottomWidth: 1,
                      borderStyle: "dashed",
                      borderColor: colors.secondary,
                    }}
                  ></Text>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 100,
                      objectFit: "ontain",
                    }}
                    source={{
                      uri: "data:image/jpeg;base64,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",
                    }}
                  ></Image>
                </View>
                 */}
                  <ScrollView
                    // showsVerticalScrollIndicator={false}
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      marginTop: 10,
                      borderRadius: 15,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                        alignSelf: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          paddingHorizontal: 9,
                          paddingVertical: 3,
                          borderWidth: 1,
                        }}
                      >
                        {order?.otp?.toString()[0]}
                      </Text>
                      <Text
                        style={{
                          paddingHorizontal: 9,
                          paddingVertical: 3,
                          borderWidth: 1,
                        }}
                      >
                        {order?.otp?.toString()[1]}
                      </Text>
                      <Text
                        style={{
                          paddingHorizontal: 9,
                          paddingVertical: 3,
                          borderWidth: 1,
                        }}
                      >
                        {order?.otp?.toString()[2]}
                      </Text>
                      <Text
                        style={{
                          paddingHorizontal: 9,
                          paddingVertical: 3,
                          borderWidth: 1,
                        }}
                      >
                        {order?.otp?.toString()[3]}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 20,
                        alignItems: "center",
                        shadowColor: "blue",
                        marginTop: order?.status == "delivered" ? 25 : 0,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_700Bold,
                          fontSize: 17,
                        }}
                      >
                        Total items :-
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_500Medium,
                          fontSize: 15,
                          color: "gray",
                        }}
                      >
                        {order?.foods?.length}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 20,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_700Bold,
                          fontSize: 17,
                        }}
                      >
                        Total price :-
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_500Medium,
                          fontSize: 15,
                          color: "gray",
                        }}
                      >
                        ${order?.amount}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "center",
                        marginTop: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_700Bold,
                          fontSize: 17,
                        }}
                      >
                        Order Status :-{" "}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_700Bold,
                          fontSize: 15,
                          textDecorationLine: "underline",
                        }}
                      >
                        {order?.status}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "center",
                        marginTop: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_700Bold,
                          fontSize: 17,
                        }}
                      >
                        seller :-{" "}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_700Bold,
                          fontSize: 15,
                          textDecorationLine: "underline",
                        }}
                      >
                        {order?.seller}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          fontSize: 23,
                          fontFamily: fonts.Roboto_700Bold,
                          marginTop: 10,
                          color: colors.secondary,
                          alignSelf: "center",
                        }}
                      >
                        Items
                      </Text>

                      {order &&
                        order?.foods.map((food, i) => (
                          <Card key={i} food={food} />
                        ))}

                      {order?.status !== "delivered" && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "red",
                            height: 42,
                            borderRadius: 12,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontFamily: fonts.Roboto_700Bold,
                              fontSize: 17,
                            }}
                          >
                            Cancel order
                          </Text>
                          <MaterialCommunityIcons
                            name="archive-cancel-outline"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      )}
                      {!israted && order?.status == "delivered" && (
                        <View
                          style={{
                            marginTop: 10,
                            borderRadius: 10,
                            backgroundColor: "white",
                            elevation: 5,
                            marginBottom: 20,
                            width: "95%",
                            alignSelf: "center",
                            padding: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fonts.Roboto_700Bold,
                              fontSize: 16,
                            }}
                          >
                            Rating
                          </Text>
                          <View style={{ flexDirection: "row", gap: 5 }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <TouchableOpacity
                                key={i}
                                onPress={() => setratings(i)}
                                style={{
                                  borderRadius: 5,
                                  backgroundColor: "white",
                                  elevation: 5,
                                  marginBottom: 10,
                                  padding: 4,
                                  marginTop: 5,
                                }}
                              >
                                {ratings >= i ? (
                                  <AntDesign
                                    name="star"
                                    size={20}
                                    color="gold"
                                  />
                                ) : (
                                  <AntDesign
                                    name="staro"
                                    size={20}
                                    color="black"
                                  />
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                          <TextInput
                            style={{
                              backgroundColor: "white",
                              elevation: 5,
                              borderRadius: 10,
                              padding: 10,
                            }}
                            onChangeText={(t) => setreview(t)}
                            multiline
                            placeholder="Give your review to food (Optional)"
                            numberOfLines={5}
                            textAlignVertical="top"
                          ></TextInput>

                          <TouchableOpacity
                            style={{
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: colors.secondary,
                              height: 40,
                              borderRadius: 8,
                            }}
                            onPress={() => submitReview()}
                          >
                            <Text
                              style={{
                                fontFamily: fonts.Roboto_700Bold,
                                color: "white",
                                fontSize: 17,
                              }}
                            >
                              {isreviwing ? <ActivityIndicator /> : "Submit"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderTrackingPage;

const Card = ({ food }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,

        margin: 10,
      }}
    >
      <Image
        style={{
          width: 70,
          height: 70,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
        source={{ uri: food?.images[0] }} // Replace with your image URL
      />
      <View style={{ flex: 1, marginLeft: 10, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {food?.name.slice(0, 24)}
          {food?.name?.length > 24 && "..."}
        </Text>
        <Text style={{ fontSize: 14, color: "#555" }}>
          {food?.description?.slice(0, 60)}
          {food?.description?.length > 24 && "..."}
        </Text>
      </View>
    </View>
  );
};
