import axios from "axios";
import Constants from "expo-constants";

const baseURLsm = () => {
  const localhost = "http://192.168.1.40:8000"; // Replace with your local IP
  if (Constants.platform?.ios) {
    return "http://localhost:8000/api/"; // Works for iOS
  } else if (Constants.platform?.android) {
    return `${localhost}/api/`; // Works for Android
  }
  return `${localhost}/api/`; // Default fallback
};

const baseURL = __DEV__
  ? baseURLsm() // Localhost for development
  : "https://handwrittendigits.madjria.com/api"; // Hosted for production

console.info("baseURL: ", baseURL);

//const url = baseURL()
export default axios.create({
  baseURL,
});
