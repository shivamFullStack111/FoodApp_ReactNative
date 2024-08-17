import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import TypingEffect from "../components/TypingEffect";
import { useNavigation } from "@react-navigation/native";
import { backendUrl, colors, fonts } from "../utils";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const CreateFood = () => {
  const navigation = useNavigation();
  const [category, setcategory] = useState("");
  const [name, setname] = useState("");
  const [estimateprice, setestimateprice] = useState("");
  const [price, setprice] = useState("");
  const [description, setdescription] = useState("");
  const [images, setImage] = useState([]);
  const [reqSend, setreqSend] = useState(false);
  const [tags, settags] = useState("");
  const { user } = useSelector((state) => state.user);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets);
    }
  };

  const handleSubmit = async () => {
    try {
      setreqSend(true);
      const formdata = new FormData();

      // if (!name || !category || !price || !estimateprice || !description) {
      //   setreqSend(false);
      //   return alert("please fill all field");
      // }

      // if (images.length == 0) {
      //   setreqSend(false);
      //   return alert("please select food images");
      // }

      formdata.append("category", category);
      formdata.append("name", name);
      formdata.append("estimateprice", estimateprice);
      formdata.append("price", price);
      formdata.append("description", description);
      formdata.append("sellerDetails", JSON.stringify(user));
      formdata.append("tags", tags);

      images?.forEach((img) => {
        formdata.append("file", {
          uri: img.uri,
          type: img.mimeType,
          name: img.fileName,
        });
      });

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setreqSend(false);
        return alert("please login to continue");
      }

      const res = await axios.post(`${backendUrl}create-item`, formdata, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setreqSend(false);
    } catch (error) {
      console.log(error.message);
      setreqSend(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView>
          <View style={{ width: "95%", alignSelf: "center" }}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginTop: 15,
                marginLeft: 10,
              }}
            >
              <AntDesign
                name="arrowleft"
                onPress={() => navigation.goBack()}
                size={26}
                color="black"
              />
              <TypingEffect text="Create Item" />
            </View>

            <View
              style={{
                backgroundColor: "white",
                paddingVertical: 15,
                borderRadius: 15,
                marginTop: 20,
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images?.map((image) => (
                  <Image
                    key={image.uri}
                    style={{
                      width: 120,
                      height: 120,
                      marginRight: 10,
                      borderRadius: 10,
                    }}
                    source={{
                      uri: image.uri,
                    }}
                  ></Image>
                ))}
              </ScrollView>

              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 7,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderColor: colors.secondary,
                    borderColor: colors.secondary,
                    fontFamily: fonts.Roboto_700Bold,
                    color: colors.secondary,
                    borderRadius: 6,
                  }}
                  onPress={() => pickImage()}
                >
                  Add images
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 15,
                backgroundColor: "white",
                borderRadius: 15,
              }}
            >
              <View style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    color: "#4e4749",
                    fontSize: 15,
                    marginBottom: 3,
                    marginLeft: 2,
                  }}
                >
                  Name
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondary,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    placeholder="Enter item name in (upto 50 letters)"
                    maxLength={50}
                    onChangeText={(t) => setname(t)}
                  />
                </View>
              </View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    color: "#4e4749",
                    fontSize: 15,
                    marginBottom: 3,
                    marginLeft: 2,
                  }}
                >
                  Estimate price
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondary,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Enter item estimte price"
                    maxLength={50}
                    onChangeText={(t) => setestimateprice(t)}
                  />
                </View>
              </View>

              <View style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    color: "#4e4749",
                    fontSize: 15,
                    marginBottom: 3,
                    marginLeft: 2,
                  }}
                >
                  Actual price
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondary,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Enter item actual price "
                    maxLength={50}
                    onChangeText={(t) => setprice(t)}
                  />
                </View>
              </View>

              {/* categories */}
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  color: "#4e4749",
                  fontSize: 15,
                  marginBottom: 3,
                  marginLeft: "6%",
                }}
              >
                Category
              </Text>

              <SelectDropdown
                data={emojisWithIcons}
                onSelect={(selectedItem, index) => {
                  setcategory(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.title) ||
                          "Select your food category"}
                      </Text>
                      <Icon
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        style={styles.dropdownButtonArrowStyle}
                      />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: "#D2D9DF" }),
                      }}
                    >
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />

              {/* tags */}
              <View style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    color: "#4e4749",
                    fontSize: 15,
                    marginBottom: 3,
                    marginLeft: 2,
                  }}
                >
                  Tags
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondary,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    placeholder="Enter tags with space like (italin spicy) "
                    maxLength={50}
                    onChangeText={(t) => settags(t)}
                  />
                </View>
              </View>

              <View style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    color: "#4e4749",
                    fontSize: 15,
                    marginBottom: 3,
                    marginLeft: 2,
                  }}
                >
                  description
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.secondary,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 7,
                  }}
                >
                  <TextInput
                    placeholder="Enter item description "
                    multiline
                    numberOfLines={10}
                    textAlignVertical="top"
                    onChangeText={(t) => setdescription(t)}
                    style={{
                      padding: 3,
                    }}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  width: "90%",
                  height: 46,
                  backgroundColor: colors.secondary,
                  marginTop: 25,
                  marginBottom: 25,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 10,
                }}
                onPress={handleSubmit}
              >
                {reqSend ? (
                  <ActivityIndicator />
                ) : (
                  <Text
                    style={{
                      fontFamily: fonts.Roboto_700Bold,
                      fontSize: 18,
                      color: "white",
                    }}
                  >
                    Create
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateFood;

const emojisWithIcons = [
  { title: "Chinese", icon: "emoticon-happy-outline" },
  { title: "italian", icon: "emoticon-cool-outline" },
  { title: "plate ", icon: "emoticon-lol-outline" },
  { title: "sweet ", icon: "emoticon-lol-outline" },
  { title: "desert ", icon: "emoticon-lol-outline" },
  { title: "pizza ", icon: "emoticon-lol-outline" },
  { title: "burger ", icon: "emoticon-lol-outline" },
  { title: "chicken ", icon: "emoticon-lol-outline" },
  { title: "spring rolls ", icon: "emoticon-lol-outline" },
  { title: "pav bhaji ", icon: "emoticon-lol-outline" },
  { title: "noodles ", icon: "emoticon-lol-outline" },
  { title: "soup", icon: "emoticon-lol-outline" },
  { title: "drink", icon: "emoticon-lol-outline" },
  { title: "guice", icon: "emoticon-lol-outline" },
  { title: "healthy", icon: "emoticon-lol-outline" },
  { title: "cheasee", icon: "emoticon-lol-outline" },
  { title: "manchurian", icon: "emoticon-lol-outline" },
  { title: "panner", icon: "emoticon-lol-outline" },
  { title: "biryani", icon: "emoticon-lol-outline" },
];

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    flex: 1,
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    width: "90%",
    alignSelf: "center",
    marginTop: 2,
    paddingVertical: 2,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#4e4749",
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
    height: 300,
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
