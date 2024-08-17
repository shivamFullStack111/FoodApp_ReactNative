import { View, Text, Dimensions } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "./utils";

const Toaster = ({ toast, settoast, heading, message }) => {
  const sharedValue = useSharedValue(120);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: sharedValue.value }],
    };
  });

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        settoast(false);
      }, 5000);
    }
  }, [toast]);

  useEffect(() => {
    if (toast) {
      sharedValue.value = withTiming(120, { duration: 500 });
    } else {
      sharedValue.value = withTiming(0, { duration: 500 });
    }
  }, [toast]);

  return (
    <Animated.View
      style={[
        {
          width: "95%",
          height: 60,
          backgroundColor: "white",
          borderRadius: 10,
          elevation: 10,
          alignSelf: "center",
          position: "absolute",
          top: -100,
          zIndex: 50,
          flexDirection: "row",
          borderWidth: 1,
          borderColor: "#26ed8d",
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          height: "100%",
          width: 6,
          backgroundColor: "#26ed8d",
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
        }}
      ></Text>
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "700" }}>{heading}</Text>
        <Text style={{ fontWeight: "500" }}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toaster;
