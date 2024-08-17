import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Foundation } from "@expo/vector-icons";
import { colors, fonts } from "../utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
// import { Restart } from "fiction-expo-restart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAllFoods,
  setAllFoodsOfSeller,
  setIsAuthenticated,
  setIsSeller,
} from "../shop/slices/userSlice";
import { useSocket } from "../SocketContext";

const Profile = () => {
  const { socket } = useSocket();
  const { isSeller, user, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const navigation = useNavigation();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [totalorders, settotalorders] = useState("");
  const [address, setaddress] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && isAuthenticated) {
      setname(user?.name);
      setemail(user?.email);
      settotalorders(user?.orders);
      setaddress(user?.address);
    }
  }, [user]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 15,
              padding: 10,
              alignItems: "center",
            }}
          >
            <AntDesign
              onPress={() => navigation.goBack()}
              name="arrowleft"
              size={30}
              color="black"
            />
            <Text style={{ fontSize: 19, fontFamily: fonts.Roboto_700Bold }}>
              Profile
            </Text>
          </View>
          {isAuthenticated && (
            <View style={{ width: "85%", alignSelf: "center" }}>
              {isSeller ? (
                <Image
                  source={{
                    uri: user?.image,
                  }}
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 200,
                    alignSelf: "center",
                    marginTop: 40,
                    borderWidth: 1,
                    borderColor: "#4be429",
                  }}
                ></Image>
              ) : null}
              <View
                style={{
                  marginTop: 30,
                  backgroundColor: "white",
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  borderRadius: 10,
                  // backgroundColor: "white",

                  elevation: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="user" size={28} color={colors.secondary} />
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: fonts.Roboto_500Medium,
                      color: "gray",
                      fontSize: 16,
                    }}
                    value={name}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",

                    gap: 10,
                    alignItems: "center",
                    marginTop: 15,
                  }}
                >
                  <Foundation name="mail" size={28} color={colors.secondary} />
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: fonts.Roboto_500Medium,
                      color: "gray",
                      fontSize: 16,
                    }}
                    value={email}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",

                    gap: 10,
                    alignItems: "center",
                    marginTop: 15,
                  }}
                >
                  <FontAwesome6
                    name="basket-shopping"
                    size={21}
                    color={colors.secondary}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: fonts.Roboto_500Medium,
                      color: "gray",
                      fontSize: 16,
                    }}
                    value={totalorders || 0}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",

                    gap: 10,
                    alignItems: "center",
                    marginTop: 15,
                  }}
                >
                  <Entypo name="location" size={24} color={colors.secondary} />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: fonts.Roboto_500Medium,
                      color: "gray",
                      fontSize: 16,
                    }}
                  >
                    {!address && "your dilevery location"}
                    {address?.houseno} {address?.area} {address?.nearby} ,{" "}
                    {address?.city}
                  </Text>
                </View>
              </View>

              {/* for make seller account */}
              {!isSeller && !user?.isdeliverypartner && (
                <View
                  style={{
                    marginTop: 30,
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    borderRadius: 10,
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
                    <Text style={{ color: "red" }}>*</Text> To create a shop you
                    have to follow some
                    <Text style={{ color: "red" }}> Terms/Conditions</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("createShop")}
                    style={{
                      marginTop: 15,
                      width: "90%",
                      borderWidth: 1,
                      borderColor: colors.secondary,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 38,
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.Roboto_700Bold,
                        fontSize: 16,
                        color: colors.secondary,
                      }}
                    >
                      Create Shoop ->
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {!isSeller && !user?.isdeliverypartner && (
                <View
                  style={{
                    marginTop: 10,
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    borderRadius: 10,
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
                    <Text style={{ color: "red" }}>*</Text> To become a delivery
                    partner you have to follow some
                    <Text style={{ color: "red" }}> Terms/Conditions</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("becomeDeliveryPartner")}
                    style={{
                      marginTop: 15,
                      width: "90%",
                      borderWidth: 1,
                      borderColor: colors.secondary,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 38,
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.Roboto_700Bold,
                        fontSize: 16,
                        color: colors.secondary,
                      }}
                    >
                      Become partner ->
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {!isAuthenticated && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                gap: 30,
                marginTop: 30,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 140,
                  height: 43,
                  borderRadius: 10,
                  backgroundColor: colors.secondary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("register")}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.Roboto_700Bold,
                    fontSize: 17,
                  }}
                >
                  Register
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 140,
                  height: 43,
                  borderRadius: 10,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.secondary,
                }}
                onPress={() => navigation.navigate("login")}
              >
                <Text
                  style={{
                    color: colors.secondary,
                    fontFamily: fonts.Roboto_700Bold,
                    fontSize: 17,
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isAuthenticated && (
            <TouchableOpacity
              style={{
                width: 130,
                height: 40,
                backgroundColor: colors.secondary,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                alignSelf: "center",
                marginBottom: 20,
                elevation: 10,
                shadowColor: colors.secondary,
              }}
              onPress={() => {
                const logOut = async () => {
                  if (socket) {
                    socket?.disconnect();
                    socket?.off();
                  }
                  await AsyncStorage.removeItem("token");
                  dispatch(setIsAuthenticated(false));
                  dispatch(setIsSeller(false));
                  dispatch(setAllFoodsOfSeller(null));
                  // Restart();
                };
                logOut();
              }}
            >
              <Text
                style={{ color: "white", fontFamily: fonts.Roboto_500Medium }}
              >
                Log out
              </Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
