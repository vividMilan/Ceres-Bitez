import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function progress5() {
  const router = useRouter();
  // Simple state to handle checking/unchecking
  const [checks, setChecks] = useState({
    visuallyOk: true,
    odour: true,
    safe: true,
  });

  const isAllChecked = checks.visuallyOk && checks.odour && checks.safe;

  const toggleCheck = (key) => {
    setChecks({ ...checks, [key]: !checks[key] });
  };

  const handleCheckPress = () => {
    if (isAllChecked) {
      // Need to develop firebase functionalities
      router.navigate("/NGO/(deliveryProgress)/progress6");
    } else {
      Alert.alert("Please ensure all checks are marked before proceeding.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar (5 out of 7 steps filled) */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[styles.progressStep, styles.activeStep]} />
        ))}
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Checking the food</Text>

        {/* Checklist Section */}
        <View style={styles.checklist}>
          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => toggleCheck("visuallyOk")}
          >
            <View
              style={[styles.checkbox, checks.visuallyOk && styles.checkedBox]}
            >
              {checks.visuallyOk && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>Is the food visually ok</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => toggleCheck("odour")}
          >
            <View style={[styles.checkbox, checks.odour && styles.checkedBox]}>
              {checks.odour && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>Is there’s a specific odour</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => toggleCheck("safe")}
          >
            <View style={[styles.checkbox, checks.safe && styles.checkedBox]}>
              {checks.safe && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>Safe for consumption</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.button,
            !isAllChecked && styles.buttonDisabled, // Apply disabled style if not all checked
          ]}
          onPress={handleCheckPress}
          activeOpacity={isAllChecked ? 0.7 : 1} // Prevent "flicker" when disabled
        >
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
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
  activeStep: {
    backgroundColor: Colors.default.primary,
  },
  contentContainer: {
    flex: 1,
  },
  headerText: {
    fontFamily: fonts.semiBold,
    fontSize: 30,
    color: "#000",
    marginBottom: 40,
    textAlign: "left",
  },
  checklist: {
    marginBottom: 40,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    justifyContent: "flex-end", // Aligns the text to the right as per image
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.default.primary,
    borderRadius: 6,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#fff", // Image shows a white background with purple border/check
  },
  checkMark: {
    color: Colors.default.primary,
    fontWeight: "bold",
  },
  checkLabel: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: Colors.default.text,
    flex: 1,
  },
  button: {
    backgroundColor: Colors.default.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.semiBold,
  },
});
