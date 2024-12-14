import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const wp = (percentage) => {
  const width = deviceWidth;
  return (percentage * width) / 100;
};
export const hp = (percentage) => {
  const height = deviceHeight;
  return (percentage * height) / 100;
};

export const getColumnCount = () => {
  if (deviceWidth >= 1024) {
    return 4;
  } else if (deviceWidth >= 768) {
    return 3;
  } else {
    return 2;
  }
};

export const getImageSize = (height, width) => {
  if (width > height) {
    // landscape
    return 250;
  } else if (width < height) {
    // portrait
    return 300;
  } else {
    // square
    return 200;
  }
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const setOnboarding = async () => {
  try {
    let onboarding = await AsyncStorage.setItem("onboarding", "1");
    if (onboarding) {
      console.log("Onboarded");
    } else {
      console.log("Not onboarded");
    }
  } catch (error) {
    console.log("error setting onboarding", error);
    return false;
  }
};

export const getOnboarding = async () => {
  try {
    const value = await AsyncStorage.getItem("onboarding");
    return value;
  } catch (error) {
    console.log("error getting onboarding", error);
    return null;
  }
};

export const clearOnboarding = async () => {
  try {
    await AsyncStorage.removeItem("onboarding");
  } catch (error) {
    console.log("error clearing onboarding", error);
  }
};
