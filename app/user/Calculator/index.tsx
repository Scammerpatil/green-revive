import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const fertilizers = [
  {
    name: "Nitrogen-based Fertilizer",
    baseAmount: 4,
    usage: "Boosts leaf growth",
  },
  {
    name: "Phosphorus Fertilizer",
    baseAmount: 2.5,
    usage: "Enhances root development",
  },
  {
    name: "Potassium Sulfate",
    baseAmount: 3,
    usage: "Improves disease resistance",
  },
  {
    name: "Calcium Nitrate",
    baseAmount: 1.8,
    usage: "Prevents calcium deficiency",
  },
  { name: "Organic Compost", baseAmount: 2, usage: "Enriches soil health" },
  {
    name: "Micronutrient Mix",
    baseAmount: 1.2,
    usage: "Provides essential trace elements",
  },
];

const CalculatorTab = () => {
  const [area, setArea] = useState("");
  const [selectedFertilizer, setSelectedFertilizer] = useState(fertilizers[0]);
  const [result, setResult] = useState(null);

  const calculateFertilizer = () => {
    const areaValue = parseFloat(area);
    if (isNaN(areaValue) || areaValue <= 0) {
      setResult("Please enter a valid farming area.");
      return;
    }
    const totalFertilizer = (areaValue * selectedFertilizer.baseAmount).toFixed(
      2
    );
    setResult(`${totalFertilizer} kg of ${selectedFertilizer.name} required.`);
  };

  return (
    <ScrollView className="flex-1 bg-base-100 p-5">
      <View className="bg-base-200 p-6 rounded-xl shadow-lg">
        <Text className="text-2xl font-bold text-base-content mb-4">
          Fertilizer Calculator
        </Text>
        <Text className="text-base-content/80 mb-4">
          Enter farming area (sq meters) to estimate fertilizer needs.
        </Text>

        <TextInput
          className="input input-primary input-bordered  w-full mb-4"
          keyboardType="numeric"
          placeholder="Enter area in sq meters"
          value={area}
          onChangeText={setArea}
        />

        <Text className="text-base-content font-medium mb-2">
          Select Fertilizer:
        </Text>
        <Picker
          selectedValue={selectedFertilizer.name}
          onValueChange={(itemValue) => {
            const fertilizer = fertilizers.find((f) => f.name === itemValue);
            setSelectedFertilizer(fertilizer);
          }}
          className="select select-primary w-full mb-4"
        >
          {fertilizers.map((fertilizer, index) => (
            <Picker.Item
              key={index}
              label={fertilizer.name}
              value={fertilizer.name}
            />
          ))}
        </Picker>

        <TouchableOpacity
          // className="btn btn-primary w-full"
          style={{
            backgroundColor: "#3b82f6",
            padding: 10,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={calculateFertilizer}
        >
          <Text className="text-primary-content text-center font-semibold">
            Calculate
          </Text>
        </TouchableOpacity>

        {result && (
          <Text className="mt-4 text-lg font-semibold text-base-content">
            {result}
          </Text>
        )}
      </View>

      <View className="mt-6 p-6 bg-base-100 rounded-xl shadow-lg">
        <Text className="text-xl font-bold text-base-content mb-4">
          Recommended Fertilizers
        </Text>
        {fertilizers.map((fertilizer, index) => (
          <Text key={index} className="text-base-content text-sm mb-1">
            <Text className="font-semibold">{fertilizer.name}</Text> -{" "}
            <Text className="text-base-content">{fertilizer.usage}</Text>
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default CalculatorTab;
