import { globalStyles } from "@/constants/globalStyle";
import { Pressable, Text, TextInput, View } from "react-native";

export default function login() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Login</Text>
            <View>
                <TextInput 
                    placeholder="Username"
                    style={globalStyles.input}
                />
                <TextInput 
                    placeholder="Password"
                    secureTextEntry={true}
                    style={globalStyles.input}
                />
                <Pressable
                    onPress={() => console.log("Login Clicked")}
                    style={globalStyles.button}
                >
                    <Text style={globalStyles.buttonText}>Login</Text>
                </Pressable>
                <Pressable
                    onPress={() => console.log("Login Clicked")}
                    style={globalStyles.outlineButton}
                >
                    <Text style={globalStyles.regularText}>Continue With </Text>
                </Pressable>
            </View>
        </View>
    )
}