import { View, Text, Dimensions } from "react-native";
import React from "react";

const OrderTakeByPartner = () => {
  const { width, height } = Dimensions.get("screen");
  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "black",
        width,
        height,
        top: -300,
        left: 0,
        zIndex: 100,
      }}
    >
      <Text>OrderTakeByPartner</Text>
    </View>
  );
};

export default OrderTakeByPartner;
