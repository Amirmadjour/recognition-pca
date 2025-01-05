import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import LottieView from 'lottie-react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={[
      styles.background, 
      { backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }
    ]}>
      <LottieView
        source={require('@/assets/animations/technology-background.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Stack screenOptions={{
        headerShown: false,
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  animation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
});
