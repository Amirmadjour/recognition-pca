import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Animated,
  Alert,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { captureRef } from "react-native-view-shot";
import { Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { endpoints } from "@/hooks/axios";
import Button from "./Button";
import CheckIcon from "@/assets/icons/CheckIcon.svg";
import EraseIcon from "@/assets/icons/EraseIcon.svg";


const { height, width } = Dimensions.get("window");
const svg_dim = width * 0.9;

const DrawLetterScreen = () => {
  const [paths, setPaths] = useState<any>([]);
  const [currentPath, setCurrentPath] = useState<any>([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);
  const svgContainerRef = useRef(null);
  const [imageUri, setImageUri] = useState<any>(null);
  const [result, setResult] = useState<string>("Nothing");
  const [loading, setLoading] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  // Animation pour le résultat
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (result !== "Nothing") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [result]);

  const handleSubmit = async (imageBase64: string) => {
    try {
      setLoading(true);
      const response = await endpoints.cnn_letters(imageBase64);
      setResult(response.data.message);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error while posting image:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors de l\'analyse de l\'image';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onTouchEnd = () => {
    setPaths([...paths, currentPath]);
    setCurrentPath([]);
    setClearButtonClicked(false);
  };

  const onTouchMove = (event: any) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(
      0
    )},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath([]);
    setClearButtonClicked(true);
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  const handleSubmitButtonClick = async () => {
    try {
      setLoading(true);
      
      // Capturer l'image du dessin
      const uri = await captureRef(svgContainerRef, {
        format: 'png',
        quality: 1,
      });

      // Redimensionner l'image
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 28, height: 28 } }],
        { base64: true }
      );

      if (manipResult.base64) {
        await handleSubmit(manipResult.base64);
      }
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'envoi de la lettre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={handleClearButtonClick} style={styles.largeButton}>
          <EraseIcon />
        </Button>
        <Button onPress={handleSubmitButtonClick} isLoading={loading} style={styles.largeButton}>
          <CheckIcon />
        </Button>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Letter Recognition</Text>
        <Text style={styles.subtitle}>
          Draw a single letter in the box below
        </Text>
      </View>
      <View
        style={styles.svgContainer}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Svg
          ref={svgContainerRef}
          height={svg_dim}
          width={svg_dim}
          style={styles.svg}
        >
          <Path
            d={paths.join("")}
            stroke={"#4A90E2"}
            fill={"transparent"}
            strokeWidth={30}
            strokeLinejoin={"round"}
            strokeLinecap={"round"}
          />
          <Path
            d={currentPath.join("")}
            stroke={"#4A90E2"}
            fill={"transparent"}
            strokeWidth={25}
            strokeLinejoin={"round"}
            strokeLinecap={"round"}
          />
        </Svg>
      </View>
      <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            <Text style={styles.resultLabel}>Prediction: </Text>
            <Text style={styles.resultValue}>{result}</Text>
          </Text>
        </View>
      </Animated.View>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={styles.loadingIndicator}
        />
      )}
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.capturedImage}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default DrawLetterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(18, 18, 18, 0.9)", // Fond sombre
    alignItems: "center",
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 0,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
    top: 10,

  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
    letterSpacing: 0.3,
    
  },
  svgContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    width: svg_dim,
    height: svg_dim,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00FFFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    top: 20,

  },
  svg: {
    borderRadius: 20,
  },
  resultContainer: {
      top: 20,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  resultBox: {
    width: '100%',
  },
  resultText: {
    textAlign: "center",
  },
  resultLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 28,
    fontWeight: "500",
  },
  resultValue: {
    color: "#00FFFF",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  likeButton: {
    backgroundColor: "transparent",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  capturedImage: {
    marginTop: 20,
    width: 150,
    height: 150,
    borderRadius: 10,
    borderColor: "#00FFFF",
    borderWidth: 2,
  },
  largeButton: {
    width: 100,
    height: 100,
  },
}); 