import { View, Text, StatusBar, Button } from "react-native";
import React, { useEffect, useState } from "react";
import Index from "./index";
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";
import { backendUrl, colors, getUserLocationUsingLonLat } from "./utils";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./shop/shop";
import {
  addOneItemToSellerAllOrder,
  setAllFoods,
  setAllFoodsOfSeller,
  setAllShops,
  setIsAuthenticated,
  setIsSeller,
  setSellerAllOrders,
  setUser,
} from "./shop/slices/userSlice";
import { setCart } from "./shop/slices/cartSlice";
import { setOrigin, setPartnerLiveOrder } from "./shop/slices/liveOrderSlice";
import { SocketProvider, useSocket } from "./SocketContext";
import {
  addOneItemToNearOrdersDelivery,
  setActiveUsers,
  setLiveLocation,
} from "./shop/slices/socketSlice";
import haversine from "haversine";
import Toaster from "./Toaster";

import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";

const App = () => {
  const { liveLocation } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { socket } = useSocket();
  const { partnerLiveOrder } = useSelector((state) => state.liveOrder);

  const [toast, settoast] = useState(false);
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  // get seller all orders
  useEffect(() => {
    const getAllOrderOfUser = async () => {
      try {
        const tkn = await AsyncStorage.getItem("token");
        // const token = JSON.parse(tkn);
        const res = await axios.get(`${backendUrl}get-seller-orders`, {
          headers: { Authorization: tkn },
        });
        if (res.data.success) {
          // setorders(res.data?.orders);
          dispatch(setSellerAllOrders(res.data.orders));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (user && user?.isseller) {
      getAllOrderOfUser();
    }
  }, [user]);

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
    if (socket) {
      socket.on("updatedStatusToBuyer", ({ status, order }) => {
        alert(status);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (user && user?.isdeliverypartner) {
      getParnerLiveOrder();
    }
  }, [user]);

  useEffect(() => {
    if (socket && user && user?.isdeliverypartner) {
      socket?.on("neworderforpartner", (data) => {
        alert("for seller");

        const getSellerData = async () => {
          try {
            const res = await axios.get(
              `${backendUrl}get-seller/${data?.sellerData?.cart[0]?.seller}`
            );

            if (
              res.data?.seller?.shopaddress?.latitude &&
              res.data?.seller?.shopaddress?.longitude
            ) {
              const { latitude, longitude } = res.data?.seller?.shopaddress;

              const getloc = async () => {
                let { status } =
                  await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                  alert("Permission to access location was denied");
                  return;
                }

                let location = await Location.getCurrentPositionAsync({});

                const distancer = haversine(
                  {
                    latitude: latitude,
                    longitude: longitude,
                  },
                  {
                    latitude: location?.coords?.latitude,
                    longitude: location?.coords?.longitude,
                  }
                );
                if (distancer <= 2) {
                  dispatch(addOneItemToNearOrdersDelivery(data));
                }
              };
              getloc();
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        getSellerData();
      });
    }
  }, [socket]);

  useEffect(() => {
    if (user && user?.isdeliverypartner) {
      if (!partnerLiveOrder) return;

      setInterval(() => {
        const getloc = async () => {
          try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              alert("Permission to access location was denied");
              return;
            }

            let location = await Location.getCurrentPositionAsync({});

            if ((socket, partnerLiveOrder?.status == "on the way")) {
              socket.emit("newLocation", {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
                order: partnerLiveOrder,
              });
            } else {
              alert("not currently in the hand on you (dilevery)");
            }

            dispatch(
              setLiveLocation({
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
              })
            );
          } catch (error) {
            console.log(error.message);
          }
        };
        getloc();
      }, 5000);
    }
  }, [user, socket, partnerLiveOrder]);

  useEffect(() => {
    if (socket) {
      socket.on("notificationOfNewOrder", (data) => {
        settoast(true);
        dispatch(addOneItemToSellerAllOrder(data?.order));
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("activeUsers", (activeUsers) => {
        console.log("active user ;-", activeUsers.length);
        activeUsers.forEach((u) => console.log(u?.user?.email));

        dispatch(setActiveUsers(activeUsers));
      });
    }
    return () => {
      if (socket) {
        socket.off();
      }
    };
  }, [socket]);

  useEffect(() => {
    const getLoc = async () => {
      try {
        if (!user?.address) return;

        const { latitude, longitude, houseno, nearby, area } = user?.address;

        const generalLocation = await getUserLocationUsingLonLat({
          latitude: latitude ? latitude : null,
          longitude: longitude ? longitude : null,
        });

        dispatch(
          setUser({
            ...user,
            address: {
              ...user.address,
              state: generalLocation?.state,
              city: generalLocation?.city,
              road:
                generalLocation?.road == "unnamed road"
                  ? ""
                  : generalLocation?.road,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    const timeer = setTimeout(() => {
      if (user) {
        getLoc();
      }
    }, 1000);

    return () => {
      clearTimeout(timeer);
    };
  }, [dispatch, user?.email]);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  // async cart data to slice
  useEffect(() => {
    const set = async () => {
      try {
        // await AsyncStorage.setItem("cart", JSON.stringify([]));
        let c = await AsyncStorage.getItem("cart");
        const crt = JSON.parse(c);

        dispatch(setCart(crt));
      } catch (error) {
        console.log(error.message);
      }
    };

    set();
  }, []);

  // cheack authorization
  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const res = await axios.get(`${backendUrl}isauthenticated`, {
            headers: { Authorization: token },
          });
          if (res.data.success) {
            dispatch(setUser(res.data.user));
            dispatch(setIsAuthenticated(true));
          }
          if (res?.data?.user?.isseller) {
            dispatch(setIsSeller(true));
          }

          if (res?.data?.user?.address) {
            const { longitude, latitude } = res?.data?.user?.address;

            if (longitude && latitude) {
              dispatch(setOrigin({ longitude, latitude }));
            }
          }
        }
      } catch (error) {
        console.log("in app.js", error.message);
      }
    };
    isAuthenticated();
  }, []);

  // get all shop
  useEffect(() => {
    const getAllShop = async () => {
      try {
        const res = await axios.get(`${backendUrl}get-all-shop`);

        if (res.data.success) {
          dispatch(setAllShops(res.data.shops));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllShop();
  }, []);

  // get all foods of seller
  useEffect(() => {
    const getAllFoods = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await axios.post(`${backendUrl}get-all-food-seller`, {
          email: user?.email,
        });

        if (res.data.success) {
          dispatch(setAllFoodsOfSeller(res.data.foods));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (user && user?.isseller) {
      getAllFoods();
    }
  }, [user]);

  // get all total foods
  useEffect(() => {
    const getFoods = async () => {
      try {
        const res = await axios.get(`${backendUrl}get-all-foods`);
        if (res.data.success) {
          dispatch(setAllFoods(res.data.foods));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getFoods();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Toaster
        heading={"new order"}
        message={"you have new order!"}
        settoast={settoast}
        toast={toast}
      />
      <StatusBar
        backgroundColor={colors.secondary}
        animated={true}
        barStyle={"light-content"}
      />

      <Index />
    </View>
  );
};

export default () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  );
};
