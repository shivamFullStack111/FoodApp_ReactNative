import { View, Text } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import History from "./DeliveryPartnerTabs/History";
import { colors, fonts } from "../utils";
import AcceptedOrders from "./DeliveryPartnerTabs/AcceptedOrders";
import OrdersNearByDeliveryPartner from "./DeliveryPartnerTabs/OrdersNearByDeliveryPartner";

const Tab = createMaterialTopTabNavigator();

const PartnerTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarStyle: {
            borderColor: "black",
          },
          tabBarActiveTintColor: colors.secondary,
          tabBarLabelStyle: {
            fontFamily: fonts.Roboto_700Bold,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.secondary,
          },
          tabBarInactiveTintColor: "gray",
        }}
        name="Orders"
        component={OrdersNearByDeliveryPartner}
      />
      <Tab.Screen
        options={{
          tabBarStyle: {
            borderColor: "black",
          },
          tabBarActiveTintColor: colors.secondary,
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontFamily: fonts.Roboto_700Bold,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.secondary,
          },
        }}
        name="Live Order"
        component={AcceptedOrders}
      />
      <Tab.Screen
        options={{
          tabBarStyle: {
            borderColor: "black",
          },
          tabBarActiveTintColor: colors.secondary,
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontFamily: fonts.Roboto_700Bold,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.secondary,
          },
        }}
        name="history"
        component={History}
      />
    </Tab.Navigator>
  );
};

export default PartnerTab;
