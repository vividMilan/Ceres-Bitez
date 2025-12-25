import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function login() {

    const [username, setUsername] = useState("")
    const [pwd, setPwd] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const router = useRouter()

    const handleLogin = async () => {
        // Handle login logic here

        if (!username || !pwd) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, username, pwd)
            router.push("/restuarant/")
        } catch (err) {
            Alert.alert(err)
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[globalStyles.container, {marginTop: 100}]}>
            <Text style={globalStyles.titleText}>Login</Text>

            <TextInput 
                style={globalStyles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput 
                style={globalStyles.input}
                placeholder="Password"
                value={pwd}
                onChangeText={setPwd}
                secureTextEntry={true}
            />

            <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
                <Text style={globalStyles.buttonText}>
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>

            <Text style={[globalStyles.regularText, {fontFamily: fonts.semiBold, textAlign: "center"}]}>
                Don't Have an account. {
                <Text style={[globalStyles.regularText, {fontFamily: fonts.semiBold, color: Colors.default.primary}]}>
                    Sign Up
                </Text>}
            </Text>
        </View>
    )
}