import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function progress4() {
  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.progressContainer}>
            {[1, 2, 3,4].map((i) => (
              <View key={i} style={[styles.progressStep, styles.activeStep]} />
            ))}
            <View style={styles.progressStep} />
          </View>

      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Food Picked,{"\n"}On the way to {'\n'}NGO...</Text>

        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../../../assets/images/NGO/progress3_pic.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
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
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activeStep: { backgroundColor: Colors.default.primary },
  contentContainer: { flex: 1, marginTop: 20 },
  headerText: {
    fontSize: 35,
    fontFamily: fonts.semiBold,
    color: Colors.default.text,
    lineHeight: 50,
    marginBottom: 50,
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: { width: 400, height: 400 },
});
