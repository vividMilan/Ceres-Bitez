import { firebaseSignUp } from "@/app/(auth)/authController/authMethods";
import { fonts, fontSizes } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 6;
const PENDING_SIGNUP_KEY = "pendingSignUp";

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const router = useRouter();
  const { email, generatedOTP } = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    background: isDark ? "#1C1C1E" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : Colors.default.text,
    subText: isDark ? "#ABABAB" : Colors.default.inputText,
    inputBg: isDark ? "#2C2C2E" : Colors.default.greyBackground,
    inputBorder: isDark ? "#444" : "#ccc",
    inputBorderFocused: Colors.default.primary,
    inputText: isDark ? "#FFFFFF" : Colors.default.text,
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1].focus();
    }


  };




  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      Alert.alert("Incomplete", "Please enter all 6 digits.");
      return;
    }

    if (generatedOTP && code !== String(generatedOTP)) {
      Alert.alert("Invalid OTP", "The code you entered is incorrect.");
      return;
    }

    try {
      setLoading(true);

      const pendingSignUp = await AsyncStorage.getItem(PENDING_SIGNUP_KEY);
      if (!pendingSignUp) {
        throw new Error("Your signup session expired. Please try again.");
      }

      try {
        const { email: pendingEmail, password, userData } = JSON.parse(pendingSignUp);

        await firebaseSignUp(pendingEmail, password, userData);
        await AsyncStorage.removeItem(PENDING_SIGNUP_KEY);

        Alert.alert("Success", "Account created successfully!");
        const userRole = userData.userRole || "user"; // Get role from signup data

        // if (userRole === "ngo") {
        //   router.push("#");

        // }else if(userRole === "home"){
        //   router.push("#");
        // }
        console.log(userRole + " signed up successfully with email: " + pendingEmail);
        router.push("/(auth)/authController/testLogin");

      } catch (error) {
        console.error("Signup failed during OTP verification:", error);
        Alert.alert("Signup Failed", error.message || "Unable to create account.");
        router.back();
      }






    } catch (error) {
      console.error("OTP verification failed:", error);
      Alert.alert("Verification Failed", error.message || "Unable to complete signup.");
    } finally {
      setLoading(false);
    }
  };






  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Verify your number</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Enter the 6-digit code sent to your phone
        </Text>

        {email ? (
          <Text style={[styles.metaText, { color: theme.subText }]}>Sent to {email}</Text>
        ) : null}

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: digit ? theme.inputBorderFocused : theme.inputBorder,
                  color: theme.inputText,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Colors.default.primary },
            (otp.join("").length < OTP_LENGTH || loading) && styles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={otp.join("").length < OTP_LENGTH || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.title,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.regular,
    marginBottom: 12,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    marginBottom: 24,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 10,
    textAlign: "center",
    fontSize: fontSizes.large,
    fontFamily: fonts.semiBold,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 50,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.regular,
  },
});