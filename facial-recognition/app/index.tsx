import { ThemedView } from "@/components/ThemedView";
import DrawLetterScreen from "@/components/DrawLetterScreen";
import { useEffect } from "react";
import { endpoints } from "@/hooks/axios.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  useEffect(() => {
    endpoints.hello()
      .then((res) => console.info("Response:", res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <DrawLetterScreen />
      </SafeAreaView>
    </ThemedView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0F7FA",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}); 