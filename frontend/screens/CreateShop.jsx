import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { Ionicons } from "@expo/vector-icons";

import AppIntroSlider from "react-native-app-intro-slider";
import { AntDesign } from "@expo/vector-icons";
import { backendUrl, colors, fonts, headings } from "../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setIsSeller, setUser } from "../shop/slices/userSlice";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";

const CreateShop = () => {
  const [TandC, setTandC] = useState(false);
  const [isCreating, setisCreating] = useState(0);
  const navigation = useNavigation();
  const [name, setname] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [shopaddress, setshopaddress] = useState("");
  const [shoptype, setshoptype] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [image, setImage] = useState(null);
  const [isReqSend, setisReqSend] = useState(false);
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setisReqSend(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return alert("Please login to continue");

      if (
        !name ||
        !shoptype ||
        !shopaddress ||
        !phonenumber ||
        !city ||
        !state
      ) {
        setisReqSend(false);
        return alert("All fields are required");
      }

      if (!image) {
        setisReqSend(false);
        return alert("Please select an image");
      }

      const formdata = new FormData();
      formdata.append("shoptype", shoptype.title);
      formdata.append("phonenumber", phonenumber);
      formdata.append("shopaddress", shopaddress);
      formdata.append("latitude", location?.coords?.latitude);
      formdata.append("longitude", location?.coords?.longitude);
      formdata.append("shopname", name);
      formdata.append("city", city);
      formdata.append("state", state);
      formdata.append("file", {
        uri: image?.uri,
        type: image?.mimeType,
        name: image?.fileName,
      });

      const res = await axios.post(`${backendUrl}create-shop`, formdata, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setisReqSend(false);
      if (res.data.success) {
        dispatch(setIsSeller(true));
        dispatch(setUser(res?.data?.user));
      }
    } catch (error) {
      console.log(error.message);
      setisReqSend(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {isCreating == 0 && (
        <AppIntroSlider
          renderDoneButton={() => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: colors.secondary,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign
                onPress={() => {
                  if (TandC) {
                    setisCreating(1);
                  } else {
                    alert("Please accept terms and conditions");
                  }
                }}
                name="check"
                size={24}
                color="white"
              />
            </View>
          )}
          renderNextButton={() => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: colors.secondary,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="arrowright" size={24} color="white" />
            </View>
          )}
          style={{ flex: 1 }}
          renderItem={({ index, item }) => (
            <RenderItem
              TandC={TandC}
              setTandC={setTandC}
              index={index}
              item={item}
            />
          )}
          data={slides}
        />
      )}

      {isCreating == 1 && (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <KeyboardAvoidingView>
              <View
                style={{ width: "95%", alignSelf: "center", paddingBottom: 20 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginVertical: 20,
                  }}
                >
                  <AntDesign
                    onPress={() => {
                      navigation.goBack();
                    }}
                    name="arrowleft"
                    size={24}
                    color="black"
                  />
                  <Text
                    style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 23 }}
                  >
                    Creating{" "}
                    <Text style={{ color: colors.secondary }}>Shop</Text>
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 15,
                    fontFamily: fonts.Roboto_700Bold,
                    fontSize: 17,
                    marginLeft: 5,
                  }}
                >
                  Read Carefully
                </Text>
                <Text
                  style={{ marginTop: 7, fontFamily: fonts.Roboto_500Medium }}
                >
                  <Text style={{ color: "red" }}>* </Text>
                  You have to prepare orders timely.
                </Text>
                <Text
                  style={{ marginTop: 3, fontFamily: fonts.Roboto_500Medium }}
                >
                  <Text style={{ color: "red" }}>* </Text>
                  Pack the items properly to avoid damage or leakage.
                </Text>
                <Text
                  style={{ marginTop: 3, fontFamily: fonts.Roboto_500Medium }}
                >
                  <Text style={{ color: "red" }}>* </Text>
                  Confirm the order once it's prepared.
                </Text>
                <Text
                  style={{ marginTop: 3, fontFamily: fonts.Roboto_500Medium }}
                >
                  <Text style={{ color: "red" }}>* </Text>
                  Verify the order ID with the delivery person.
                </Text>

                <View
                  style={{ width: "90%", marginTop: 20, alignSelf: "center" }}
                >
                  <Image
                    style={{
                      alignSelf: "center",
                      width: 150,
                      height: 150,
                      backgroundColor: "gray",
                      borderRadius: 20,
                    }}
                    source={{ uri: image?.uri }}
                  />
                  <Text
                    style={{
                      alignSelf: "center",
                      marginTop: 10,
                      fontFamily: fonts.Roboto_500Medium,
                      fontSize: 16,
                    }}
                  >
                    Choose Shop Logo Image
                  </Text>

                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      width: 120,
                      height: 40,
                      borderWidth: 1,
                      borderColor: colors.secondary,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      alignSelf: "center",
                      marginTop: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.Roboto_500Medium,
                      }}
                    >
                      Select Image
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      height: 40,
                      borderWidth: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginTop: 20,
                      borderRadius: 8,
                      borderColor: colors.secondary,
                    }}
                  >
                    <Entypo name="shop" size={22} color={colors.secondary} />
                    <TextInput
                      style={{ flex: 1, marginLeft: 10 }}
                      placeholder="Enter shop name"
                      onChangeText={(t) => setname(t)}
                    />
                  </View>

                  <View
                    style={{
                      height: 40,
                      borderWidth: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginTop: 15,
                      borderRadius: 8,
                      borderColor: colors.secondary,
                    }}
                  >
                    <Ionicons name="call" size={22} color={colors.secondary} />
                    <TextInput
                      keyboardType="numeric"
                      onChangeText={(t) => setphonenumber(t)}
                      maxLength={10}
                      style={{ flex: 1, marginLeft: 10 }}
                      placeholder="Enter phone number"
                    />
                  </View>

                  <View
                    style={{
                      height: 40,
                      borderWidth: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginTop: 15,
                      borderRadius: 8,
                      borderColor: colors.secondary,
                    }}
                  >
                    <Entypo
                      name="location"
                      size={22}
                      color={colors.secondary}
                    />
                    <TextInput
                      onChangeText={(t) => setshopaddress(t)}
                      style={{ flex: 1, marginLeft: 10 }}
                      placeholder="Enter your store pickup location"
                    />
                  </View>

                  <View
                    style={{
                      height: 40,
                      borderWidth: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginTop: 15,
                      borderRadius: 8,
                      borderColor: colors.secondary,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={22}
                      color={colors.secondary}
                    />
                    <TextInput
                      onChangeText={(t) => setCity(t)}
                      style={{ flex: 1, marginLeft: 10 }}
                      placeholder="Enter your city"
                    />
                  </View>

                  <View
                    style={{
                      height: 40,
                      borderWidth: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginTop: 15,
                      borderRadius: 8,
                      borderColor: colors.secondary,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={22}
                      color={colors.secondary}
                    />
                    <TextInput
                      onChangeText={(t) => setState(t)}
                      style={{ flex: 1, marginLeft: 10 }}
                      placeholder="Enter your state"
                    />
                  </View>

                  <View
                    style={{
                      height: 40,
                      borderWidth: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      marginTop: 15,
                      borderRadius: 8,
                      borderColor: colors.secondary,
                    }}
                  >
                    <SelectDropdown
                      data={emojisWithIcons}
                      onSelect={(selectedItem, index) => {
                        setshoptype(selectedItem);
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              flex: 1,
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                color: selectedItem ? "black" : "gray",
                              }}
                            >
                              {(selectedItem && selectedItem.title) ||
                                "Select your food item types"}
                            </Text>
                            <AntDesign
                              name={isOpened ? "up" : "down"}
                              size={16}
                            />
                          </View>
                        );
                      }}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <View
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 15,
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: isSelected ? "#D2D9DF" : "white",
                            }}
                          >
                            <Text>{item.title}</Text>
                          </View>
                        );
                      }}
                      buttonStyle={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: colors.secondary,
                        borderRadius: 8,
                        justifyContent: "center",
                        paddingHorizontal: 10,
                      }}
                      dropdownStyle={{
                        marginTop: -22,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.secondary,
                      }}
                    />
                  </View>
                  {!location && (
                    <TouchableOpacity
                      onPress={() => getLocation()}
                      style={{
                        backgroundColor: colors.secondary,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                        marginTop: 10,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.Roboto_700Bold,
                          color: "white",
                        }}
                      >
                        Use your current location
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10,
                    gap: 15,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("home")}
                    style={{
                      width: 135,
                      height: 40,
                      borderWidth: 1.3,
                      borderColor: colors.secondary,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.secondary,
                        fontSize: 17,
                        fontFamily: fonts.Roboto_700Bold,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={{
                      width: 135,
                      height: 40,
                      backgroundColor: colors.secondary,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    {isReqSend ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 17,
                          fontFamily: fonts.Roboto_700Bold,
                        }}
                      >
                        Confirm
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

export default CreateShop;

const RenderItem = ({ index, item, TandC, setTandC }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Image
        source={{ uri: item.image }}
        style={{
          width: "80%",
          height: "40%",
          objectFit: "fill",
          alignSelf: "center",
          marginTop: 60,
        }}
      ></Image>
      {index == slides.length - 1 && (
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setTandC(!TandC)}
            style={{
              backgroundColor: "white",
              width: 20,
              height: 20,
              borderWidth: 1,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              borderColor: colors.secondary,
            }}
          >
            {TandC && (
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor: colors.secondary,
                }}
              ></View>
            )}
          </TouchableOpacity>
          <Text>accept term's and condition</Text>
        </View>
      )}
    </View>
  );
};

const emojisWithIcons = [
  { title: "veg", icon: "emoticon-happy-outline" },
  { title: "non veg", icon: "emoticon-cool-outline" },
  { title: "both", icon: "emoticon-lol-outline" },
];

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    flex: 1,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    borderRadius: 8,
    bottom: 100,
    height: 120,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export const slides = [
  {
    key: 1,
    title: "Title 1",
    text: "Description.\nSay something cool",
    backgroundColor: "#59b2ab",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    key: 2,
    title: "Title 2",
    text: "Other cool stuff",
    backgroundColor: "#febe29",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    key: 3,
    title: "Rocket guy",
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    backgroundColor: "#22bcb5",
    image:
      "data:image/jpeg;base64,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",
  },
];
