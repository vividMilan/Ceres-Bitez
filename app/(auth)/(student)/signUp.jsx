import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Link } from "expo-router";
import { Text, TextInput, View } from "react-native";

export default function signUp() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Create account</Text>
            <View>
                <TextInput 
                    placeholder="Name with initials"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                />
                <TextInput 
                    placeholder="Student email"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                />
                <TextInput 
                    placeholder="Mobile Number"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                />
                <TextInput 
                    placeholder="Student Registration Number"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                />
                <TextInput 
                    placeholder="Password"
                    style={globalStyles.input}
                    secureTextEntry={true}
                    placeholderTextColor={Colors.default.inputText}
                />
                <TextInput 
                    placeholder="Confirm Password"
                    style={globalStyles.input}
                    secureTextEntry={true}
                    placeholderTextColor={Colors.default.inputText}
                />
                <Link href={"/login"} asChild> 
                    <Text style={{marginHorizontal: "auto", fontFamily: fonts.regular}}>
                        Already have an account ?
                        <Text style={[{color: Colors.default.primary, fontFamily: fonts.semiBold}]}> Login</Text>
                    </Text>
                </Link>
            </View>
        </View>
    )
}