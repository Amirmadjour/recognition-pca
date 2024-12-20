import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { captureRef } from "react-native-view-shot";
import { Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "@/hooks/axios";
import Button from "./Button";
import CheckIcon from "@/assets/icons/CheckIcon.svg";
import EraseIcon from "@/assets/icons/EraseIcon.svg";
import LikeIcon from "@/assets/icons/LikeIcon.svg";
import LikeIconActive from "@/assets/icons/LikeIconActive.svg";
import OneDigitIcon from "@/assets/icons/OneDigitIcon.svg";
import Sparkle from "./Sparkle";
import SparkleBurst from "./SparkleBurst";

const { height, width } = Dimensions.get("window");
const svg_dim = width * 0.9;

export default () => {
  const [paths, setPaths] = useState<any>([]);
  const [currentPath, setCurrentPath] = useState<any>([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);
  const svgContainerRef = useRef(null);
  const [imageUri, setImageUri] = useState<any>(null);
  const [result, setResult] = useState<string>("Nothing");
  const [loading, setLoading] = useState<boolean>(false); // State for loading
  const [liked, setLiked] = useState<boolean>(false);

  const handleSubmitButtonClick = async () => {
    setLoading(true);
    try {
      // Capture the SVG container as an image
      const uri = await captureRef(svgContainerRef, {
        format: "png",
        quality: 1,
      });
      setImageUri(uri); // Save URI to state

      // Resize the image to 28x28 pixels
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 28, height: 28 } }],
        { base64: true } // Get the base64 representation
      );

      // Extract the pixel matrix (optional, depends on your use case)
      const base64Image = resizedImage.base64;
      console.info("28x28 Image Base64:", base64Image);

      axios
        .post("pca_digits/", { image: base64Image })
        .then((res) => {
          setResult(res.data.message);
          console.info(res.data.message);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error while posting image: ", err);
          setLoading(false);
        });
      // Pass the base64 or pixel matrix to your backend or further processing
    } catch (error) {
      console.error("Error capturing drawing:", error);
    }
  };

  const onTouchEnd = () => {
    paths.push(currentPath);
    setCurrentPath([]);
    setClearButtonClicked(false);
  };

  const onTouchMove = (event: any) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(
      0
    )},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath([]);
    setClearButtonClicked(true);
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <View className="w-full h-full flex flex-col items-center justify-start px-2.5 py-4 gap-5">
      <View className="flex flex-row items-center justify-between gap-3 w-full h-fit">
        <Button onPress={handleClearButtonClick}>
          <EraseIcon />
        </Button>
        <Button onPress={handleSubmitButtonClick} isLoading={loading}>
          <CheckIcon />
        </Button>
      </View>
      <View className="flex flex-col min-w-full h-fit gap-1 items-start justify-center">
        <Text className="font-semibold text-2xl">Handwritten Digits</Text>
        <Text className="text-base">
          Draw one digit on the middle of the screen
        </Text>
      </View>
      <View
        style={styles.svgContainer}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="bg-white rounded-2xl"
      >
        <Svg
          ref={svgContainerRef}
          height={svg_dim}
          width={svg_dim}
          className="rounded-2xl"
        >
          {paths.length == 0 && currentPath.length == 0 && <OneDigitIcon />}
          <Path
            d={paths.join("")}
            stroke={"gray"}
            fill={"transparent"}
            strokeWidth={30}
            strokeLinejoin={"round"}
            strokeLinecap={"round"}
          />
          <Path
            d={currentPath.join("")}
            stroke={"gray"}
            fill={"transparent"}
            strokeWidth={25}
            strokeLinejoin={"round"}
            strokeLinecap={"round"}
          />
        </Svg>
      </View>
      <View className="min-w-full h-20 bg-[#27AF84E6] rounded-full flex flex-row items-center justify-between p-[5px]">
        <View className="w-fit h-full flex items-center justify-center px-6 bg-[#FFFFFF1C] rounded-full">
          <Text className="text-white text-base font-medium">
            Predicted input: {result}
          </Text>
        </View>
        <Button onPress={handleLike} classNameStyle="bg-transparent">
          {!liked ? <LikeIcon /> : <LikeIconActive />}
        </Button>
      </View>
      {/*loading && (
        <ActivityIndicator
          size="large"
          color="blue"
          style={styles.loadingIndicator}
        />
      )*/}
      {/*imageUri && (
          <>
            <Image
              source={{ uri: imageUri }}
              style={styles.capturedImage}
              resizeMode="contain"
            />
          </>
        )*/}
      {/*<Text className="text-4xl bg-black/10 py-2 px-2 rounded-md font-medium">
        You have entered: {result}
      </Text>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  svgContainer: {
    height: svg_dim,
    width: svg_dim,
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  capturedImage: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderColor: "black",
    borderWidth: 1,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
