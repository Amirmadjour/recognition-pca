import React, { useEffect } from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const ScrambleText = () => {
  const originalText = "Madjour badache";
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    // Start a repeating animation
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 1000 }), // Complete in 1 second
      -1, // Infinite repeats
      true // Reverse direction on each repeat
    );
  }, []);

  // Animated style to scramble text
  const animatedStyle = useAnimatedStyle(() => {
    const scrambleIndex = Math.floor(
      interpolate(animatedValue.value, [0, 1], [0, originalText.length], Extrapolate.CLAMP)
    );

    // Generate scrambled text dynamically
    const scrambledText =
      originalText
        .split("")
        .map((char, i) =>
          i < scrambleIndex
            ? char // Original character
            : String.fromCharCode(33 + Math.random() * 94) // Random ASCII character
        )
        .join("");

    return {
      // Define styles for Text (TextStyle-compatible)
      color: "black",
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      textDecorationLine: "none",
    };
  });

  return (
    <View style={styles.container}>
      {/* Text with proper styles */}
      <Animated.Text style={[styles.text, animatedStyle]}>
        {originalText} {/* Replace with actual scrambledText if needed */}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default ScrambleText;
