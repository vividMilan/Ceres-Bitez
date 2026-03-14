import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { firebaseLogin, validateUserRole } from "../authController/authMethods";

export default function login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [secureMode_password, setSecureMode_password] = useState(true);

    const handleChange = (field, value) => {



        // Clearing Error
        clearErrors();

        setShowSuccess(false);

        if (field === "email") setEmail(value);
        else if (field === "password") setPassword(value);

    };

    const handleLogin = async () => {
        const newError = {};


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = {
            length: /^.{6,}$/, // Minimum 6 characters
        };


        if (!email.trim()) newError.email = "Email is required.";
        else if (!emailRegex.test(email.trim())) newError.email = "Invalid email format.";
        if (!password) newError.password = "Password is required.";
        else {
            if (!passwordRegex.length.test(password)) newError.password = "Password must be at least 6 characters.";
        }

        setError(newError);
        setShowSuccess(Object.keys(newError).length === 0);
        if (Object.keys(newError).length > 0) {
            return;
        }

        try {
            setLoading(true);
            const userCredential = await firebaseLogin(email, password);
            await validateUserRole(userCredential.uid, "volunteer");
            router.push("/volunteer");
        } catch (error) {
            setError({ password: error.message || "Access denied. You are not registered as a volunteer." });
        } finally {
            setLoading(false);
        }

    }


    const clearErrors = () => {
        if (Object.keys(error).length === 0) return;
        setError({});
    }



    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Login as Volunteer</Text>

            <View>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Student Email"
                    value={email}
                    onChangeText={(value) => handleChange("email", value)}
                />
            </View>
            {error.email ? <Text style={styles.errorText}>{error.email}</Text> : null}


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

            {loading ? (

                <ActivityIndicator size="large" color={Colors.default.primary} />
            ) : (
                <View>
                    <TouchableOpacity
                        style={[globalStyles.button, { marginTop: "auto" }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={globalStyles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <View>
                        <Text
                            onPress={() => router.push("/(auth)/(volunteer)/signUp")}
                            style={{
                                marginHorizontal: "auto",
                                fontFamily: fonts.regular,
                            }}
                        >
                            Back to signUp
                        </Text>
                    </View>

                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: "#dc2626",
        fontSize: 12,
        marginBottom: 10,
        fontFamily: fonts.regular,
        marginTop: -18,
        paddingHorizontal: 20,
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
});

