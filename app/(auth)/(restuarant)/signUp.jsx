import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { auth, db } from "@/firebaseConfig";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function signUp() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [pwd, setPwd] = useState("")
    const [confirmPwd, setConfirmPwd] = useState("")
    const [location, setLocation] = useState({
            latitude: 6.8770379670429245,
            longitude: 79.86881400259556,
        })
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState("https://eu-assets.simpleview-europe.com/northnorfolk/imageresizer/?image=%2Fdmsimgs%2Fcaravan-accessory-shop-west-runton_472854.jpg&action=ProductDetailImage")


    const [isChecked, setChecked] = useState(false)
    const router = useRouter()


    const handleSignUp = async () => {

        if (!name || !email || !mobile || !pwd || !confirmPwd) {
            Alert.alert("Error", "Please fill in all fields.")
            return
        }

        if (pwd !== confirmPwd) {
            Alert.alert("Error", "Passwords do not match.")
            return
        }

        if (!isChecked) {
            Alert.alert("Error", "Please accept the terms and conditions.")
            return
        }

        try {
            setLoading(true)
            const userCred = await createUserWithEmailAndPassword(auth, email, pwd)
            const uid = userCred.user.uid


            await setDoc(doc(db, "users", uid), {
                name,
                email, 
                mobile,
                location: location,
                imageUrl: imageUrl,
                createdAt: new Date(),
                role: "restaurant"
            })
    
            setLoading(false)
            Alert.alert("Success", "Account created successfully!")
            router.push("/(auth)/(restuarant)/login")


        } catch (error) {
            Alert.alert("Error", "Failed to create account. Please try again.")
            console.error("Sign Up Error: ", error)
            setLoading(false)
            return
        }



    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>
                Create an Account
            </Text>

            <TextInput 
                style={globalStyles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput 
                style={globalStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput 
                style={globalStyles.input}
                placeholder="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="numeric"
            />

            <TextInput 
                style={globalStyles.input}
                placeholder="Password"
                value={pwd}
                onChangeText={setPwd}
                secureTextEntry={true}
            />

            <TextInput 
                style={globalStyles.input}
                placeholder="Confirm Password"
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                secureTextEntry={true}
            />

            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 20}}>
                <Checkbox
                    style={{width: 30, height: 30, margin: 8}}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={Colors.default.primary}
                />
                <Text style={globalStyles.regularText}>By selecting checkbox accept the terms and conditions</Text>
            </View>

            <TouchableOpacity style={globalStyles.button} onPress={handleSignUp}>
                <Text style={globalStyles.buttonText}>{loading ? "Loading..." : "Sign Up"}</Text>
            </TouchableOpacity>

            <View >
                <Text style={[globalStyles.regularText, {textAlign: "center"}]} onPress={() => router.push("/login")}>
                    Already Have an Account ? 
                    <Text style={[{color: Colors.default.primary, fontFamily: fonts.semiBold}]}>
                        Login
                    </Text> 
                </Text>
            </View>

        </View>
    )
}