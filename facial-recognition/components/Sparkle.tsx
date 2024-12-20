import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const Sparkle = ({
  size = 20,
  color = "#FFD700",
  duration = 1000,
  style = {},
}) => {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(1);

  useEffect(() => {
    // Repeat the sparkle animation
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.sparkle,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          width: size,
          height: size,
        },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill={color} />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sparkle: {
    position: "absolute",
  },
});

export default Sparkle;
