import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { sendOTP } from "../authController/sendOTP";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


// Key to store pending home sign-up data in AsyncStorage
const PENDING_SIGNUP_KEY = "pendingSignUp";



export default function signUp() {
   const router = useRouter();

    const [restaurantName, setRestaurantName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChecked, setChecked] = useState(false);

    // Other states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [secureMode_password, setSecureMode_password] = useState(true);
    const [secureMode_conPassword, setSecureMode_conPassword] = useState(true)

    
    const restaurantProfileData = {
        restaurantName: restaurantName,
        mobileNumber: mobileNumber,
        email: email,
        userRole: "restaurants",
    };

     const handleChange = (field, value) => {

        // Clearing Error
        clearErrors();

        setShowSuccess(false);

        if (field === "restaurantName") setRestaurantName(value);
        else if (field === "email") setEmail(value);
        else if (field === "mobileNumber") setMobileNumber(value);
        else if (field === "password") setPassword(value);
        else if (field === "confirmPassword") setConfirmPassword(value);
        else if (field === "isChecked") setChecked(value);
    };


    const handleSignUp = async () => {

        const newError = {};

        // Validation regex patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = {
            length: /^.{6,}$/,
        };
        const mobileRegex = /^\d{10}$/;

        if (!restaurantName.trim()) newError.restaurantName = "Restaurant name is required.";
        if (!email.trim()) newError.email = "Email is required.";
        else if (!emailRegex.test(email.trim())) newError.email = "Invalid email format.";
        if (!mobileNumber.trim()) newError.mobileNumber = "Mobile number is required.";
        else if (!mobileRegex.test(mobileNumber.trim())) newError.mobileNumber = "Invalid mobile number format.";
        if (!password.trim()) newError.password = "Password is required.";
        else if (!passwordRegex.length.test(password.trim())) newError.password = "Password must be at least 6 characters long.";
        if (!confirmPassword.trim()) newError.confirmPassword = "Please confirm your password.";
        else if (password.trim() !== confirmPassword.trim()) newError.confirmPassword = "Passwords do not match.";

        setError(newError);
        setShowSuccess(Object.keys(newError).length === 0);
        if (Object.keys(newError).length > 0) {
            return;
        }


        // Sign in logic
        try {
            setLoading(true);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            // send otp to user email
            await sendOTP(email, otp);
            console.log("Generated OTP from params:", otp);


            await AsyncStorage.setItem(
                PENDING_SIGNUP_KEY,
                JSON.stringify({
                    email,
                    password,
                    userData: restaurantProfileData,
                }),
            );

            router.push({
                pathname: "/(auth)/authController/otpVerification",
                params: { email, generatedOTP: otp },
            });
        } catch (error) {
            console.error("Error during sign up:", error);
            Alert.alert("Sign Up Failed", "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }

    };


    
    const clearErrors = () => {
        if (Object.keys(error).length === 0) return;
        setError({});
    };


     
    return (
        <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={globalStyles.titleText}>Create Account as Restaurant</Text>

                    <View>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Restaurant Name"
                            value={restaurantName}
                            onChangeText={(value) => handleChange("restaurantName", value)}

                        />
                        {error.restaurantName ? <Text style={styles.errorText}>{error.restaurantName}</Text> : null}
                    </View>

                    <View>
                        <TextInput
                            style={globalStyles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={(value) => handleChange("email", value)}
                        />
                    </View>
                    {error.email ? <Text style={styles.errorText}>{error.email}</Text> : null}
                    <View>
                        <TextInput
                            style={globalStyles.input}
                            keyboardType="phone-pad"
                            maxLength={10}
                            placeholder="Mobile Number"
                            value={mobileNumber}
                            onChangeText={(value) => handleChange("mobileNumber", value)}
                        />
                        {error.mobileNumber ? <Text style={styles.errorText}>{error.mobileNumber}</Text> : null}
                    </View>

                    <View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[globalStyles.input, styles.passwordInput]}
                                placeholder="Password"
                                secureTextEntry={secureMode_password}
                                value={password}
                                maxLength={12}
                                onChangeText={(value) => handleChange("password", value)}
                            />
                            <TouchableOpacity
                                onPress={() => setSecureMode_password(!secureMode_password)}
                                style={styles.icon}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={secureMode_password ? "eye-off" : "eye"}
                                    size={30}
                                    color="gray"

                                />
                            </TouchableOpacity>
                        </View>
                        {error.password ? <Text style={styles.errorText}>{error.password}</Text> : null}

                    </View>

                    <View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[globalStyles.input, styles.passwordInput]}
                                placeholder="Confirm Password"
                                secureTextEntry={secureMode_conPassword}
                                value={confirmPassword}
                                maxLength={12}
                                onChangeText={(value) => handleChange("confirmPassword", value)}
                            />
                            <TouchableOpacity
                                onPress={() => setSecureMode_conPassword(!secureMode_conPassword)}
                                style={styles.icon}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={secureMode_conPassword ? "eye-off" : "eye"}
                                    size={30}
                                    color="gray"

                                />
                            </TouchableOpacity>

                        </View>
                        {error.confirmPassword ? <Text style={styles.errorText}>{error.confirmPassword}</Text> : null}
                    </View>

                    <View style={styles.termsContainer}>
                        <View style={styles.termsRow}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={(value) => handleChange("isChecked", value)}
                                color={Colors.default.primary}
                            />
                            <Text style={[globalStyles.regularText, styles.termsText]}>
                                By selecting checkbox accept the terms and conditions
                            </Text>
                        </View>
                        {error.isChecked ? <Text style={styles.termsErrorText}>{error.isChecked}</Text> : null}
                    </View>

                    {loading ? (

                        <ActivityIndicator size="large" color={Colors.default.primary} />
                    ) : (
                        <View>
                            <TouchableOpacity
                                style={[globalStyles.button, { marginTop: "auto" }]}
                                onPress={handleSignUp}
                                disabled={loading}
                            >
                                <Text style={globalStyles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>

                            <View>
                                <Text
                                    onPress={() => router.push("/(auth)/(restuarant)/login")}
                                    style={{
                                        marginHorizontal: "auto",
                                        fontFamily: fonts.regular,
                                    }}
                                >
                                    Already have an account ?
                                    <Text
                                        style={[
                                            {
                                                color: Colors.default.primary,
                                                fontFamily: fonts.semiBold,
                                            },
                                        ]}
                                    >
                                        {" "}
                                        Login
                                    </Text>
                                </Text>
                            </View>

                        </View>
                    )}



                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 32,
        flexGrow: 1,
    },
    cameraClick: {
        height: 300,
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 50,
        marginBottom: 20,
    },
    dropDownContainer: {
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        borderRadius: 50,
        marginBottom: 20,
        paddingInline: 10,
    },

    errorText: {
        color: "#dc2626",
        fontSize: 12,
        marginBottom: 10,
        fontFamily: fonts.regular,
        marginTop: -18,
        paddingHorizontal: 20,
    },
    input: {
        flex: 1, // Takes up remaining space
        height: 50,
    },
    icon: {
        padding: 10,

    },
    passwordContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",


    },
    passwordInput: {
        flex: 1,
    },
    termsContainer: {
        marginBottom: 20,
    },
    termsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 30,
        height: 30,
        margin: 8,
    },
    termsText: {
        flex: 1,
    },
    termsErrorText: {
        color: "#dc2626",
        fontSize: 12,
        fontFamily: fonts.regular,
        marginTop: 4,
        marginLeft: 46,
    },
});
