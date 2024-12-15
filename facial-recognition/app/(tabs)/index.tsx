import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ScrambleText from "@/components/ScrambleText";
import { useState, useEffect } from "react";
import axios from "axios";
import { Text } from "react-native";
import Constants from 'expo-constants';

export default function HomeScreen() {
  const [message, setMessage] = useState("");

  const movieUrl = "http://192.168.1.35:8000/api/hello/";
  const getApiUrl = () => {
    const localhost = "http://192.168.1.35:8000"; // Replace with your local IP
    if (Constants.platform?.ios) {
      return "http://localhost:8000/api/hello/"; // Works for iOS
    } else if (Constants.platform?.android) {
      return `${localhost}/api/hello/`; // Works for Android
    }
    return localhost; // Default fallback
  };

  useEffect(() => {
    console.info(movieUrl);
    fetch(movieUrl)
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the JSON response
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.info(data.message); // Assuming the data contains a 'message' key
        setMessage(data.message);
      })
      .catch((error) => console.error("Error fetching data:", error));
    console.info("ended");
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ScrambleText />
        <Text>{message}</Text>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
