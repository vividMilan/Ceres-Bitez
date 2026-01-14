import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RequestDetails() {
  const { requestId, homeName, homeImage, requestDate, homeLocation } =
    useLocalSearchParams();

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <View>
          <Image source={{ uri: homeImage }} style={styles.image} />
        </View>

        <View>
          <Text style={[globalStyles.titleText, styles.homeName]}>
            {homeName}
          </Text>
          <Text style={styles.date}>
            {" "}
            {requestDate
              ? new Date(parseInt(requestDate)).toLocaleDateString("en-GB")
              : "No date"}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={{ color: "white", fontFamily: fonts.semiBold }}>
              We Want
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.semiBold, marginLeft: 3 }}>
            30 Rice and Curry
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={{ color: "white", fontFamily: fonts.semiBold }}>
              Location
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.semiBold, marginLeft: 3 }}>
            {homeLocation}
          </Text>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  homeName: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: -5,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "stretch",
    borderRadius: 10,
    borderColor: "#000000ff",
    borderWidth: 1,
  },
  date: {
    textAlign: "center",
    marginBottom: 25,
    fontFamily: fonts.medium,
  },
  itemContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemHeader: {
    backgroundColor: Colors.default.primary,
    padding: 15,
    borderRadius: (10, 0, 0, 10),
    color: "white",
  },
});
