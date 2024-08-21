import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  Button,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  colors,
  fonts,
  getUserLocationUsingLonLat,
  sliderData,
} from "../utils";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import SwiperSlider from "../components/Swiper";
import Profile from "./Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard_Index from "./Dashboard_Index";
import { useDispatch, useSelector } from "react-redux";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CartCircle from "../components/CartCircle";
import { setCart } from "../shop/slices/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderPage from "./OrderPage";
import PartnerTab from "./PartnerTab";
import { useSocket } from "../SocketContext";
import {
  setActiveUsers,
  setSocketToUser,
  setUserToSocket,
} from "../shop/slices/socketSlice";
import SellerAllOrders from "./SellerAllOrders";

const Home = () => {
  const navigation = useNavigation();
  const { allShops, allFoods, user } = useSelector((state) => state.user);

  // const [address, setaddress] = useState({
  //   latitude: "",
  //   longitude: "",
  //   houseno: "",
  //   nearby: "",
  //   area: "",
  // });

  // useEffect(() => {
  //   console.log("my socket id", UserToSocket.get(user?._id));
  // }, [UserToSocket]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CartCircle />
      <ScrollView style={{ flex: 1, marginBottom: 60 }}>
        <View
          style={{
            height: 100,
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <FontAwesome5
              name="map-marker-alt"
              size={34}
              color={colors.secondary}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("location")}
              style={{}}
            >
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 17 }}
              >
                {user?.isdeliverypartner && "Delivery"}
                {!user?.isdeliverypartner && "Home"}{" "}
                <Entypo name="chevron-thin-down" size={14} color="black" />
              </Text>
              {user?.address && !user?.isdeliverypartner && (
                <Text>
                  {user?.address?.houseno} {user?.address?.area}{" "}
                  {user?.address?.nearby} , {user?.address?.city}
                </Text>
              )}
              {user?.deliverydata && user?.isdeliverypartner && (
                <Text>
                  <Text style={{ fontFamily: fonts.Roboto_700Bold }}>
                    Delivering on :-{" "}
                  </Text>
                  {user?.deliverydata?.state} {user?.deliverydata?.area}
                  {user?.deliverydata?.nearby} , {user?.deliverydata?.city}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CategoryOrSearchProducts", { search: "" })
          }
          style={{
            alignSelf: "center",
            flexDirection: "row",
            backgroundColor: "white",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 8,
            width: "95%",
            height: 40,
            elevation: 20,
            shadowOffset: -20,
            shadowOpacity: 1,
            shadowRadius: 3,
            borderRadius: 6,
            shadowColor: colors.secondary,
          }}
        >
          <Ionicons name="search" size={24} color={colors.secondary} />
          <Text
            placeholder="Search 'pizza' 'burger' 'desert' ..."
            style={{ flex: 1 }}
          >
            Search 'pizza' 'burger' 'desert' ...
          </Text>
        </TouchableOpacity>
        <SwiperSlider />
        <Text
          style={{
            alignSelf: "center",
            marginTop: 10,
            fontFamily: fonts.Roboto_700Bold,
            fontSize: 15,
            color: "gray",
          }}
        >
          Our most ordered food
        </Text>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View
            style={{
              width: "95%",
              height: 225,
              alignSelf: "center",
              flexWrap: "wrap",
              padding: 10,
            }}
          >
            {categories.map((cat, i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  navigation.navigate("CategoryOrSearchProducts", {
                    search: cat?.name,
                  })
                }
              >
                <View
                  style={{
                    alignItems: "center",
                    height: 70,
                    width: 70,
                    margin: 10,
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 200,
                      height: 70,
                      width: 70,
                      padding: 2,
                      elevation: 2,
                      shadowColor: colors.secondary,
                    }}
                  >
                    <Image
                      style={{
                        borderRadius: 200,
                        flex: 1,
                      }}
                      source={{ uri: cat.image }}
                    ></Image>
                  </View>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontFamily: fonts.Roboto_500Medium,
                      fontSize: 13,
                    }}
                  >
                    {cat.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* all restaurants */}
        <View style={{ width: "95%", alignSelf: "center" }}>
          <Text
            style={{
              fontFamily: fonts.Roboto_900Black_Italic,
              color: "gray",
              alignSelf: "center",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            ALL RESTAURANTS
          </Text>
          <View
            style={{
              flex: 1,
              // backgroundColor: "white",
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 20,
              // marginTop: 15,
              borderRadius: 15,
              width: "100%",
              height: 120,
            }}
          >
            <ScrollView
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
              horizontal
            >
              {allShops?.map((shp, i) => (
                <ShopNav shop={shp} key={i} />
              ))}
            </ScrollView>
          </View>
        </View>
        {/* top rated food  */}
        <View style={{ width: "95%", alignSelf: "center" }}>
          <Text
            style={{
              color: "gray",
              alignSelf: "center",
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 17,
              // marginTop: 16,
            }}
          >
            Top Rated Foods ⭐
          </Text>

          <TopRatedFoods />
        </View>
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            marginTop: 40,
            gap: 20,
            paddingBottom: 20,
          }}
        >
          {allFoods?.map((food, i) => (
            <Card key={i} food={food} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const Card = ({ food }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: "white",
        elevation: 5,
        width: "95%",
        borderRadius: 15,
      }}
    >
      <TouchableOpacity
        style={{
          width: "100%",
          height: 330,
          alignSelf: "center",
          elevation: 1,
          borderRadius: 15,
          backgroundColor: colors.secondary,
          position: "relative",
        }}
        onPress={() =>
          navigation.navigate("foodDetailPage", {
            food: food,
          })
        }
      >
        {/* absolute view */}

        <Text
          style={{
            color: "white",
            paddingHorizontal: 15,
            paddingVertical: 2,
            fontFamily: fonts.Roboto_500Medium_Italic,
            // maxHeight: 10,
          }}
        >
          Free delivery
        </Text>
        <Image
          style={{
            width: "100%",
            height: "65%",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
          source={{
            uri: food?.images[0],
          }}
        ></Image>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "relative",
              paddingHorizontal: 10,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <View
              style={{
                width: "40%",
                height: 20,
                borderTopRightRadius: 30,
                backgroundColor: "white",
                bottom: "110%",
                justifyContent: "center",
                paddingLeft: 6,
                position: "absolute",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.Roboto_700Bold,
                  fontSize: 12,
                  color: "#28ce25",
                }}
              >
                19 mins . 2.4 km
              </Text>
            </View>
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 18 }}>
              {food?.name.slice(0, 26)}
              {food?.name?.length > 30 ? "..." : ""}
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
              4.4⭐
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontFamily: fonts.Roboto_500Medium, color: "gray" }}>
              {food?.category}
            </Text>
            <Text style={{ fontFamily: fonts.Roboto_500Medium, color: "gray" }}>
              South Indian
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FontAwesome
                style={{ marginTop: 2 }}
                name="rupee"
                size={14}
                color="black"
              />
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                }}
              >
                ${food?.price}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const TopRatedFoods = () => {
  const { allFoods, user } = useSelector((state) => state.user);
  const [sortedFoods, setsortedFoods] = useState([]);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const gett = async () => {
  //     const cart = await AsyncStorage.getItem("cart");
  //     console.log(cart);
  //   };
  //   gett();
  // }, []);

  const handleAddToCart = async (food) => {
    if (user?.email == food?.seller)
      return alert("you cannot add this item its from your shop");
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

const Tab = createBottomTabNavigator();
export default BottomTab = () => {
  const { isSeller, isAuthenticated, user } = useSelector(
    (state) => state.user
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          width: "94%",
          marginLeft: "3%",
          marginBottom: 10,
          height: 60,
          borderRadius: 10,
          elevation: 5,
          backgroundColor: "white",
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={focused ? 34 : 28}
              color={focused ? colors.secondary : "black"}
            />
          ),
        }}
        name="Home"
        component={Home}
      />
      {isAuthenticated && !user?.isdeliverypartner && !user?.isseller && (
        <Tab.Screen
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="fast-food"
                size={focused ? 34 : 28}
                color={focused ? colors.secondary : "black"}
              />
            ),
          }}
          name="OrderPage"
          component={OrderPage}
        />
      )}
      {user?.isseller && (
        <Tab.Screen
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="boxes"
                size={focused ? 34 : 28}
                color={focused ? colors.secondary : "black"}
              />
            ),
          }}
          name="sellerorders"
          component={SellerAllOrders}
        />
      )}
      {isSeller && (
        <Tab.Screen
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="dashboard-customize"
                size={focused ? 34 : 28}
                color={focused ? colors.secondary : "black"}
              />
            ),
          }}
          name="dashboard"
          component={Dashboard_Index}
        />
      )}

      {user?.isdeliverypartner && (
        <Tab.Screen
          name="PartnerTab"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="delivery-dining"
                size={focused ? 40 : 34}
                color={focused ? colors.secondary : "black"}
              />
            ),
          }}
          component={PartnerTab}
        />
      )}

      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={focused ? 34 : 28}
              color={focused ? colors.secondary : "black"}
            />
          ),
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};

const ShopNav = ({ shop }) => {
  const navigation = useNavigation();
  const width = useSharedValue(180);
  const height = useSharedValue(60);

  const animationStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
    };
  });

  useEffect(() => {
    const intervel = setInterval(() => {
      if (width.value == 180 && height.value == 60) {
        width.value = withTiming(190, { duration: 800 });
        height.value = withTiming(65, { duration: 800 });
      } else {
        width.value = withTiming(180, { duration: 800 });
        height.value = withTiming(60, { duration: 800 });
      }
    }, 800);

    return () => {
      clearInterval(intervel);
    };
  }, []);

  return (
    <View
      style={{
        width: 210,
        height: 75,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          animationStyle,
          {
            backgroundColor: "white",
            elevation: 5,
            borderRadius: 30,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("shop", { shopdetail: shop })}
          style={[
            {
              elevation: 5,
              flexDirection: "row",
              backgroundColor: "white",
              // backgroundColor: colors.secondary,
              paddingHorizontal: 25,
              borderRadius: 80,
              justifyContent: "center",
              flex: 1,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.secondary,
              borderStyle: "dashed",
              gap: 5,
            },
          ]}
        >
          <Image
            style={{ width: 30, height: 30, borderRadius: 100 }}
            source={{ uri: resLogo }}
          ></Image>
          <View>
            <Text
              style={{
                fontFamily: fonts.Roboto_500Medium_Italic,
                color: colors?.secondary,
                fonts: 13,
              }}
            >
              {shop?.shopname}
            </Text>
            <Text>
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, color: "black" }}
              >
                Ratings:
              </Text>{" "}
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, color: "black" }}
              >
                4.8
              </Text>{" "}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const resLogo =
  "data:image/png;base64,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";

const categories = [
  {
    name: "pizza",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe5DeYCGnMHeBDguPKXx_JQsKUkNyKimZjLQ&s",
  },
  {
    name: "burger",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS99yDgCTd-ncOIBaCPDY2itt7sD3VbkTXksw&s",
  },
  {
    name: "deserts",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    name: "chicken",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmyCdnjtBz6-Ab_iAyGKCaPEXqOdjSKzY4TA&s",
  },
  {
    name: "biryani",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF0JJgbJUnZg5FFHmoiFdpjcIsrmicXoSB2w&s",
  },
  {
    name: "spring rolls",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    name: "pav bhaji",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    name: "noodles",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77GR3TSwRdVax4rLRftouixLUjeqPf_nTPQ&s",
  },
  {
    name: "noodles",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77GR3TSwRdVax4rLRftouixLUjeqPf_nTPQ&s",
  },
  {
    name: "noodles",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77GR3TSwRdVax4rLRftouixLUjeqPf_nTPQ&s",
  },
];
