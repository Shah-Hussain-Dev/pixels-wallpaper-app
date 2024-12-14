import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getOnboarding } from "../helpers/common";

const Layout = () => {
  const [onboarding, setOnboarding] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await getOnboarding();
        setOnboarding(value === "1");
      } catch (error) {
        console.log("error getting onboarding", error);
        setOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (onboarding === null) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (onboarding) {
      router.replace("/home");
    } else if (!inAuthGroup) {
      router.replace("/");
    }
  }, [onboarding, segments]);

  if (onboarding === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack initialRouteName={onboarding ? "home" : "index"}>
          <Stack.Screen
            name="home/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="home/image"
            options={{
              headerShown: false,
              presentation: "transparentModal",
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;

const styles = StyleSheet.create({});
