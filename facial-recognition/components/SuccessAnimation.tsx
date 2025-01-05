import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

interface SuccessAnimationProps {
  onAnimationFinish?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ onAnimationFinish }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/animations/technology-background.json')}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  animation: {
    width: 200,
    height: 200,
  },
}); 