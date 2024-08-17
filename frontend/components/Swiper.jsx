import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import Swiper from "react-native-swiper";
import { colors, sliderData } from "../utils";

export default SwiperSlider = () => {
  return (
    <View
      style={{
        width: "95%",
        alignSelf: "center",
        height: 260,
        marginTop: 25,
        borderRadius: 10,
      }}
    >
      <Swiper autoplay autoplayTimeout={2.4} style={{ borderRadius: 10 }}>
        {sliderData?.map((item, i) => (
          <Image
            key={i}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
            source={{ uri: item.image }}
          ></Image>
        ))}
      </Swiper>
    </View>
  );
};
