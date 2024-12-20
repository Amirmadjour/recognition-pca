import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import clsx from "clsx";

interface ButtonProps {
  onPress: () => void; // Function to handle button press
  classNameStyle?: string; // Tailwind classes for the button container
  isLoading?: boolean; // Loading state
  disabled?: boolean; // Disabled state
  children?: React.ReactNode; // Custom components passed to the button
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  classNameStyle = "",
  isLoading = false,
  disabled = false,
  children,
}) => {
  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={clsx("p-6 bg-white/80 rounded-full w-fit h-fit", classNameStyle)}
    >
      {isLoading ? <ActivityIndicator color="#1C1C1C" /> : children}
    </TouchableOpacity>
  );
};

export default Button;
