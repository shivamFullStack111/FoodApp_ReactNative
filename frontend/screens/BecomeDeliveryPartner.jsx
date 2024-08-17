import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { backendUrl, colors, fonts } from "../utils";
import * as ImagePicker from "expo-image-picker";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
} from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { setUser } from "../shop/slices/userSlice";
import { useDispatch } from "react-redux";

const BecomeDeliveryPartner = () => {
  const [TandC, setTandC] = useState(false);
  const [isCreating, setisCreating] = useState(1);
  const [name, setname] = useState("");
  const [age, setage] = useState("");
  const [state, setstate] = useState("");
  const [city, setcity] = useState("");
  const dispatch = useDispatch();

  const [apiCalling, setapiCalling] = useState(false);

  const [imageurl, setimageurl] = useState("");
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

  const handleSubmit = async () => {
    try {
      setapiCalling(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setapiCalling(false);
        return alert("token not found please login to continue");
      }

      const formdata = new FormData();
      formdata.append("file", {
        uri: imageurl?.uri,
        type: imageurl?.mimeType,
        name: imageurl.fileName,
      });
      formdata.append("name", name);
      formdata.append("age", age);
      formdata.append("state", state);
      formdata.append("city", city);

      const res = await axios.post(
        `${backendUrl}become-delivery-partner`,
        formdata,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res?.data?.success) {
        dispatch(setUser(res?.data?.user));
        navigation.goBack();
      }

      setapiCalling(false);
    } catch (error) {
      console.log(error.message);
      setapiCalling(false);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setimageurl(result.assets[0]);
      console.log(result.assets[0]);
    }
  };

  return (
    // <View style={{ flex: 1 }}>
    <KeyboardAvoidingView style={{ flex: 1 }}>
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
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              minHeight: height * 0.7,
            }}
          >
            <Image
              style={{ alignSelf: "center", height: 400, width: "100%" }}
              source={{
                uri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhIWFhUWFRUWFxYWFxcQFRUVFxcZFhUXFxUYHSggGholGxUXITEiJSkrLi4vGB8zODMtNygtLisBCgoKDg0OGxAQGi0lICUuLS0tLS0wLy0tLzAtLSstLS0tLi0xLS0tLSstLS0tLS0tLSstLS0tLS0tLS0tKy0rMv/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYDBAcCAQj/xABJEAABAwIDBAYGBgUKBwEAAAABAAIDBBESITEFBkFRBxMiYXGBMjNykaGxFEJSs8HRIzRiorIVQ1NzgoOEk/DxkqPCw9LT4ST/xAAaAQEAAgMBAAAAAAAAAAAAAAAAAQIDBAUG/8QAMhEBAAICAAQCCQMEAwEAAAAAAAECAxEEEiExBUETIlFhcYGRobEUwdEyUuHwFSNC8f/aAAwDAQACEQMRAD8A7igICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgwz1TWekc+XFRtMRMtSqrj9Q+aiZWivtNl15eXMd6Qzvpcf6+aROy1ddUirKCAgICAgICAgICAgICAgICAgICAgICAgINLaFYWZC3momVq12h6uQaqkssPUcoPHgiNMbqnA9pabH4Ecj3JtOtwn6Cp62MPta9/gSPwV4ncMNo1OmwpQICAgICAgICAgICAgICDy94AuUGmdoi9hoNVXa/Kja1xeCbqJXjo39hVLnxdv0muLbnUgZg+4/BTWdwpeNT0SKsoICAgINWu2fHMLPBNuTnMPvaQVExErRaY7Ims3cc9wAnLWcRgu+3c8mw/4SqzTa8ZNeTPT7txNcDikdbQF5t8LE+amKQicky9Rbuwh+N+KTk2QhzB/ZAF/O6ckHpJ1pLNaAAALAZADIAKzG+oCAgII+qriCQ22XHW6rMrxVozVL365crEhRuV4iISWzKrG2xPbaO1+atEsdo03FKogICAgICAgr1RtDtuY45jPCeCpvqzRXptHSbSYx3acBfLM2Vd9V+WZhmbtONzThc04cjYg2J0up3CvLLzsWrc946kOI6wB7gDgwj0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",
              }}
            ></Image>
            <View
              style={{
                marginTop: 30,
                backgroundColor: "white",
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 10,
                elevation: 10,
                width: "80%",
                alignSelf: "center",
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
                  placeholder="Enter your name"
                  onChangeText={(t) => setname(t)}
                  style={{
                    flex: 1,
                    fontFamily: fonts.Roboto_500Medium,
                    color: "gray",
                    fontSize: 16,
                  }}
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
                <FontAwesome5
                  name="birthday-cake"
                  size={25}
                  color={colors.secondary}
                />
                <TextInput
                  onChangeText={(t) => setage(t)}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="Enter your age"
                  style={{
                    flex: 1,
                    fontFamily: fonts.Roboto_500Medium,
                    color: "gray",
                    fontSize: 16,
                  }}
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
                <Fontisto name="world" size={21} color={colors.secondary} />
                <TextInput
                  onChangeText={(t) => setstate(t)}
                  placeholder="Enter your state name"
                  style={{
                    flex: 1,
                    fontFamily: fonts.Roboto_500Medium,
                    color: "gray",
                    fontSize: 16,
                  }}
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
                  name="tree-city"
                  size={17}
                  color={colors.secondary}
                />
                <TextInput
                  onChangeText={(t) => setcity(t)}
                  placeholder="Enter your city name"
                  style={{
                    flex: 1,
                    fontFamily: fonts.Roboto_500Medium,
                    color: "gray",
                    fontSize: 16,
                  }}
                ></TextInput>
              </View>
            </View>

            {/* </ScrollView> */}
          </View>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "white",
              elevation: 10,
              width: "80%",
              marginTop: 20,
              borderRadius: 10,
              marginBottom: 20,
              padding: 10,
            }}
          >
            <View style={{}}>
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 14.5,
                  color: "gray",
                }}
              >
                To verify your account{" "}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 14.5,
                  color: "gray",
                }}
              >
                1. You have to submit require documents{" "}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 14.5,
                  color: "gray",
                }}
              >
                2. Link your upi to sizzle{" "}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: 90,
                borderRadius: 10,
                borderWidth: 0.5,
                marginTop: 20,
              }}
            >
              <Image
                source={{
                  uri: "data:image/png;base64,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",
                }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                  objectFit: "cover",
                }}
              ></Image>

              {imageurl && <Text>{imageurl?.uri?.slice(0, 10)}...</Text>}
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                height: 40,
                borderWidth: 0.5,
                marginTop: 15,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
                alignItems: "center",
                gap: 5,
              }}
            >
              <Image
                style={{ width: 50, height: "100%", objectFit: "contain" }}
                source={{
                  uri: "data:image/png;base64,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",
                }}
              ></Image>
              <TextInput
                placeholder="Enter your upi id"
                style={{
                  flex: 1,
                  fontFamily: fonts.Roboto_500Medium,
                  color: "gray",
                  fontSize: 16,
                }}
              ></TextInput>
            </View>
            <View
              style={{
                width: "100%",
                marginTop: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: "30%",
                  backgroundColor: colors.secondary,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.Roboto_500Medium,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "70%",
                  borderWidth: 1,
                  borderColor: colors.secondary,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
                onPress={handleSubmit}
              >
                <Text
                  style={{
                    color: colors.secondary,
                    fontFamily: fonts.Roboto_500Medium,
                  }}
                >
                  {apiCalling ? <ActivityIndicator /> : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
    // </View>
  );
};

export default BecomeDeliveryPartner;

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

export const slides = [
  {
    key: 1,
    title: "Title 1",
    text: "Description.\nSay something cool",
    backgroundColor: "#59b2ab",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ03VhAF5bk9fOl8jevVUbfzfzJw1OV3shdvA&s",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9MDoDKDkW9rU9X6wNJ7dgjnn-k7SmO3M5TQ&s",
  },
];
