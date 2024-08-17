import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  AntDesign,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { backendUrl, colors, fonts } from "../utils";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../SocketContext";
import { useSelector } from "react-redux";

const OrderPage = () => {
  const [orders, setorders] = useState([]);
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const isFocuse = useIsFocused();
  const { socket } = useSocket();
  const { toggleForUserAllOrder } = useSelector((state) => state.user);

  useEffect(() => {
    const getAllOrderOfUser = async () => {
      try {
        const tkn = await AsyncStorage.getItem("token");
        // const token = JSON.parse(tkn);
        const res = await axios.get(`${backendUrl}get-user-orders`, {
          headers: { Authorization: tkn },
        });
        if (res.data.success) {
          setorders(res.data.orders);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllOrderOfUser();
  }, [toggleForUserAllOrder]);

  useEffect(() => {
    if (socket) {
      socket.on("updatedStatusToBuyer", ({ status, order }) => {
        let updatedStatusOrder = orders?.map((ordr) => {
          if (ordr?._id == order?._id) {
            return {
              ...ordr,
              status: status,
            };
          } else {
            return ordr;
          }
        });
        setorders(updatedStatusOrder);
      });
    }
    return () => {
      if (socket) {
        socket.off("updatedStatusToBuyer");
      }
    };
  }, [socket, orders]);

  return (
    <ScrollView style={{ flex: 1 }}>
      {!orders.length ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width,
            height,
          }}
        >
          <View
            style={{
              width: "80%",
              height: "30%",
              borderRadius: 15,
              elevation: 30,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: colors.secondary,
            }}
          >
            <Fontisto
              name="shopping-basket-add"
              size={40}
              color={colors.secondary}
            />
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold,
                color: colors.secondary,
                fontSize: 20,
                marginTop: 10,
              }}
            >
              No order found!
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1, width: "95%", alignSelf: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingVertical: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: fonts.Roboto_900Black, fontSize: 29 }}>
              All Orders{" "}
            </Text>
            <MaterialCommunityIcons
              name="archive-cancel-outline"
              size={30}
              color="black"
            />
          </View>
          {orders.map((order, i) => {
            // if (order.status == "processing" || order.status == "dispatch") {
            return <ActiveOrderCart orderr={{ order }} key={i} />;
            // }
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default OrderPage;

const ActiveOrderCart = ({ orderr }) => {
  const [itemListOpen, setItemListOpen] = useState(true);
  const navigation = useNavigation();
  const order = orderr.order;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("orderTracking", {
          order: order,
          sellerEmail: order?.seller,
        })
      }
      style={{
        backgroundColor: "white",
        elevation: 4,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        borderRadius: 15,
        marginBottom: 10,
        shadowOffset: {
          width: 0.6,
          height: 0.4,
        },
        padding: 10,
      }}
    >
      <View style={{}}>
        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
          <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 18 }}>
            Order id :-{" "}
          </Text>
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 15,
              textDecorationLine: "underline",
            }}
          >
            {order?._id}
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
          <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 17 }}>
            Total Bill :-{" "}
          </Text>
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 15,
              textDecorationLine: "underline",
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
          <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 17 }}>
            Total Items :-{" "}
          </Text>
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 15,
              textDecorationLine: "underline",
            }}
          >
            {order?.foods?.length}
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
          <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 17 }}>
            Order date :-{" "}
          </Text>
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 15,
              textDecorationLine: "underline",
            }}
          >
            {order?.createdAt?.slice(0, 10)}
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
          <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 17 }}>
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

        {/* <Text
          style={{
            alignSelf: "center",
            fontSize: 19,
            fontFamily: fonts.Roboto_700Bold,
            marginTop: 15,
          }}
        >
          Seller{" "}
          <Text
            style={{
              color: colors.secondary,
              fontFamily: fonts.Roboto_700Bold_Italic,
            }}
          >
            details
          </Text>
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            backgroundColor: "white",
            elevation: 4,
            borderRadius: 10,
            marginTop: 10,
            padding: 5,
          }}
        >
          <Image
            source={{ uri: "dcd" }}
            style={{ width: 70, height: 70, borderRadius: 10, borderWidth: 1 }}
          ></Image>
          <View>
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 14 }}>
              {order?.seller}
            </Text>
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold_Italic,
                color: colors.secondary,
              }}
            >
              ⭐ ⭐ ⭐ ⭐ (4/5)
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <Text style={{ fontFamily: fonts.Roboto_700Bold }}>
                Contact :-{" "}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Roboto_700Bold_Italic,
                  color: colors.secondary,
                }}
              >
                9428374939
              </Text>
            </View>
          </View>
        </View> */}

        <Text
          style={{
            alignSelf: "center",
            marginTop: 10,
            fontSize: 18,
            fontFamily: fonts.Roboto_700Bold,
          }}
        >
          Order{" "}
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold_Italic,
              color: colors.secondary,
            }}
          >
            Items
          </Text>
        </Text>

        <View>
          <TouchableOpacity
            onPress={() => setItemListOpen(!itemListOpen)}
            style={{ alignSelf: "flex-end", marginRight: 10 }}
          >
            <AntDesign
              name={itemListOpen ? "caretdown" : "caretright"}
              size={22}
              color="black"
            />
          </TouchableOpacity>

          {itemListOpen && (
            <View>
              {order?.foods?.map((food, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    backgroundColor: "white",
                    elevation: 4,
                    borderRadius: 10,
                    marginTop: 10,
                    padding: 5,
                  }}
                >
                  <Image
                    source={{ uri: food?.images[0] }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 10,
                      borderWidth: 1,
                    }}
                  ></Image>
                  <View style={{ flexShrink: 40 }}>
                    <Text
                      style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 14 }}
                    >
                      {food?.name?.slice(0, 30)}
                      {food?.name?.length > 30 && "..."}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.Roboto_700Bold_Italic,
                      }}
                    >
                      $394
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.Roboto_500Medium,
                        flexWrap: "wrap",
                        width: "100%",
                        color: "#0009",
                      }}
                    >
                      {food?.description?.slice(0, 50)}
                      {food?.description?.length > 50 && "..."}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* <View style={{flexDirection:'row',gap:10}}>
        <Image
          style={{ height: 70, width: 70, borderRadius: 10, borderWidth: 1 }}
          source={{ uri: "hujndej" }}
        ></Image>
        <View >
          <Text></Text>
        </View>
      </View> */}
    </TouchableOpacity>
  );
};
