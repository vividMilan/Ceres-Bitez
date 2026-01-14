import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function progress7() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar (7/7 - All Purple) */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <View key={i} style={[styles.progressStep, styles.activeStep]} />
        ))}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>On the way to{"\n"}destination...</Text>

        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../assets/images/deliveryProgress/progress3_pic.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>

   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  progressStep: {
    height: 8,
    flex: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 3,
    borderRadius: 4,
  },
  activeStep: { backgroundColor: Colors.default.primary },
  contentContainer: { flex: 1 },
  headerText: {
    fontSize: 35,
    fontFamily:fonts.semiBold,
    color: Colors.default.text ,
    marginBottom: 40,
  },
  imageWrapper: { width: "100%", alignItems: "center", marginTop: 50 },
  illustration: { width: 400, height: 400 },
});
