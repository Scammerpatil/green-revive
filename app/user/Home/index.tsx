import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";

const HomeTab = () => {
  const [selectedLeaf, setSelectedLeaf] = useState("banana");
  const [previewImage, setPreviewImage] = useState(null);
  const [predictionData, setPredictionData] = useState<any>(null);

  const handleCapture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0]?.base64!);
    }
  };

  const handleGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPreviewImage(result?.assets[0].base64!);
    }
  };

  const handleUpload = async () => {
    if (!previewImage) {
      Alert.alert("No Image Selected", "Please select an image first.");
      return;
    }
    try {
      const response = await axios.postForm(
        "http://localhost:8081/api/detect",
        {
          leafType: selectedLeaf,
          image: previewImage,
        }
      );
      if (response.status === 200) {
        setPredictionData(response.data);
      }
    } catch (error) {
      setPredictionData(null);
      console.error("Error uploading image:", error.message);
      Alert.alert(
        "Upload Failed",
        "An error occurred while uploading the image."
      );
    }
  };

  return (
    <ScrollView className="bg-base-100 flex-1 p-4">
      <Text className="text-lg text-center font-semibold text-base-content mb-2">
        Select Leaf Type
      </Text>
      <View className="bg-base-200 rounded-lg mb-4">
        <Picker
          selectedValue={selectedLeaf}
          onValueChange={(itemValue) => setSelectedLeaf(itemValue)}
          className="select select-primary select-bordered w-full mx-auto"
          style={{
            borderColor: "#ccc",
          }}
        >
          <Picker.Item label="Banana Leaf" value="banana" />
          <Picker.Item label="Coffee Leaf" value="coffee" />
        </Picker>
      </View>

      <Image
        source={
          previewImage
            ? { uri: "data:image/jpeg;base64," + previewImage }
            : require("../../../assets/images/preview.png")
        }
        className="w-48 h-48 rounded-lg mb-4 mx-auto"
      />

      <View
        className="flex-row space-x-4"
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleCapture}
          style={{
            backgroundColor: "#3b82f6",
            padding: 10,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="camera" size={20} className="mr-2" color={"white"} />
          <Text className="font-semibold text-white">Capture</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGallery}
          style={{
            backgroundColor: "#4ade80",
            padding: 10,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AntDesign name="picture" size={20} className="mr-2" />
          <Text className="font-semibold">Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#3b82f6",
          padding: 10,
          borderRadius: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
        onPress={() => {
          handleUpload();
        }}
      >
        <AntDesign name="upload" size={20} className="mr-2" color={"white"} />
        <Text className="font-semibold text-white">Upload</Text>
      </TouchableOpacity>

      {predictionData && (
        <View className="mt-6 p-4 bg-base-200 rounded-lg shadow-md">
          <Text className="text-lg font-semibold text-base-content capitalize">
            Prediction: {predictionData.prediction.predicted_label}
          </Text>
          <Text className="text-base-content">
            Confidence: {predictionData.prediction.confidence.toFixed(2)}%
          </Text>
          <Text className="mt-2 font-semibold">Recommended Fertilizers:</Text>
          {predictionData.fertilizers.map(
            (fertilizer: string, index: number) => (
              <Text key={index} className="text-base-content">
                - {fertilizer}
              </Text>
            )
          )}
          <Text className="mt-2 font-semibold">Recommended Remedies:</Text>
          {predictionData.remedies.map((remedy: string, index: number) => (
            <Text key={index} className="text-base-content">
              - {remedy}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HomeTab;
