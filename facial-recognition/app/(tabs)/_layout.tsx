import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import HomeIcon from '@/assets/icons/HomeIcon.svg';
import FacialRecognitionIcon from '@/assets/icons/FacialRecognitionIcon.svg';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Digits',
          tabBarIcon: () => <HomeIcon />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Facial recognition',
          tabBarIcon: () => <FacialRecognitionIcon />,
        }}
      />
    </Tabs>
  );
}