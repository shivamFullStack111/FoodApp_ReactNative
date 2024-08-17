import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { colors } from "../utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CartCircle = () => {
  const sharedValue = useSharedValue(0);
  const navigation = useNavigation();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: sharedValue.value }],
    };
  });

  useEffect(() => {
    sharedValue.value = withRepeat(
      withTiming(-20, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 70,
          height: 70,
          position: "absolute",
          bottom: 0,
          right: 30,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.secondary,
          zIndex: 50,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: "white",
        },
      ]}
    >
      <Text style={{ color: "white" }}>
        <Ionicons
          onPress={() => navigation.navigate("cart")}
          name="fast-food-outline"
          size={30}
          color="white"
        />
      </Text>
    </Animated.View>
  );
};

export default CartCircle;
