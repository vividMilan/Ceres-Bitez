import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function login() {

    const router = useRouter()

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Login</Text>

            <TextInput 
                    placeholder="Email"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
            />
            <TextInput 
                    placeholder="Password"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                    secureTextEntry={true}
            />

            <TouchableOpacity
                    style={globalStyles.button}
                    onPress={() => router.push("/home")}
                >
                    <Text style={globalStyles.buttonText}>
                        Login
                    </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}