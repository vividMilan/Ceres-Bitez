import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function waitingForRestuarant() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>
          Waiting{"\n"}restaurant to{"\n"}accept order...
        </Text>

        {/* Placeholder for Illustration */}
        <View style={styles.illustrationPlaceholder} />
      </View>
    </SafeAreaView>
  );
}

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
  activeStep: {
    backgroundColor: Colors.default.primary, // Matching your purple theme
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  headerText: {
    fontFamily: fonts.semiBold,
    fontSize: 40,
    color: Colors.default.text,
    lineHeight: 50,
    marginBottom: 40,
  },
  illustrationPlaceholder: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
});