import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { colors, fonts } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";

const Location = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: "row", paddingHorizontal: 20, gap: 10 }}
      >
        <Entypo name="chevron-down" size={24} color="black" />
        <Text style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 20 }}>
          Select a location
        </Text>
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          width: "90%",

          alignSelf: "center",
          marginTop: 30,
          backgroundColor: "white",
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderRadius: 8,
          borderBottomEndRadius: 0,
          borderBottomStartRadius: 0,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <FontAwesome6
            name="location-crosshairs"
            size={24}
            color={colors.secondary}
          />
          <View>
            <Text
              style={{
                color: colors.secondary,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Use Your Current Location
            </Text>
            <Text>Surya Enclave,Jalandhar</Text>
          </View>
        </View>
        <Entypo name="chevron-right" size={24} color="black" />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("map")}
        style={{
          flexDirection: "row",
          width: "90%",
          borderTopWidth: 1,
          borderColor: "#cdd0d3",
          alignSelf: "center",
          backgroundColor: "white",
          paddingVertical: 15,
          paddingHorizontal: 10,
          gap: 10,
          borderBottomEndRadius: 8,
          borderBottomStartRadius: 8,
        }}
      >
        <FontAwesome6 name="add" size={20} color={colors.secondary} />
        <Text style={{ color: colors.secondary, fontWeight: 600 }}>
          Add Address
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Location;
