import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { ColorFilters, CommonFilterView, SectionView } from "./filterViews";
import { data } from "../constants/data";

const FiltersModal = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            return (
              <Animated.View
                entering={FadeInDown.duration(index * 100 + 100)
                  .springify()
                  .damping(12)}
                key={index}
              >
                <SectionView
                  key={index}
                  title={sectionName}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    filterName: sectionName,
                    setFilters,
                  })}
                />
              </Animated.View>
            );
          })}
        </View>
        {/* action buttons */}
        <Animated.View
          style={styles.actionButtons}
          entering={FadeInDown.duration(500).springify().damping(12)}
        >
          <Pressable style={styles.resetButton} onPress={onReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
          <Pressable
            style={styles.applyButton}
            onPress={() => onApply(filters)}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </Pressable>
        </Animated.View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props) => <CommonFilterView {...props} />,
  orientations: (props) => <CommonFilterView {...props} />,
  type: (props) => <CommonFilterView {...props} />,
  colors: (props) => <ColorFilters {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overLay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      {/* blue view */}
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overLay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    gap: 15,
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: hp(8),
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // flex: 1,
    width: "100%",
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.05),
    padding: 10,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.neutral(0.06),
    borderWidth: 2,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.black,
    padding: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  resetButtonText: {
    color: theme.colors.neutral(0.8),
    fontSize: hp(2),
  },
  applyButtonText: {
    color: theme.colors.white,
    fontSize: hp(2),
  },
});
