import { Pressable, StyleSheet, Text, View } from "react-native";
import { capitalizeFirstLetter, hp } from "../helpers/common";
import { theme } from "../constants/theme";

export const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{capitalizeFirstLetter(title)}</Text>
      <View style={styles.sectionContent}>{content}</View>
    </View>
  );
};

export const CommonFilterView = ({ data, filters, filterName, setFilters }) => {
  const handleFilterPress = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };
  return (
    <View style={styles.flewRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let backgroundColor = isActive
            ? theme.colors.neutral(0.9)
            : theme.colors.white;
          let textColor = isActive
            ? theme.colors.white
            : theme.colors.neutral(0.9);
          return (
            <Pressable
              key={index}
              onPress={() => handleFilterPress(item)}
              style={[styles.outlineButton, { backgroundColor }]}
            >
              <Text style={[styles.outlineButtonText, { color: textColor }]}>
                {capitalizeFirstLetter(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};
export const ColorFilters = ({ data, filters, filterName, setFilters }) => {
  const handleFilterPress = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };
  return (
    <View style={styles.flewRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let borderColor = isActive
            ? theme.colors.neutral(0.4)
            : theme.colors.white;

          return (
            <Pressable key={index} onPress={() => handleFilterPress(item)}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]} />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeight.medium,
  },
  sectionContent: {
    paddingTop: 8,
  },
  outlineButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderCurve: "continuous",
  },
  outlineButtonText: {
    fontSize: hp(2),
    fontWeight: theme.fontWeight.medium,
  },
  flewRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorWrapper: {
    width: 45,
    height: 38,
    borderRadius: theme.radius.xs,
    borderWidth: 2,
    padding: 2,
    borderColor: theme.colors.black,
    borderCurve: "continuous",
  },
  color: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xs,
  },
});
