import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const [isChecked, setChecked] = useState(false);
    const router = useRouter();

    const handleSignUp = () => {
        if (!isChecked) {
            alert("Please accept the terms and conditions.");
            return;
        }
        // Add your signup logic here (e.g., Firebase auth)
        alert("Sign Up Clicked!");
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Sign Up</Text>

            <TextInput
                placeholder="NGO"
                style={globalStyles.input}
                placeholderTextColor={Colors.default.inputText}
            />

            <TextInput
                placeholder="Email"
                style={globalStyles.input}
                placeholderTextColor={Colors.default.inputText}
            />

            <TextInput
                placeholder="Mobile Number"
                style={globalStyles.input}
                placeholderTextColor={Colors.default.inputText}
            />

            <TextInput
                placeholder="Password"
                style={globalStyles.input}
                placeholderTextColor={Colors.default.inputText}
                secureTextEntry
            />

            <TextInput
                placeholder="Confirm Password"
                style={globalStyles.input}
                placeholderTextColor={Colors.default.inputText}
                secureTextEntry
            />

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <Checkbox
                    style={{ width: 30, height: 30, margin: 8 }}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={Colors.default.primary}
                />
                <Text style={globalStyles.regularText}>
                    By selecting checkbox, accept the terms and conditions
                </Text>
            </View>

            <TouchableOpacity
                style={globalStyles.button}
                onPress={handleSignUp}
            >
                <Text style={globalStyles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View>
                <Text
                    style={[
                        globalStyles.regularText,
                        { textAlign: "center", marginTop: 10 },
                    ]}
                >
                    Already have an account?{" "}
                    <Text
                        style={{
                            color: Colors.default.primary,
                            fontFamily: fonts.semiBold,
                        }}
                        onPress={() => router.push("/login")}
                    >
                        Login
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}
