import { Entypo, Ionicons, Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";

const ImageDetail = () => {
  const router = useRouter();
  const item = useLocalSearchParams(); //get the item from the params
  const uri = item?.webformatURL;
  const fileName = item?.previewURL.split("/").pop();
  const fileUrl = uri;
  const filePath = FileSystem.documentDirectory + fileName;

  const [status, setStatus] = useState("loading");

  const onLoad = () => {
    setStatus("");
  };

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);

    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;
    if (aspectRatio < 1) {
      //portrait image
      calculatedWidth = calculatedHeight * aspectRatio;
      //   if (Platform.OS == "web") {
      //     calculatedHeight = calculatedHeight * aspectRatio - wp(4);
      //     calculatedWidth = calculatedWidth - wp(15);
      //   }
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const handleDownloadImage = async () => {
    if (Platform.OS == "web") {
      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = fileName || "download";
      document.body.appendChild(anchor);
      anchor.click();
      showToast("Image downloaded");
      document.body.removeChild(anchor);
    } else {
      setStatus("downloading");
      let uri = await downloadFile();
      if (uri) {
        showToast("Image downloaded");
        //   toast for ios
      }
    }
  };

  const handleShareImage = async () => {
    try {
      if (Platform.OS == "web") {
        showToast("Link copied!");
        navigator.clipboard.writeText(fileUrl);
      } else {
        setStatus("sharing");
        let uri = await downloadFile();
        if (uri) {
          await Sharing.shareAsync(uri);
        }
      }
    } catch (error) {
      Alert.alert("Image", error.message);
    }
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(fileUrl, filePath);
      //   console.log("save at", uri);
      setStatus("");
      return uri;
    } catch (error) {
      //   console.log("error", error);
      Alert.alert("Image", error.message);
      setStatus("");
      return null;
    } finally {
      setStatus("");
    }
  };

  const showToast = (message) => {
    Toast.show({
      text1: message,
      type: "success",
      position: "bottom",
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={styles.toastContainer}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <BlurView intensity={60} style={styles.container} tint="dark">
      <View style={getSize()}>
        <View style={styles.loading}>
          {status == "loading" && (
            <ActivityIndicator size="large" color={"white"} />
          )}
        </View>
        <Image
          source={{ uri }}
          //   resizeMode="contain"
          imageStyle={{ borderRadius: theme.radius.lg }}
          style={[styles.image, getSize()]}
          onLoad={onLoad}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Ionicons name="close" color="white" size={24} />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status == "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name="download" color="white" size={24} />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status == "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" color="white" size={24} />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

export default ImageDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.lg,
    // backgroundColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 50,
    marginTop: 40,
  },
  button: {
    height: hp(6),
    width: hp(6),
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
  },
  toastContainer: {
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: "lime",
  },
  toastText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "bold",
  },
});
