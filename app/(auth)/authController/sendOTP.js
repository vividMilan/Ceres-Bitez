import emailjs from "@emailjs/react-native";
import { Alert } from "react-native";

export const sendOTP = async (email, otp) => {
  const serviceID = process.env.EXPO_PUBLIC_SERVICE_ID;
  const templateID = process.env.EXPO_PUBLIC_TEMPLATE_ID;
  const publicKey = process.env.EXPO_PUBLIC_PUBLIC_KEY;

  if (!serviceID || !templateID || !publicKey) {
    console.error(
      "Missing EmailJS environment variables. Check your .env file.",
    );
    return;
  }

  // Initialize EmailJS with the public key
  emailjs.init(publicKey);

  // Email template parameters
  const templateParams = {
    email: email,
    passcode: otp,
  };

  try {
    await emailjs
      .send(serviceID, templateID, templateParams, {
        publicKey: publicKey,
      })
      .then((response) => {
        console.log("OTP sent successfully:", response.status, response.text);
      })
      .catch((error) => {
        console.error("Failed to send OTP:", error);
        Alert.alert("Failed to send OTP", "Please try again.");
      });
    console.log("OTP sent successfully to " + email);
  } catch (error) {
    console.error("Failed to send OTP:", error);
    Alert.alert("Failed to send OTP", "Please try again.");
  }
};
