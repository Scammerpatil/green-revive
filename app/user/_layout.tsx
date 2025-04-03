import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { View, Text } from "react-native";

import HomeTab from "./Home";
import CalculatorTab from "./Calculator";

const Tab = createBottomTabNavigator();

const UserLayout = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Calculator") {
            iconName = "calculator";
          }
          return (
            <AntDesign
              name={iconName}
              size={size}
              color={focused ? "#16A34A" : "#737373"}
              style={{
                backgroundColor: focused ? "#D1FAE5" : "transparent",
                borderRadius: 10,
              }}
            />
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text
            className={`text-xs ${
              focused ? "text-white font-bold" : "text-white"
            }`}
          >
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: "#15191e",
          height: 80,
          paddingBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarActiveTintColor: "#16A34A",
        tabBarInactiveTintColor: "#737373",
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Calculator" component={CalculatorTab} />
    </Tab.Navigator>
  );
};

export default UserLayout;
