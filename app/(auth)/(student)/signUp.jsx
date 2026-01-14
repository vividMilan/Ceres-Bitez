import { fonts, fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { universities } from "@/data/universities";
import { auth, db } from "@/firebaseConfig";
import { supabase } from "@/supabaseConfig";
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from "@react-native-picker/picker";
import { Checkbox } from 'expo-checkbox';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function signUp() {

    const router = useRouter()

    const [isChecked, setChecked] = useState(false)

    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [regNo, setRegNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [university, setUniversity] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            alert("Camera permission is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            allowsEditing: true,
            quality: 0.75
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri)
        }
    };

    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        return await response.blob();
    };

    const uploadRecordBook = async (uri, uid) => {
        const response = await fetch(uri)
        const arrayBuffer = await response.arrayBuffer();
        const filePath = `${uid}/recordBook.jpg`;

        const { error } = await supabase.storage
            .from("student-record-books")
            .upload(filePath, arrayBuffer, {
                contentType: "image/jpeg",
                upsert: true,
            });

        if (error) {
            console.log("UPLOAD ERROR:", error);
            throw error;
        }

        const { data } = supabase.storage
            .from("student-record-books")
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSignUp = async () => {
        if (!isChecked) {
            alert("Accept term & conditions")
            return;
        }

        if (!imageUri) {
            alert("Upload student recotd book")
            return
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        try {
            setLoading(true)


            //firebase Auth
            const userCred = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            const uid = userCred.user.uid;

            // Upload Image to supabase
            const recordBookUrl = await uploadRecordBook(imageUri, uid)

            // Save student profile in Firebase

            await setDoc(doc(db, "users", uid), {
                name,
                email,
                mobile,
                regNo,
                university,
                recordBookUrl,
                role: "student",
                createdAt: new Date()
            })

            alert("Account created successfully")
            router.push("/(auth)/(student)/login")
            
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Create account</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TextInput 
                    placeholder="Name with initials"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput 
                    placeholder="Student email"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput 
                    placeholder="Mobile Number"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="numeric"
                />
                <TextInput 
                    placeholder="Student Registration Number"
                    style={globalStyles.input}
                    placeholderTextColor={Colors.default.inputText}
                    value={regNo}
                    onChangeText={setRegNo}
                />
                <TextInput 
                    placeholder="Password"
                    style={globalStyles.input}
                    secureTextEntry={true}
                    placeholderTextColor={Colors.default.inputText}
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput 
                    placeholder="Confirm Password"
                    style={globalStyles.input}
                    secureTextEntry={true}
                    placeholderTextColor={Colors.default.inputText}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <Pressable style={globalStyles.cameraClick} onPress={openCamera}>
                    <Entypo name="camera" size={72} color={Colors.default.inputText}/>
                    <Text style={{fontSize: fontSizes.regular, color: Colors.default.inputText}}>Student Record Book</Text>
                </Pressable>

                <View style={globalStyles.dropDownContainer}>
                    <Picker
                        selectedValue={university}
                        onValueChange={(value) => setUniversity(value)}
                    >
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
                    onPress={handleSignUp}
                    style={[globalStyles.button]}
                    disabled={loading}
                >
                    <Text style={[globalStyles.buttonText]}>Sign Up</Text>
                </TouchableOpacity>


                {/* Login Button */}
                <View> 
                    <Text onPress={() => router.push("/(auth)/(student)/login")} style={{marginHorizontal: "auto", fontFamily: fonts.regular}}>
                        Already have an account ?
                        <Text style={[{color: Colors.default.primary, fontFamily: fonts.semiBold}]}> Login</Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}