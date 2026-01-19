import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function login() {
    const router = useRouter();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // if (!email || !password) {
        //     alert("Please fill in all fields.");
        //     return;
        // }

        try {
            // setLoading(true);
            // await signInWithEmailAndPassword(auth, email, password);
            // setLoading(false);
            router.push("/student");
        } catch (error) {
            alert("Login failed. Please check your credentials and try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Login</Text>
            <View>
                <TextInput
                    placeholder="Student Email"
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
                    onPress={handleLogin}
                    style={globalStyles.button}
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

const styles = StyleSheet.create({
    iconButton: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 20,
    },
});
