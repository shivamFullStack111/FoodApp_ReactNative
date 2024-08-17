import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  useSharedValue,
  withRepeat,
  Easing,
  withTiming,
} from "react-native-reanimated";
import { fonts } from "../utils";

export default TypingEffect = ({ text, speed = 300, pause = 1000 }) => {
  const [displayText, setDisplayText] = useState("");
  const animatedIndex = useSharedValue(0);
  const direction = useSharedValue(1); // 1 for typing, -1 for erasing

  useEffect(() => {
    animatedIndex.value = withRepeat(
      withTiming(text.length, {
        duration: text.length * speed,
        easing: Easing.linear,
      }),
      -1,
      false,
      (finished, current) => {
        if (direction.value === 1 && current === text.length) {
          direction.value = -1;
          setTimeout(() => {
            animatedIndex.value = withTiming(0, {
              duration: text.length * speed,
              easing: Easing.linear,
            });
          }, pause);
        } else if (direction.value === -1 && current === 0) {
          direction.value = 1;
          setTimeout(() => {
            animatedIndex.value = withTiming(text.length, {
              duration: text.length * speed,
              easing: Easing.linear,
            });
          }, pause);
        }
      }
    );

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, Math.ceil(animatedIndex.value)));
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, pause, animatedIndex, direction]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{displayText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: fonts.Roboto_700Bold,
    fontSize: 24,
  },
});
