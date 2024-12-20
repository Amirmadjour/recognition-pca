import { ThemedView } from "@/components/ThemedView";
import DrawDigitScreen from "@/components/DrawDigitScreen";
import { useEffect, useState } from "react";
import axios from "@/hooks/axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    axios
      .get("hello")
      .then((res) => console.info(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ThemedView className="bg-blue-50 flex items-center justify-center w-full h-full">
      <SafeAreaView>
        <DrawDigitScreen />
      </SafeAreaView>
    </ThemedView>
  );
}
