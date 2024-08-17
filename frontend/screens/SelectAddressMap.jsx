import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Share,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  backendUrl,
  colors,
  fonts,
  getUserLocationUsingLonLat,
} from "../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animation, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../shop/slices/userSlice";

const SelectAddressMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [manualAddress, setmanualAddress] = useState(false);
  const [AddressMoreDetailOpen, setAddressMoreDetailOpen] = useState(false);
  const navigation = useNavigation();
  const [apiLoading, setapiLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [address, setaddress] = useState({
    latitude: "",
    longitude: "",
    houseno: "",
    nearby: "",
    area: "",
  });
  const dispatch = useDispatch();

  const handleStoreUserAddress = async () => {
    try {
      setapiLoading(true);
      const { latitude, area, houseno, longitude, nearby } = address;
      if (!latitude || !area || !houseno || !longitude) {
        setapiLoading(false);
        return alert("please fill all address detail");
      }

      const tkn = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `${backendUrl}update-user-address`,
        address,
        { headers: { Authorization: tkn } }
      );

      if (res.data.success) {
        dispatch(setUser({ ...user, address: res?.data?.address }));
      }
      setapiLoading(false);
    } catch (error) {
      console.log(error.message);
      setapiLoading(false);
    }
  };

  // useEffect(() => {
  //   getLocation();
  // }, []);

  // useEffect(() => {
  //   if (location) {
  //     getUserLocationUsingLonLat({
  //       longitude: location?.coords?.longitude,
  //       latitude: location?.coords?.latitude,
  //     });
  //   }
  // }, [location]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setaddress((prev) => ({
      ...prev,
      longitude: location?.coords?.longitude,
      latitude: location?.coords?.latitude,
    }));

    // const addressess ={
    //   longitude: location?.coords?.longitude,
    //   latitude: location?.coords?.latitude,
    //   primary:true,

    // }

    //  const adreses = await AsyncStorage.getItem('addressess')
    //  const adrs = JSON.stringify(adreses)||[]

    // await AsyncStorage.setItem("addressess");
    setLocation(location);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 10,
            marginBottom: 15,
            position: "absolute",
            top: 5,
            zIndex: 50,
          }}
        >
          <Entypo
            onPress={() => navigation.goBack()}
            name="chevron-left"
            size={24}
            color="white"
            style={{ backgroundColor: "black", borderRadius: 20, padding: 3 }}
          />
          <Text
            style={{
              fontFamily: fonts.Roboto_500Medium,
              fontSize: 23,
              color: "black",
            }}
          >
            Confirm delivery location
          </Text>
        </View>
        {location ? (
          <View style={{ flex: 1 }}>
            <MapView
              mapType="terrain"
              region={{
                longitude: location?.coords?.longitude,
                latitude: location?.coords?.latitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0,
              }}
              style={{ flex: 1 }}
            >
              <Marker
                coordinate={{
                  latitude: location?.coords?.latitude,
                  longitude: location?.coords?.longitude,
                }}
              />
            </MapView>

            <View
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.secondary,
                  position: "absolute",
                  bottom: 70,
                  height: 45,
                  borderRadius: 8,
                  alignSelf: "center",
                }}
                onPress={() => {
                  handleStoreUserAddress();
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 18,
                  }}
                >
                  {apiLoading ? <ActivityIndicator /> : "Confirm"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.secondary,
                  position: "absolute",
                  bottom: 15,
                  height: 45,
                  borderRadius: 8,
                  alignSelf: "center",
                }}
                onPress={() => {
                  // Handle confirm button press
                  setAddressMoreDetailOpen(true);
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 17,
                  }}
                >
                  Add more address details
                </Text>
              </TouchableOpacity>

              {AddressMoreDetailOpen && (
                <AddressMoreDetail
                  setAddressMoreDetailOpen={setAddressMoreDetailOpen}
                  setmanualAddress={setmanualAddress}
                  manualAddress={manualAddress}
                  address={address}
                  setaddress={setaddress}
                />
              )}
            </View>
          </View>
        ) : (
          <MapView
            region={{
              longitude: location?.coords?.longitude,
              latitude: location?.coords?.latitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0,
            }}
            style={{ flex: 1 }}
          ></MapView>
        )}
        {/* {manualAddress && AddressMoreDetailOpen && (
          <AddressMoreDetail
            setAddressMoreDetailOpen={setAddressMoreDetailOpen}
            setmanualAddress={setmanualAddress}
            manualAddress={manualAddress}
          />
        )} */}

        {!location && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.secondary,
                height: 45,
                borderRadius: 8,
                alignSelf: "center",
              }}
              onPress={() => {
                getLocation();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 18,
                }}
              >
                Use current location
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                marginBottom: 30,
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.secondary,
                position: "absolute",
                bottom: 20,
                height: 45,
                borderRadius: 8,
                alignSelf: "center",
              }}
              onPress={() => {
                setmanualAddress(true);
                setAddressMoreDetailOpen(true);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: fonts.Roboto_500Medium,
                  fontSize: 18,
                }}
              >
                Add address manually
              </Text>
            </TouchableOpacity> */}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SelectAddressMap;

const AddressMoreDetail = ({
  setAddressMoreDetailOpen,
  setmanualAddress,
  manualAddress,
  address,
  setaddress,
}) => {
  const SharedValue = useSharedValue(0);
  const [focus, setFocus] = useState(0);

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: SharedValue.value !== 0 ? 1 : 0,
      transform: [{ translateY: SharedValue.value !== 0 ? -12 : 0 }],
    };
  });

  useEffect(() => {}, []);

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        backgroundColor: "#00000055",
        bottom: 0,
        left: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        justifyContent: "flex-end",
        zIndex: 40,
      }}
    >
      <Entypo
        name="circle-with-cross"
        size={34}
        style={{ alignSelf: "center", marginBottom: 20 }}
        color="white"
        onPress={() => {
          setAddressMoreDetailOpen(false), setmanualAddress(false);
        }}
      />
      <View
        style={{
          height: manualAddress ? 490 : 380,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <Text style={{ fontFamily: "Roboto_700Bold", fontSize: 17 }}>
          Enter complete address
        </Text>
        {/* address type */}
        <Text
          style={{
            fontFamily: "Roboto_700Bold",
            color: "gray",
            marginTop: 12,
          }}
        >
          Save address as
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginTop: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setaddress((prev) => ({ ...prev, type: "home" }));
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderWidth: 0.6,
              borderRadius: 10,
              borderColor: address.type == "home" ? colors.secondary : "black",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_500Medium",
                color: address.type == "home" ? colors.secondary : "black",
              }}
            >
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setaddress((prev) => ({ ...prev, type: "work" }));
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderWidth: 0.6,
              borderRadius: 10,

              borderColor: address.type == "work" ? colors.secondary : "black",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_500Medium",
                color: address.type == "work" ? colors.secondary : "black",
              }}
            >
              Work
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setaddress((prev) => ({ ...prev, type: "hotel" }));
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderWidth: 0.6,
              borderColor: "secondary",
              borderRadius: 10,

              borderColor: address.type == "hotel" ? colors.secondary : "black",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_500Medium",
                color: address.type == "hotel" ? colors.secondary : "black",
              }}
            >
              Hotel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setaddress((prev) => ({ ...prev, type: "other" }));
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderWidth: 0.6,
              borderRadius: 10,

              borderColor: address.type == "other" ? colors.secondary : "black",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_500Medium",
                color: address.type == "other" ? colors.secondary : "black",
              }}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>
        {/* inputs */}
        {/* {manualAddress && (
          <View>
            {" "}
            <View
              style={{
                paddingHorizontal: 8,
                marginTop: 20,
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 10,
                height: 40,
              }}
            >
              <Animation.Text
                style={[
                  animationStyle,
                  {
                    height: focus === 3 ? 20 : 0,
                    backgroundColor: "white",
                    position: "absolute",
                    marginLeft: 10,
                    color: colors.secondary,
                  },
                ]}
              >
                Area / Sector / Locality
              </Animation.Text>
              <TextInput
                onFocus={() => {
                  SharedValue.value = withTiming(3, { duration: 300 });
                  setFocus(3);
                }}
                onBlur={() => {
                  SharedValue.value = withTiming(0, { duration: 300 });
                  setFocus(0);
                }}
                placeholder={focus !== 3 ? "Area / Sector / Locality" : ""}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                marginTop: 20,
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 10,
                height: 40,
              }}
            >
              <Animation.Text
                style={[
                  animationStyle,
                  {
                    height: focus === 3 ? 20 : 0,
                    backgroundColor: "white",
                    position: "absolute",
                    marginLeft: 10,
                    color: colors.secondary,
                  },
                ]}
              >
                Area / Sector / Locality
              </Animation.Text>
              <TextInput
                onFocus={() => {
                  SharedValue.value = withTiming(3, { duration: 300 });
                  setFocus(3);
                }}
                onBlur={() => {
                  SharedValue.value = withTiming(0, { duration: 300 });
                  setFocus(0);
                }}
                placeholder={focus !== 3 ? "Area / Sector / Locality" : ""}
              />
            </View>
          </View>
        )} */}

        <View
          style={{
            paddingHorizontal: 8,
            marginTop: 20,
            borderWidth: 1,
            paddingVertical: 5,
            borderRadius: 10,
            height: 40,
          }}
        >
          <Animation.Text
            style={[
              animationStyle,
              {
                height: focus === 1 || address?.houseno ? 20 : 0,
                backgroundColor: "white",
                position: "absolute",
                marginLeft: 10,
                color: colors.secondary,
              },
            ]}
          >
            Flat / House no / Floor / Building
          </Animation.Text>
          <TextInput
            onFocus={() => {
              SharedValue.value = withTiming(1, { duration: 300 });
              setFocus(1);
            }}
            onBlur={() => {
              SharedValue.value = withTiming(0, { duration: 300 });
              setFocus(0);
            }}
            onChangeText={(t) => {
              setaddress((prev) => ({ ...prev, houseno: t }));
            }}
            placeholder={
              focus !== 1 ? "Flat / House no / Floor / Building *" : ""
            }
            value={address?.houseno}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            marginTop: 20,
            borderWidth: 1,
            paddingVertical: 5,
            borderRadius: 10,
            height: 40,
          }}
        >
          <Animation.Text
            style={[
              animationStyle,
              {
                height: focus === 2 || address?.nearby ? 20 : 0,
                backgroundColor: "white",
                position: "absolute",
                marginLeft: 10,
                color: colors.secondary,
              },
            ]}
          >
            Nearby landmark
          </Animation.Text>
          <TextInput
            onFocus={() => {
              SharedValue.value = withTiming(2, { duration: 300 });
              setFocus(2);
            }}
            value={address?.nearby}
            onChangeText={(t) => {
              setaddress((prev) => ({ ...prev, nearby: t }));
            }}
            onBlur={() => {
              SharedValue.value = withTiming(0, { duration: 300 });
              setFocus(0);
            }}
            placeholder={focus !== 2 ? "Nearby landmark (optional)" : ""}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            marginTop: 20,
            borderWidth: 1,
            paddingVertical: 5,
            borderRadius: 10,
            height: 40,
          }}
        >
          <Animation.Text
            style={[
              animationStyle,
              {
                height: focus === 3 || address?.area ? 20 : 0,
                backgroundColor: "white",
                position: "absolute",
                marginLeft: 10,
                color: colors.secondary,
              },
            ]}
          >
            Area / Sector / Locality
          </Animation.Text>
          <TextInput
            onFocus={() => {
              SharedValue.value = withTiming(3, { duration: 300 });
              setFocus(3);
            }}
            value={address?.area}
            onChangeText={(t) => {
              setaddress((prev) => ({ ...prev, area: t }));
            }}
            onBlur={() => {
              SharedValue.value = withTiming(0, { duration: 300 });
              setFocus(0);
            }}
            placeholder={focus !== 3 ? "Area / Sector / Locality" : ""}
          />
        </View>

        <TouchableOpacity
          style={{
            width: "100%",
            alignSelf: "center",
            height: 46,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.secondary,
            marginTop: 20,
            borderRadius: 10,
          }}
          onPress={() => {
            setAddressMoreDetailOpen(false);
          }}
        >
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold,
              color: "white",
              fontSize: 16,
            }}
          >
            Save address
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
