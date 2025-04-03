import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "../style.css";

const WelcomePage = () => {
  const router = useRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-base-100 justify-between items-center p-6"
      data-theme="forest"
    >
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../assets/images/bg.png")}
          className="w-32 h-32 mb-6"
          style={{ width: 200, height: 200 }}
        />
        <Text className="text-3xl font-bold text-base-content mb-4 text-center uppercase">
          Welcome to GreenRevive
        </Text>
        <Text className="text-base text-base-content/50 text-center mb-6">
          Detect nutrients loss in Banana and Coffee leaves using AI-powered
          analysis.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#4CAF50",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
            marginBottom: 10,
          }}
          onPress={() => {
            router.push("/user/Home");
          }}
        >
          <Text className="font-semibold text-success-content">
            Let's Get Started
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Container */}
      <View className="w-full py-4 bg-base-200 items-center">
        <Text className="text-sm text-base-content/50 text-center">
          By signing up, you agree to our{" "}
          <Text className="font-bold link">Terms of Service</Text> and
          <Text className="font-bold link"> Privacy Policy</Text>
        </Text>
        <Text className="text-sm text-base-content/50 text-center mt-6">
          © 2023 GreenRevive. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default WelcomePage;
