import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { backendUrl, colors, fonts } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCart } from "../shop/slices/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FoodDetailPage = () => {
  const route = useRoute();
  const { food } = route?.params || {};
  const sharedValue = useSharedValue(0);
  const navigation = useNavigation();
  const [value, setvalue] = useState(0);
  const [qty, setqty] = useState(1);
  const [seller, setseller] = useState(null);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = async (food) => {
    const isSameSeller = cart[0]?.seller == food?.seller;
    if (!isSameSeller) {
      dispatch(setCart([{ ...food, qty: qty }]));
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: sharedValue.value }],
    };
  });

  useEffect(() => {
    const getSeller = async () => {
      try {
        const res = await axios.get(`${backendUrl}get-seller/${food?.seller}`);
        if (res?.data?.success) {
          setseller(res?.data?.seller);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (food) {
      getSeller();
    }
  }, [food]);

  const ImageSizeStyle = useAnimatedStyle(() => {
    return {};
  });

  const onGestureEvent = (e) => {
    if (e.nativeEvent.translationY < -152 || e.nativeEvent.translationY > 0)
      return;
    sharedValue.value = withTiming(e.nativeEvent.translationY, {
      duration: 100,
    });

    setvalue(e.nativeEvent.translationY);
  };

  return (
    // <ScrollView style={{ flex: 1 }}>
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler
            style={{ flex: 1 }}
            onGestureEvent={onGestureEvent}
            // onEnded={() => setisGestureActive(false)}
            // onActivated={() => setisGestureActive(true)}
            // onHandlerStateChange={onHandlerStateChange}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                  padding: 10,
                  // justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 50,
                }}
              >
                <AntDesign
                  onPress={() => navigation.goBack()}
                  name="arrowleft"
                  size={30}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 100,
                    borderWidth: 1,
                    padding: 2,
                  }}
                  color="black"
                />
              </View>
              <ImageBackground
                source={{
                  uri: food?.images[0],
                }}
                style={{
                  width: Dimensions.get("window").width + value / 1.2,
                  height: 300 + value,
                  alignSelf: "center",
                }}
              ></ImageBackground>

              <Animated.View
                style={[
                  animatedStyle,
                  {
                    height: Dimensions.get("window").height,
                    backgroundColor: "white",
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30,
                    elevation: 100,
                    shadowColor: "black",
                    borderTopWidth: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 23 }}
                  >
                    {food?.name}
                  </Text>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={{
                      uri: "https://www.shutterstock.com/image-illustration/pure-veg-icon-logo-symbol-260nw-2190482501.jpg",
                    }}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 16,
                    fontFamily: fonts.Roboto_500Medium,
                  }}
                >
                  ${food?.price}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 15,
                    color: "gray",
                  }}
                >
                  {food?.description}
                </Text>

                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.Roboto_500Medium,
                        fontSize: 19,
                      }}
                    >
                      Shop{" "}
                    </Text>
                    <View
                      style={{ alignItems: "center", flexDirection: "row" }}
                    >
                      <Entypo
                        name="location-pin"
                        size={24}
                        color={colors.secondary}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_500Medium,
                          fontSize: 17,
                          borderBottomWidth: 1,
                          borderColor: colors.secondary,
                          borderStyle: "dashed",
                        }}
                      >
                        Rama mandi jalandhar
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("shop", { shopdetail: seller })
                    }
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 200,
                        marginRight: 10,
                      }}
                      source={{ uri: seller?.image }}
                    ></Image>
                    <View>
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_500Medium,
                          fontSize: 16,
                        }}
                      >
                        {seller?.shopname}
                      </Text>
                      <Text
                        style={{
                          backgroundColor: "#15e423",
                          color: "white",
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          borderRadius: 10,
                          marginTop: 5,
                          width: 100,
                        }}
                      >
                        {seller?.ratings} ratings
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_500Medium_Italic,
                          marginTop: 5,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {/* {seller?.tags?.map((tag, i) => (
                          <Text
                            style={{
                              fontFamily: fonts.Roboto_500Medium_Italic,
                            }}
                            key={i}
                          >
                            {tag}
                          </Text>
                        ))} */}
                        {seller?.totalfoods} Items
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 9,
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        marginRight: 20,
                        fontFamily: fonts.Roboto_700Bold,
                        fontSize: 16,
                      }}
                    >
                      ${food?.price * qty}
                    </Text>
                    <AntDesign
                      onPress={() => {
                        if (qty == 1) {
                          return;
                        } else {
                          setqty((p) => p - 1);
                        }
                      }}
                      name="minus"
                      size={20}
                      color="white"
                      style={{
                        backgroundColor: colors.secondary,
                        paddingVertical: 3,
                        paddingHorizontal: 4,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    />
                    <Text
                      style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16 }}
                    >
                      {qty}
                    </Text>
                    <AntDesign
                      onPress={() => {
                        // if (qty == 1) {
                        //   return;
                        // } else {
                        setqty((p) => p + 1);
                        // }
                      }}
                      style={{
                        backgroundColor: colors.secondary,
                        paddingVertical: 3,
                        paddingHorizontal: 4,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                      }}
                      name="plus"
                      size={18}
                      color="white"
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      width: "98%",
                      alignSelf: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.secondary,
                      height: 43,
                      justifyContent: "center",
                      gap: 10,
                      marginTop: 25,
                      borderRadius: 7,
                    }}
                    onPress={() => handleAddToCart(food)}
                  >
                    <Ionicons
                      name="fast-food-outline"
                      size={24}
                      color={"white"}
                    />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 17,
                        fontFamily: fonts.Roboto_700Bold,
                      }}
                    >
                      Add to bucket
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{ width: "95%", alignSelf: "center", marginTop: 20 }}
                  >
                    <Text
                      style={{
                        color: "gray",
                        alignSelf: "center",
                        fontFamily: fonts.Roboto_700Bold,
                        fontSize: 17,
                        // marginTop: 16,
                      }}
                    >
                      Suggestions⭐
                    </Text>

                    <TopRatedFoods />
                  </View>
                </View>
              </Animated.View>
            </View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </SafeAreaView>
    </KeyboardAvoidingView>
    // </ScrollView>
  );
};

export default FoodDetailPage;

const TopRatedFoods = () => {
  const { allFoods } = useSelector((state) => state.user);
  const [sortedFoods, setsortedFoods] = useState([]);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const handleAddToCart = async (food) => {
    const isSameSeller = cart[0]?.seller == food?.seller;
    if (!isSameSeller) {
      dispatch(setCart([{ ...food, qty: 1 }]));
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

  useEffect(() => {
    if (allFoods) {
      const filterFoods = [...allFoods]?.sort(
        (a, b) => b.ratings || 0 - a.ratings || 0
      );
      setsortedFoods(filterFoods.slice(0, 6));
    }
  }, [allFoods]);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      style={{ paddingVertical: 20 }}
    >
      {sortedFoods?.map((food, i) => (
        <View
          key={i}
          style={{
            width: 170,
            marginRight: 10,
            height: 220,
            elevation: 1,
            borderRadius: 20,
            padding: 4,
            shadowOffset: -110,
            shadowOpacity: 0.5,
            shadowColor: colors.secondary,
          }}
        >
          <Image
            style={{
              height: "45%",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}
            source={{
              uri: food?.images[0],
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              padding: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 5,
              }}
            >
              <Text
                style={{
                  flexWrap: "wrap",
                  flexShrink: 30,
                  fontSize: 14,
                  fontFamily: fonts.Roboto_700Bold,
                }}
              >
                {food?.name.slice(0, 25)}
              </Text>
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
                {/* 4.4⭐ */}
                {food?.ratings ? food?.ratings + "⭐" : "4.4⭐"}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <FontAwesome
                style={{ marginTop: 2 }}
                name="rupee"
                size={14}
                color="black"
              />
              <Text>${food?.price}</Text>
            </View>

            <TouchableOpacity
              style={{
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: colors.secondary,
                paddingVertical: 3,
                borderRadius: 6,
                marginTop: 20,
              }}
              onPress={() => handleAddToCart(food)}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: fonts.Roboto_700Bold,
                  fontSize: 15,
                }}
              >
                + Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
