import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { backendUrl, colors, fonts } from "../utils";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";

const SellerShop = () => {
  const navigation = useNavigation();
  const sheetRef = useRef();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [allFoodOfShop, setallFoodOfShop] = useState([]);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { shopdetail } = useRoute().params;

  useEffect(() => {
    const getAllFood = async () => {
      try {
        const res = await axios.post(`${backendUrl}get-all-food-seller`, {
          email: shopdetail?.email,
        });

        if (res.data.success) {
          setallFoodOfShop(res.data.foods);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (shopdetail) {
      getAllFood();
    }
  }, [shopdetail]);

  const handleAddToCart = async (food) => {
    // if (cart.length > 0) {
    const isSameSeller = cart[0]?.seller == food?.seller;
    if (!isSameSeller) {
      dispatch(setCart([{ ...food, qty: 1 }]));
      // await AsyncStorage.setItem("cart", JSON.stringify([food]));
    } else {
      let cartt = [...cart];
      const isAleadyHave = cart?.find((f) => f._id == food._id);
      if (isAleadyHave) return alert("item already in cart");

      cartt = [...cart, { ...food, qty: 1 }];
      dispatch(setCart(cartt));
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
    }
    // };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <BottomSheet sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} />
      <ScrollView>
        <SafeAreaView>
          <View style={{ width: "95%", alignSelf: "center" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <AntDesign
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={26}
                color="black"
              />
              {/* <Feather
                onPress={() => setSheetOpen(true)}
                name="search"
                size={24}
                color={colors.secondary}
              /> */}
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: fonts.Roboto_700Bold,
                  fontSize: 26,
                  marginBottom: 6,
                }}
              >
                {shopdetail?.shopname}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {shopdetail?.tags?.map((tag, i) => (
                  <Text
                    key={i}
                    style={{
                      fontFamily: fonts.Roboto_400Regular,
                      color: "gray",
                      fontSize: 15,
                    }}
                  >
                    {tag}
                  </Text>
                ))}
              </View>
              <Text
                style={{
                  fontFamily: fonts.Roboto_400Regular,
                  color: "gray",
                  fontSize: 15,
                }}
              >
                {shopdetail?.specialist
                  ? shopdetail?.specialist
                  : "Specialist in ?"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    backgroundColor: "#15b712",
                    height: 22,
                    color: "white",
                    width: 45,
                    fontSize: 12,
                    fontFamily: fonts.Roboto_500Medium,
                    borderRadius: 7,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    paddingVertical: 2.5,
                    paddingHorizontal: 6.5,
                  }}
                >
                  4.4⭐
                </Text>
                <Text>6k ratings</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 15 }}>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    color: colors.secondary,
                  }}
                >
                  27 mins . 2.5km
                </Text>
              </View>
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 15 }}
              >
                {shopdetail?.shopaddress?.address}
                {shopdetail?.shopaddress?.city},{shopdetail?.shopaddress?.state}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSheetOpen(!sheetOpen);
              }}
              style={{
                marginTop: 15,
                borderWidth: 0.4,
                borderColor: colors.secondary,
                width: 80,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 7,
              }}
            >
              <FontAwesome5 name="filter" size={20} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  color: colors.secondary,
                }}
              >
                Filter
              </Text>
            </TouchableOpacity>
            {/* categories */}
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                // backgroundColor: "white",
                borderRadius: 30,
                paddingHorizontal: 10,
                paddingVertical: 12,
                marginTop: 20,
                backgroundColor: "white",
                elevation: 5,
                marginBottom: 20,
              }}
            >
              {/* heading */}
              {/* <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.Roboto_700Bold,
                    fontSize: 19,
                    color: "#3e3b3b",
                  }}
                >
                  Chinese
                </Text>
                <AntDesign
                  name="caretup"
                  size={18}
                  color={colors.secondary}
                  style={{ marginRight: 8 }}
                />
              </View> */}

              {allFoodOfShop?.map((food, i) => {
                console.log(food);
                return (
                  <View key={i}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 14,
                        alignItems: "center",
                      }}
                    >
                      <View style={{ width: "65%" }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Image
                            source={{
                              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgp-jOWD-q7Xdm-H9hMUsMA4zJvMwgpF756Q&s",
                            }}
                            style={{ width: 20, height: 20 }}
                          />
                          <Text
                            style={{
                              fontFamily: fonts.Roboto_500Medium,
                              fontSize: 16,
                              marginTop: 3,
                            }}
                          >
                            {food?.name}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginBottom: 10,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fonts.Roboto_500Medium,
                              fontSize: 17,
                              marginTop: 3,
                            }}
                          >
                            ${food?.price}
                          </Text>
                          <Text
                            style={{
                              fontFamily: fonts.Roboto_500Medium,
                              fontSize: 15,
                              marginTop: 3,
                              color: "gray",
                              textDecorationLine: "line-through",
                            }}
                          >
                            ${food?.estimateprice}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 13,
                            color: "gray",
                          }}
                        >
                          {food?.description}
                        </Text>
                      </View>

                      <View
                        style={{
                          width: "35%",
                          // justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <Image
                          style={{
                            width: 110,
                            height: 110,
                            objectFit: "fill",
                            borderRadius: 15,
                          }}
                          source={{
                            uri: food?.images[0],
                          }}
                        ></Image>
                        <TouchableOpacity
                          style={{
                            width: 85,
                            height: 32,
                            borderWidth: 1,
                            borderColor: colors.secondary,
                            backgroundColor: "white",
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                            bottom: 14,
                          }}
                          onPress={() => handleAddToCart(food)}
                        >
                          <Text
                            style={{
                              fontFamily: fonts.Roboto_500Medium,
                              color: colors.secondary,
                            }}
                          >
                            Add +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text
                      style={{
                        width: "95%",
                        borderBottomWidth: 1,
                        borderStyle: "dashed",
                        borderColor: "gray",
                        alignSelf: "center",
                        marginVertical: 8,
                      }}
                    ></Text>
                  </View>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default SellerShop;

import { useSharedValue } from "react-native-reanimated";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../shop/slices/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomSheet = ({ sheetOpen, setSheetOpen }) => {
  const sharedValue = useSharedValue(0);
  const [isGestureActive, setisGestureActive] = useState(false);

  useEffect(() => {
    if (sheetOpen) {
      sharedValue.value = withTiming(0, { duration: 400 });
    }
  }, [sheetOpen]);

  useEffect(() => {
    if (!sheetOpen) sharedValue.value = 600;
  }, []);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: sharedValue.value }],
    };
  });

  const onGestureEvent = (e) => {
    if (e.nativeEvent.translationY < 0) return;
    sharedValue.value = e.nativeEvent.translationY;
  };
  const onHandlerStateChange = (e) => {
    if (e.nativeEvent.translationY > 20) {
      sharedValue.value = withTiming(600, { duration: 400 });
      setSheetOpen(false);
    } else {
      sharedValue.value = withTiming(0, { duration: 300 });
    }
  };

  return (
    <Animated.View
      style={[
        {
          width: "95%",
          backgroundColor: colors.background,
          height: 500,
          borderWidth: 0.5,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          borderColor: "gray",
          position: "absolute",
          bottom: 0,
          left: "2.5%",
          right: "2.5%",
          zIndex: 50,
          elevation: 10,
        },
        animationStyle,
      ]}
    >
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onEnded={() => setisGestureActive(false)}
        onActivated={() => setisGestureActive(true)}
        onHandlerStateChange={onHandlerStateChange}
      >
        <View style={[{ padding: 10, backgroundColor: "white" }]}>
          <Text
            style={{
              height: 8,
              width: 50,
              backgroundColor: isGestureActive ? "#2593ce" : "black",
              borderRadius: 4,
              alignSelf: "center",
            }}
          ></Text>
          <View style={{ alignSelf: "center", width: "95%", height: "100%" }}>
            <Text
              style={{
                paddingVertical: 10,
                marginTop: 10,
                fontFamily: fonts.Roboto_500Medium,
                fontSize: 15,
              }}
            >
              This restaurant sell both veg and non veg{" "}
            </Text>
            {/* veg or non veg */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                Food preferance
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    marginLeft: 20,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  {" "}
                  Veg
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  Non Veg
                </Text>
              </View>
            </View>
            {/* top picks */}
            <View
              style={{
                backgroundColor: "white",
                marginTop: 20,
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                Top picks
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    marginLeft: 20,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,

                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  {" "}
                  Top rated 4+
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  Most selling item
                </Text>
              </View>
            </View>
            {/* offers */}
            <View
              style={{
                backgroundColor: "white",
                marginTop: 20,
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                Offers
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    marginLeft: 20,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  {" "}
                  Buy 1 Get 1
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  30% off
                </Text>
              </View>
            </View>
            {/* sort by */}
            <View
              style={{
                backgroundColor: "white",
                marginTop: 20,
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                Sort by
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    marginLeft: 20,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  {" "}
                  Price - low to high
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  Price - high to low
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_400Regular,
                    fontSize: 14,
                    borderWidth: 0.4,
                    borderColor: "gray",
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderRadius: 8,
                    marginLeft: 20,
                    color: "white",
                    backgroundColor: colors.secondary,
                  }}
                >
                  Rating - high to low
                </Text>
              </View>
            </View>
          </View>
        </View>
      </PanGestureHandler>
    </Animated.View>
  );
};
