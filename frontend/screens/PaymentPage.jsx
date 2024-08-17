import {
  View,
  KeyboardAvoidingView,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, fonts } from "../utils";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

const PaymentPage = () => {
  const [successing, setsuccessing] = useState(true);
  const { order } = useRoute().params;
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SuccessSlider setsuccessing={setsuccessing} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentPage;

const SuccessSlider = ({ setsuccessing }) => {
  const sharedValue = useSharedValue(0);
  const windowWidth = Dimensions.get("window").width; // Get the window width
  const isFocused = useIsFocused();
  const [animationEnd, setanimationEnd] = useState(false);
  const navigation = useNavigation();
  const { order } = useRoute().params;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setanimationEnd(true);
    }, 1800);

    return () => {
      clearTimeout(timeOut);
    };
  }, [isFocused]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      sharedValue.value = withTiming(1, { duration: 700 });
    }, 1000);

    return () => clearTimeout(timeOut); // Clear the timeout on unmount
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: sharedValue.value * (windowWidth * 0.69), // Use the window width
        },
      ],
    };
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "86%",
          height: 45,
          backgroundColor: colors.secondary,
          alignItems: "center",
          borderRadius: 10,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            position: "absolute",
            alignSelf: "center",
            left: "33%",
            color: "white",
            fontFamily: fonts.Roboto_700Bold,
            fontSize: 17,
          }}
        >
          {animationEnd && " Order placed"}
        </Text>
        <Animated.View
          style={[
            {
              width: 60,
              height: 40,
              borderRadius: 10,
              backgroundColor: "white",
              margin: 3,
              justifyContent: "center",
              alignItems: "center",
            },
            animatedStyle,
          ]}
        >
          <View>
            <AntDesign
              onPress={() => {
                setsuccessing(false),
                  navigation.navigate("orderTracking", {
                    order,
                    sellerEmail: order?.seller,
                  });
              }}
              name="arrowright"
              size={27}
              color={colors.secondary}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};
