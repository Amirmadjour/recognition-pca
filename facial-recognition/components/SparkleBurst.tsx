import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Sparkle from "./Sparkle"; // Reuse the Sparkle component

interface SparkleBurstProps {
  count?: number; // Number of sparkles
  height?: number;
  width?: number;
}

const SparkleBurst: React.FC<SparkleBurstProps> = ({
  height = 50,
  width = 50,
  count = 50,
}) => {
  const sparkles = Array.from({ length: count }); // Create an array with the specified count

  return (
    <View style={styles.container}>
      {sparkles.map((_, index) => (
        <Sparkle
          key={index}
          size={Math.random() * 20 + 10} // Random sizes between 10 and 30
          color={`hsl(${Math.random() * 360}, 100%, 50%)`} // Random colors
          duration={Math.random() * 5000 + 500} // Random animation duration between 500ms and 1500ms
          style={{
            position: "absolute",
            top: Math.random() * height, // Random Y position
            left: Math.random() * width, // Random X position
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Fill the parent container
    zIndex: 10, // Keep the sparkles above other elements
    pointerEvents: "none", // Ensure sparkles don't block touches
  },
});

export default SparkleBurst;
