import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Button,
} from "react-native";
import React, { useEffect } from "react";
import { colors, fonts } from "../utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

const Dashboard_Index = () => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={{ width: "95%", alignSelf: "center" }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                alignItems: "center",
                gap: 15,
              }}
            >
              <Image
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 200,
                }}
                source={{
                  uri: user?.image,
                }}
              ></Image>
              <View>
                <Text
                  style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 17 }}
                >
                  {user?.shopname}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 13,
                    color: "gray",
                  }}
                >
                  Fast Food , Pizza , Multi Brand
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      backgroundColor: "#15b712",
                      height: 22,
                      color: "white",
                      width: 50,
                      fontSize: 12,
                      fontFamily: fonts.Roboto_500Medium,
                      borderRadius: 7,
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      paddingVertical: 2.5,
                      paddingHorizontal: 6.5,
                    }}
                  >
                    4.4⭐
                  </Text>
                  <Text style={{ fontFamily: fonts.Roboto_500Medium }}>
                    Ratings
                  </Text>
                </View>
              </View>
            </View>

            {/* shop basic details like created date  */}

            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 15,
                marginTop: 25,
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Text
                  style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16.5 }}
                >
                  Shop Name :-
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 15,
                    color: colors.secondary,
                  }}
                >
                  {user?.shopname}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Text
                  style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16.5 }}
                >
                  Phone Number :-
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 15,
                    color: colors.secondary,
                  }}
                >
                  {user?.phonenumber}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Text
                  style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16.5 }}
                >
                  Shop Address :-
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 15,
                    color: colors.secondary,
                  }}
                >
                  {user?.shopaddress?.state} ,{user?.shopaddress?.city} ,
                  {user?.shopaddress?.address}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Text
                  style={{ fontFamily: fonts.Roboto_700Bold, fontSize: 16.5 }}
                >
                  Shop Open in :-
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 15,
                    color: colors.secondary,
                  }}
                >
                  {user?.createdAt.slice(0, 10)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("sellerorders")}
              style={{
                marginTop: 15,
                width: 120,
                height: 38,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end",
                marginRight: 20,
                borderWidth: 1,
                borderColor: colors.secondary,
                elevation: 1,
                shadowColor: colors.secondary,
                padding: 2,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  width: 115,
                  height: 30,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.secondary }}>All Orders -></Text>
              </View>
            </TouchableOpacity>

            {/* cards */}

            <View
              style={{
                backgroundColor: "white",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginTop: 15,
                paddingVertical: 20,
                paddingHorizontal: 6,
                borderRadius: 7,
              }}
            >
              <Card
                title={"Total Items"}
                index={1}
                value={user?.totalfoods}
                delay={0}
              />
              <Card
                title={"Total Orders"}
                value={user?.totalorders}
                delay={0}
                index={2}
              />

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 10,
                  width: "100%",
                  marginTop: 30,
                  backgroundColor: "#35d55d",
                  paddingVertical: 12,
                  borderRadius: 14,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.Roboto_700Bold,
                    fontSize: 19,
                  }}
                >
                  Total sales in rupees
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 17,
                  }}
                >
                  ₹{user?.totalsells}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: 130,
                height: 40,
                borderRadius: 10,
                alignSelf: "flex-end",
                marginRight: 10,
                backgroundColor: colors.primary,
                marginTop: 18,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("createFood")}
            >
              <Text
                style={{ fontFamily: fonts.Roboto_700Bold, color: "white" }}
              >
                Create Item
              </Text>
            </TouchableOpacity>

            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.Roboto_700Bold,
                  marginTop: 7,
                  fontSize: 20,
                }}
              >
                All Items
              </Text>
            </View>

            <CategoryCard />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard_Index;

const Card = ({ delay, title, value, index }) => {
  const isfocus = useIsFocused();
  const sharedValue = useSharedValue(index == 1 ? -100 : 100);
  useEffect(() => {
    setTimeout(() => {
      sharedValue.value = withSpring(0, { duration: 1400 });
    }, delay);

    return () => {
      sharedValue.value = index == 1 ? -100 : 100;
    };
  }, [index, title, delay, value, isfocus]);

  const animtedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sharedValue.value }],
      opacity: sharedValue.value == -100 ? 0 : 1,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: "49%",
          height: 150,
          elevation: 4,
          shadowOffset: 0.8,
          shadowOpacity: 0.7,
          borderRadius: 10,
          padding: 3,
          shadowColor: colors.secondary,
        },
        animtedStyle,
      ]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: fonts.Roboto_900Black, fontSize: 18 }}>
          {title}
        </Text>
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: colors.secondary,
            borderRadius: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.Roboto_700Bold,
              color: "white",
              fontSize: 17,
            }}
          >
            {" "}
            {value}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const CategoryCard = () => {
  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginTop: 20,
      }}
    >
      {/* heading */}
      {/* <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: fonts.Roboto_700Bold,
            fontSize: 19,
            color: "#3e3b3b",
          }}
        >
          Chinese
        </Text>
        <AntDesign
          name="caretup"
          size={18}
          color={colors.secondary}
          style={{ marginRight: 8 }}
        />
      </View> */}

      <RenderUserItems></RenderUserItems>
    </View>
  );
};

const RenderUserItems = () => {
  const { allFoodsOfSeller } = useSelector((state) => state.user);

  return (
    <View>
      {allFoodsOfSeller &&
        allFoodsOfSeller?.map((food, i) => (
          <View key={i}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 14,
              }}
            >
              <View style={{ width: "65%" }}>
                <Image
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgp-jOWD-q7Xdm-H9hMUsMA4zJvMwgpF756Q&s",
                  }}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 16,
                    marginTop: 3,
                  }}
                >
                  {food?.name}
                </Text>
                <View style={{ flexDirection: "row", gap: 15, marginTop: 3 }}>
                  <Text>⭐⭐⭐⭐⭐</Text>
                  <Text
                    style={{
                      fontFamily: fonts.Roboto_500Medium,
                      fontSize: 13.5,
                    }}
                  >
                    {food?.ratings ? food?.ratings + " ratings" : "382 ratings"}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: fonts.Roboto_500Medium,
                    fontSize: 15,
                    marginTop: 3,
                  }}
                >
                  ${food?.price}{" "}
                </Text>
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 13,
                    color: "gray",
                  }}
                >
                  {food?.description}
                </Text>
              </View>

              <View
                style={{
                  width: "35%",
                  // justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Image
                  style={{
                    width: 110,
                    height: 110,
                    objectFit: "cover",
                    borderRadius: 15,
                  }}
                  source={{
                    uri: food?.images[0],
                  }}
                ></Image>
              </View>
            </View>
            <Text
              style={{
                width: "95%",
                borderBottomWidth: 1,
                borderStyle: "dashed",
                borderColor: "gray",
                alignSelf: "center",
                marginVertical: 8,
              }}
            ></Text>
          </View>
        ))}
    </View>
  );
};
