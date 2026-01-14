import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function progress6() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={[styles.progressStep, styles.activeStep]} />
        ))}
        <View style={styles.progressStep} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Food Ready and{"\n"}Packed ?</Text>

        {/* Custom Swipe-style Button */}
        <TouchableOpacity
          style={styles.readyButton}
          onPress={() => router.navigate("/NGO/(deliveryProgress)/progress7")}
        >
          <Text style={styles.buttonTextInner}>Ready to deliver</Text>
        </TouchableOpacity>
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
    marginHorizontal: 3,
    borderRadius: 4,
  },
  activeStep: {
    backgroundColor: Colors.default.primary,
  },
  contentContainer: { flex: 1 },
  headerText: {
    fontSize: 35,
    fontFamily:fonts.semiBold,
    color: Colors.default.text,
    marginBottom: 40,
    lineHeight: 50,
  },
  readyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9", // Light grey background
    borderRadius: 8,
    height: 60,
    position: "absolute",
    bottom: 50,
    width: "100%",
    overflow: "hidden",
  },
 

  buttonTextInner: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: "#000",

  },
});
