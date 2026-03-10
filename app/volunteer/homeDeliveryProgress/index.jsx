import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const router = useRouter();

    const { requestId } = useLocalSearchParams()



    const handleButton = async () => {

        // if (!requestId) return

        // const requestRef = doc(db, "requests", requestId)

        // await updateDoc(requestRef, {
        //     status: "r-packed-up"
        // })

        router.replace("/volunteer")
    }
    

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Food{"\n"}Picked Up ?</Text>

        {/* Custom Swipe-style Button */}
        <TouchableOpacity
          style={styles.readyButton}
          onPress={handleButton}
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