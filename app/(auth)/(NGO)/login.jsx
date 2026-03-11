import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function login() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Login</Text>
            <View>
                <TextInput
                    placeholder="NGO Email"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={globalStyles.button}
                    onPress={() => router.push("/NGO/(tabs)/home")}
                >
                    <Text style={globalStyles.buttonText}>
                        {loading ? "Logging in..." : "Login"}
                    </Text>
                </TouchableOpacity>
                <Link href={"/signUp"}>
                    <Text
                        style={{
                            marginHorizontal: "auto",
                            fontFamily: fonts.regular,
                        }}
                    >
                        Dont Have an account
                        <Text
                            style={[
                                {
                                    color: Colors.default.primary,
                                    fontFamily: fonts.semiBold,
                                },
                            ]}
                        >
                            {" "}
                            Sign Up
                        </Text>
                    </Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}
