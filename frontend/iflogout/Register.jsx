import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { backendUrl, colors, fonts } from "../utils";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setIsAuthenticated,
  setIsSeller,
  setUser,
} from "../shop/slices/userSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const navigation = useNavigation();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      if ((!name, !email, !password)) alert("all fields are required");
      const res = await axios.post(`${backendUrl}register`, {
        name,
        email,
        password,
      });

      if (res.data.success) {
        await AsyncStorage.setItem("token", JSON.stringify(res.data.token));

        dispatch(setUser(res?.data?.user));
        dispatch(setIsAuthenticated(true));
        dispatch(setIsSeller(res.data?.user?.isseller));
      }
      alert(res.data.message);
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={styles.logo}
        source={{
          uri: "https://i.pinimg.com/originals/f5/b3/d5/f5b3d5f92b3e330dd3bd787c1cf91aa3.jpg",
        }}
      ></Image>
      {/* //heading */}
      <View style={{ alignSelf: "center", padding: 20, alignItems: "center" }}>
        <Text
          style={{
            fontFamily: fonts.Roboto_700Bold_Italic,
            fontSize: 24,
            flexDirection: "row",
          }}
        >
          Tasty <Text style={{ color: colors.secondary }}>Indian</Text> Spice
        </Text>
        <Text
          style={{
            fontFamily: fonts.Roboto_700Bold,
            fontSize: 21,
            flexDirection: "row",
          }}
        >
          Sizzle <Text style={{ color: "#edd309" }}>Premium</Text> Taste
        </Text>
      </View>
      {/* login or signup */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 6,
        }}
      >
        <View
          style={{
            width: "80%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              flex: 1,
              borderBottomWidth: 0.2,
              height: 1,
            }}
          ></Text>
          <Text
            style={{ fontSize: 13, color: "#4c4c49", paddingHorizontal: 10 }}
          >
            Log in
          </Text>
          <Text style={{ flex: 1, borderBottomWidth: 0.2, height: 1 }}></Text>
        </View>
      </View>
      {/* email and password */}
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          paddingHorizontal: "14%",
          marginTop: "5%",
          gap: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              padding: 4,
              paddingHorizontal: 14,
              borderWidth: 0.4,
              borderRadius: 6,
            }}
          >
            <FontAwesome name="user" size={23} color={colors.secondary} />
          </View>
          <View style={{ flex: 1, borderWidth: 0.4, borderRadius: 6 }}>
            <TextInput
              onChangeText={(t) => setname(t)}
              placeholder="Enter your name..."
              style={{ fontSize: 13, padding: 3 }}
            ></TextInput>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              padding: 4,
              paddingHorizontal: 10,
              borderWidth: 0.4,
              borderRadius: 6,
            }}
          >
            <MaterialIcons name="email" size={23} color={colors.secondary} />
          </View>
          <View style={{ flex: 1, borderWidth: 0.4, borderRadius: 6 }}>
            <TextInput
              onChangeText={(t) => setemail(t)}
              placeholder="Enter your email..."
              style={{ fontSize: 13, padding: 3 }}
            ></TextInput>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              padding: 4,
              paddingHorizontal: 10,
              borderWidth: 0.4,
              borderRadius: 6,
            }}
          >
            <MaterialIcons name="password" size={23} color={colors.secondary} />
          </View>
          <View style={{ flex: 1, borderWidth: 0.4, borderRadius: 6 }}>
            <TextInput
              secureTextEntry
              onChangeText={(t) => setpassword(t)}
              placeholder="Enter your password..."
              style={{ fontSize: 13, padding: 3 }}
            ></TextInput>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          alignSelf: "center",
          marginTop: 25,
          backgroundColor: colors.secondary,
          width: "73%",
          height: 42,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 7,
        }}
        onPress={() => handleSubmit()}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Continue</Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 20,
          alignSelf: "center",
          fontFamily: fonts.Roboto_500Medium,
        }}
      >
        already registered?{" "}
        <Text
          onPress={() => navigation.navigate("login")}
          style={{ color: "#60a5e1", fontWeight: "600" }}
        >
          Login
        </Text>
      </Text>
      <TouchableOpacity
        style={{
          position: "absolute",
          width: 70,
          height: 30,
          backgroundColor: colors.secondary,
          top: 10,
          right: 15,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={() => navigation.navigate("home")}
      >
        <Text style={{ color: "white", fontFamily: fonts.Roboto_700Bold }}>
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: "45%",
  },
});
