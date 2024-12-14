import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiCall } from "../../api";
import Categories from "../../components/categories";
import FiltersModal from "../../components/filtersModal";
import ImageGrid from "../../components/ImageGrid";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import { useRouter } from "expo-router";
var page = 1;
const index = () => {
  const { top } = useSafeAreaInsets();
  const [searchValue, setSearchValue] = useState("");
  const paddingTop = top > 0 ? top + 10 : 30;
  const searchRef = useRef();
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const scrollRef = useRef();
  const [reachedBottom, setReachedBottom] = useState(false);
  const bottomSheetModalRef = useRef(null);

  const router = useRouter();
  useEffect(() => {
    fetchImages();
  }, []);

  const applyFilters = (filters) => {
    // console.log("filters", filters);
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (searchValue) params.q = searchValue;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (searchValue) params.q = searchValue;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const fetchImages = async (params = { page: 1 }, append = true) => {
    // fetch images from API
    // console.log("params: " + params.page, append);
    let res = await apiCall(params);
    // console.log("results", res.data.hits[0]);
    if (res?.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    } else {
      console.log("Error fetching images", res?.msg);
    }
  };

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  // callbacks
  const openFiltersModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const closeFiltersModal = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text.length > 2) {
      // search for this text
      page = 1;
      setActiveCategory(null);
      setImages([]);
      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text === "") {
      page = 1;
      setImages([]);
      searchRef?.current?.clear();
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    searchRef?.current?.clear();
  };

  const clearAppliedFilter = (filterName) => {
    let newFilters = { ...filters };
    delete newFilters[filterName];
    setFilters({ ...newFilters });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...newFilters,
    };
    if (activeCategory) params.category = activeCategory;
    if (searchValue) params.q = searchValue;
    fetchImages(params, false);
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const handleScroll = (e) => {
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollHeight = e.nativeEvent.layoutMeasurement.height;
    const scrollPosition = e.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollHeight;
    if (scrollPosition >= bottomPosition - 1) {
      if (!reachedBottom) {
        setReachedBottom(true);
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (searchValue) params.q = searchValue;
        fetchImages(params, true);
      }
    } else if (reachedBottom) {
      setReachedBottom(false);
    }
  };

  const scrollUp = () => {
    scrollRef?.current?.scrollTo({ y: 0, animated: true });
  };
  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={scrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 15 }}
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
      >
        {/* searchbar */}
        <View>
          <View style={styles.searchbar}>
            <View style={styles.searchIcon}>
              <Feather
                name="search"
                size={22}
                color={theme.colors.neutral(0.7)}
              />
            </View>
            <TextInput
              placeholder="Search for photos..."
              style={styles.searchInput}
              //   value={searchValue}
              ref={searchRef}
              onChangeText={handleTextDebounce}
            />
            {searchValue && (
              <Pressable
                onPress={() => {
                  handleSearch("");
                  setSearchValue("");
                }}
                style={styles.closeIcon}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={theme.colors.neutral(0.7)}
                />
              </Pressable>
            )}
          </View>
        </View>
        {/* Categories */}
        <Categories
          activeCategory={activeCategory}
          handleChangeCategory={handleChangeCategory}
        />

        {/* Applied filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={index} style={styles.filterItem}>
                    {key === "colors" ? (
                      <View
                        style={{
                          width: 30,
                          height: 20,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      />
                    ) : (
                      <Text>{key}</Text>
                    )}
                    <Pressable
                      onPress={() => clearAppliedFilter(key)}
                      style={styles.closeFilterIcon}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.44)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        {/* Images masonry grid */}
        <View>
          {images?.length > 0 && <ImageGrid router={router} images={images} />}
        </View>
        {/* loading indicator */}

        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      {/* filters modal */}
      <FiltersModal
        modalRef={bottomSheetModalRef}
        closeFiltersModal={closeFiltersModal}
        setFilters={setFilters}
        filters={filters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(4),
  },
  title: {
    fontSize: hp(4),
    fontWeight: "bold",
  },
  searchbar: {
    flexDirection: "row",
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    justifyContent: "space-between",
    height: hp(6),
    marginHorizontal: wp(4),
    marginTop: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    alignItems: "center",
    backgroundColor: theme.colors.white,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 5,
    borderRadius: theme.radius.sm,
  },
  filterContainer: {
    gap: 10,
    paddingHorizontal: wp(4),
  },
  filterItem: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.neutral(0.04),
  },
  closeFilterIcon: {
    // height: 10,
    // width: 10,
    padding: 3,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.neutral(0.2),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.neutral(0.04),
  },
});
