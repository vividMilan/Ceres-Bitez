import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function delivered() {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        {/* Success Circle */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../assets/images/checkMark.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.deliveredText}>Food Delivered</Text>

        <TouchableOpacity
          style={styles.okButton}
          onPress={() => router.navigate('/home/(tabs)/home')}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  successCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#27AE60", // Green color
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  checkIcon: { color: "#fff", fontSize: 80, fontWeight: "bold" },
  deliveredText: {
    fontSize: 30,
    fontFamily: fonts.semiBold,
    marginVertical: 30,
    color: "#000",
  },
  okButton: {
    backgroundColor: Colors.default.primary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff",
     fontSize: 16,
     fontFamily: fonts.semiBold,
     },
  imageWrapper: { width: "100%", alignItems: "center" },
  illustration: { width: 200, height: 200 },
});