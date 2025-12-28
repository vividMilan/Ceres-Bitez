import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox/build/ExpoCheckbox";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function signUp() {

    const [isChecked, setChecked] = useState(false)

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Create Account</Text>
            <TextInput 
                style={globalStyles.input}
                placeholder="Home Name"
            />
            <TextInput 
                style={globalStyles.input}
                placeholder="Email"
            />
            <TextInput 
                style={globalStyles.input}
                placeholder="Location"
            />
            <TextInput 
                style={globalStyles.input}
                placeholder="Mobile Number"
            />
            <TextInput 
                style={globalStyles.input}
                placeholder="Password"
                secureTextEntry={true}
            />
            <TextInput 
                style={globalStyles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
            />
            <View style={styles.dropDownContainer}>
                <Picker>
                    <Picker.Item style={{color: Colors.default.inputText}} label="Select Home Type" value="" />
                    <Picker.Item label="Children Home" value="children" />
                    <Picker.Item label="Elderly Home" value="elderly" />
                </Picker>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 20}}>
                    <Checkbox 
                        style={{width: 30, height: 30, margin: 8}}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={Colors.default.primary}
                    />
                    <Text style={globalStyles.regularText}>By selecting checkbox accept the terms and conditions</Text>
            </View>
            <View style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>Sign Up</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cameraClick: {
        height: 300,
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 50,
        marginBottom: 20
    },
    dropDownContainer: {
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        borderRadius: 50,
        marginBottom: 20,
        paddingInline: 10
    }
})