import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function login() {
    
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
                <Pressable
                    onPress={() => console.log("Login Clicked")}
                    style={globalStyles.button}
                >
                    <Text style={globalStyles.buttonText}>Login </Text>
                </Pressable>
                <Pressable
                    onPress={() => console.log("Login Clicked")}
                    style={[globalStyles.outlineButton, styles.iconButton]}
                >
                    <Text style={globalStyles.regularText}>Continue With Google</Text>
                    <Image 
                        source={require("../../../assets/images/icons/google-icon.png")}
                        style={{height: 20, width: 20}}
                    />
                </Pressable>
                <Link href={"/signUp"} asChild> 
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