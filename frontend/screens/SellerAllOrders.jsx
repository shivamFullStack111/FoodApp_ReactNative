import {
  View,
  Text,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { backendUrl, colors, fonts } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SellerAllOrders = () => {
  const navigation = useNavigation();
  const [isfetched, setisfetched] = useState(false);
  const [orders, setorders] = useState([]);

  useEffect(() => {
    const getAllOrderOfUser = async () => {
      try {
        const tkn = await AsyncStorage.getItem("token");
        // const token = JSON.parse(tkn);
        const res = await axios.get(`${backendUrl}get-seller-orders`, {
          headers: { Authorization: tkn },
        });
        if (res.data.success) {
          setisfetched(true);
          setorders(res.data?.orders);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (!isfetched) {
      getAllOrderOfUser();
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={{ flex: 1, width: "95%", alignSelf: "center" }}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <AntDesign
                on
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={24}
                color="black"
              />
              <Text
                style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 19 }}
              >
                All orders
              </Text>
            </View>

            {/* card */}
            <View style={{ marginTop: 30, gap: 20, paddingBottom: 20 }}>
              {orders?.map((order, i) => {
                return <OrderCard key={i} order={order} />;
              })}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellerAllOrders;

const OrderCard = ({ order }) => {
  const [statusOpen, setstatusOpen] = useState(false);

  return (
    <View
      style={{
        width: "100%",
        elevation: 5,
        // borderWidth: 1,
        borderRadius: 15,
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 1, padding: 5 }}>
        <Text
          style={{
            fontFamily: fonts.Roboto_700Bold,
            fontSize: 20,
            paddingHorizontal: 10,
          }}
        >
          Shivam
        </Text>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            gap: 7,
            alignItems: "center",
          }}
        >
          <Ionicons name="location" size={30} color={colors.secondary} />
          <View>
            <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
              {order?.user?.address?.houseno} {order?.user?.address?.nearby}{" "}
              {order?.user?.address?.area}
            </Text>
            <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
              {order?.user?.address?.city},{order?.user?.address?.state}{" "}
            </Text>
          </View>
        </View>

        {/* status and type */}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16 }}>
              Order Status :-
            </Text>
            <Text
              onPress={() => setstatusOpen(!statusOpen)}
              style={{
                fontFamily: fonts.Roboto_500Medium,
                borderWidth: 1,
                paddingHorizontal: 5,
                paddingVertical: 1,
                position: "relative",
                borderRadius: 7,
                color: colors.secondary,
                borderColor: colors.secondary,
              }}
            >
              {order?.status}
              <AntDesign
                name={statusOpen ? "caretdown" : "caretup"}
                size={19}
                color={colors.secondary}
              />
            </Text>
            {statusOpen && (
              <View
                style={{
                  position: "absolute",
                  width: "43%",
                  bottom: -85,
                  left: "58%",
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingVertical: 6,
                    backgroundColor: "black",
                    color: colors.secondary,
                    zIndex: 50,
                    width: "100%",
                    textAlign: "center",
                    fontFamily: fonts.Roboto_500Medium,
                  }}
                >
                  cancel
                </Text>
                <View style={{ borderBottomWidth: 0.5 }}></View>
                <Text
                  style={{
                    alignSelf: "center",
                    paddingVertical: 3,
                    backgroundColor: "black",
                    color: colors.secondary,
                    zIndex: 50,
                    width: "100%",
                    textAlign: "center",
                    fontFamily: fonts.Roboto_500Medium,
                  }}
                >
                  dispatch{" "}
                </Text>
                <View style={{ borderBottomWidth: 0.5 }}></View>
                <Text
                  style={{
                    alignSelf: "center",
                    paddingVertical: 3,
                    backgroundColor: "black",
                    color: colors.secondary,
                    zIndex: 50,
                    width: "100%",
                    textAlign: "center",
                    fontFamily: fonts.Roboto_500Medium,
                  }}
                >
                  ready
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* price and items */}
        <View
          style={{
            marginTop: 4,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16 }}>
            Order type :-
          </Text>
          <Text
            style={{
              fontFamily: fonts.Roboto_500Medium,
              fontSize: 16,
              color: colors.secondary,
            }}
          >
            cash
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            gap: 7,
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 16 }}>
            Total Price
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              // marginTop: 6,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.Roboto_500Medium,
                fontSize: 16,
                color: colors.secondary,
              }}
            >
              {" "}
              ${order?.amount}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 7,
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: fonts.Roboto_500Medium, fontSize: 16 }}>
            Total Items
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 6,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.Roboto_500Medium,
                fontSize: 16,
                color: colors.secondary,
              }}
            >
              {" "}
              {order?.foods?.length}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignSelf: "center",
            gap: 20,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold,
              fontSize: 19,
              alignSelf: "center",
              textDecorationLine: "underline",
            }}
          >
            Item
            <Text
              style={{
                fontFamily: fonts.Roboto_700Bold_Italic,
                color: colors.secondary,
              }}
            >
              s
            </Text>
          </Text>
          <Text>></Text>
        </View>
      </View>
    </View>
  );
};

const bgc =
  "data:image/jpeg;base64,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";
