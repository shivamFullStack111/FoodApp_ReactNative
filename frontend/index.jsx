import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./iflogout/Register";
import Login from "./iflogout/Login";
import IntroPage from "./components/IntroPage";
import Home from "./screens/Home";
import Location from "./screens/Location";
import SelectAddressMap from "./screens/SelectAddressMap";
import SellerShop from "./screens/SellerShop";
import CreateShop from "./screens/CreateShop";
import CreateFood from "./screens/CreateFood";
import SellerAllOrders from "./screens/SellerAllOrders";
import Cart from "./screens/Cart";
import { useSelector } from "react-redux";
import FoodDetailPage from "./screens/FoodDetailPage";
import PaymentPage from "./screens/PaymentPage";
import OrderTrackingPage from "./screens/OrderTrackingPage";
import BecomeDeliveryPartner from "./screens/BecomeDeliveryPartner";
import PartnerTab from "./screens/PartnerTab";
import CategoryOrSearchProducts from "./screens/CategoryOrSearchProducts";

const Stack = createStackNavigator();

const Index = () => {
  const [intro, setintro] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    setTimeout(() => {
      setintro(false);
    }, 2000);
  }, []);

  return (
    <NavigationContainer style={{ flex: 1 }}>
      {intro && <IntroPage />}
      {!intro && (
        <View style={{ flex: 1 }}>
          {isAuthenticated ? <IfLogin /> : <IfLogOut />}
        </View>
      )}
    </NavigationContainer>
  );
};

export default Index;

const IfLogin = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen
        name="CategoryOrSearchProducts"
        component={CategoryOrSearchProducts}
      />
      <Stack.Screen
        name="becomeDeliveryPartner"
        component={BecomeDeliveryPartner}
      />
      <Stack.Screen name="foodDetailPage" component={FoodDetailPage} />

      <Stack.Screen name="cart" component={Cart} />
      <Stack.Screen name="createFood" component={CreateFood} />
      <Stack.Screen name="createShop" component={CreateShop} />
      <Stack.Screen name="sellerorders" component={SellerAllOrders} />
      <Stack.Screen name="paymentPage" component={PaymentPage} />
      <Stack.Screen name="orderTracking" component={OrderTrackingPage} />
      <Stack.Screen
        name="location"
        options={{ presentation: "modal" }}
        component={Location}
      />
      <Stack.Screen
        name="map"
        options={{ presentation: "modal" }}
        component={SelectAddressMap}
      />

      <Stack.Screen name="shop" component={SellerShop} />
    </Stack.Navigator>
  );
};

const IfLogOut = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="login"
    >
      <Stack.Screen
        name="CategoryOrSearchProducts"
        component={CategoryOrSearchProducts}
      />
      <Stack.Screen name="foodDetailPage" component={FoodDetailPage} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="cart" component={Cart} />

      <Stack.Screen name="shop" component={SellerShop} />
      <Stack.Screen
        name="location"
        options={{ presentation: "modal" }}
        component={Location}
      />
      <Stack.Screen
        name="map"
        options={{ presentation: "modal" }}
        component={SelectAddressMap}
      />
    </Stack.Navigator>
  );
};
