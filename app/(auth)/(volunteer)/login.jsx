import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Link, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function login() {

    const router = useRouter()

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Login</Text>
            <View>
                <TextInput 
                    placeholder="Username"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                />
                <TextInput 
                    placeholder="Password"
                    secureTextEntry={true}
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                />
                <TouchableOpacity
                    onPress={() => router.navigate("/volunteer")}
                    style={globalStyles.button}
                >
                    <Text style={globalStyles.buttonText}>Login </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => console.log("Login Clicked")}
                    style={[globalStyles.outlineButton, styles.iconButton]}
                >
                    <Text style={globalStyles.regularText}>Continue With Google</Text>
                    <Image 
                        source={require("../../../assets/images/icons/google-icon.png")}
                        style={{height: 20, width: 20}}
                    />
                </TouchableOpacity>
                <Link href={"/signUp"}> 
                    <Text style={{marginHorizontal: "auto", fontFamily: fonts.regular}}>
                        Dont Have an account
                        <Text style={[{color: Colors.default.primary, fontFamily: fonts.semiBold}]}> Sign Up</Text>
                    </Text>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    iconButton: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 20
    }
})