import { fonts, fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { universities } from "@/data/universities";
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from 'expo-checkbox';
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function signUp() {

    const [isChecked, setChecked] = useState(false)

    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            alert("Camera permission is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log("Image URI:", result.assets[0].uri);
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Create account</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                <Pressable style={styles.cameraClick} onPress={openCamera}>
                    <Entypo name="camera" size={72} color={Colors.default.inputText}/>
                    <Text style={{fontSize: fontSizes.regular, color: Colors.default.inputText}}>Student Record Book</Text>
                </Pressable>

                <View style={styles.dropDownContainer}>
                    <Picker>
                        <Picker.Item style={{color: Colors.default.inputText}} label="Select University" value="" />

                            {universities.map((item, index) => (
                                <Picker.Item
                                    key={index}
                                    label={item}
                                    value={item}
                                />
                            ))}
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

                <TouchableOpacity
                    onPress={() => console.log("Login Clicked")}
                    style={[globalStyles.button]}
                >
                    <Text style={[globalStyles.buttonText]}>Sign Up</Text>
                </TouchableOpacity>


                {/* Login Button */}
                <Link href={"/login"} asChild> 
                    <Text style={{marginHorizontal: "auto", fontFamily: fonts.regular}}>
                        Already have an account ?
                        <Text style={[{color: Colors.default.primary, fontFamily: fonts.semiBold}]}> Login</Text>
                    </Text>
                </Link>
            </ScrollView>
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