import { fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import { Picker } from "@react-native-picker/picker";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const preference = [
    "Non-Veg",
    "Veg"
]

const description = [
    "Healthy",
     "Fast Food",
]



export default function Index() {

    

    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState(null)
    const [vegNonVeg, setVegNonVeg] = useState("")
    const [foodPreference, setFoodPreference] = useState("")
    const [loading, setLoading] = useState(false)
    const [imageUri, setImageUri] = useState(null);

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

    const handleFoodAdd = async () => {
        // Logic to handle adding food item

        if (!name || !quantity || !vegNonVeg || !foodPreference) {
            Alert.alert("Please fill all the fields");
            return;
        }

        setLoading(true);

        // Simulate API call
        try {
            const auth = getAuth();
            const user = auth.currentUser

            await addDoc(collection(db, "foods"), {
                name,
                quantity,   
                vegNonVeg,
                foodPreference,
                restuarantID: user.uid,
                createdAt: serverTimestamp(),
                imageUri: imageUri ?? 
                "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
            })

            Alert.alert("Food added successfully");

            // Clear form
            setName("");
            setQuantity(null);
            setVegNonVeg("");
            setFoodPreference("");
            setImageUri(null);
            
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
        

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>
                Add Food
            </Text>

            <TextInput 
                style={globalStyles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput 
                style={globalStyles.input}
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
            />

            <Pressable style={styles.cameraClick} onPress={openCamera}>
                <Entypo name="camera" size={72} color={Colors.default.inputText}/>
                <Text style={{fontSize: fontSizes.regular, color: Colors.default.inputText}}>Student Record Book</Text>
            </Pressable>


            <View style={styles.dropDownContainer}>
                <Picker
                    selectedValue={vegNonVeg}
                    onValueChange={(value) => setVegNonVeg(value)}
                >
                    <Picker.Item style={{color: Colors.default.inputText}} label="Veg / Non-Veg"  />

                        {preference.map((item, index) => (
                            <Picker.Item
                                key={index}
                                label={item}
                                value={item}
                            />
                        ))}
                </Picker>
            </View>

            <View style={styles.dropDownContainer}>
                <Picker
                    selectedValue={foodPreference}
                    onValueChange={(value) => setFoodPreference(value)}
                >
                    <Picker.Item style={{color: Colors.default.inputText}} label="Preference" value="" />

                        {description.map((item, index) => (
                            <Picker.Item
                                key={index}
                                label={item}
                                value={item}
                            />
                        ))}
                </Picker>
            </View>

            <TouchableOpacity onPress={handleFoodAdd} style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>{loading ? "Adding Food..." : "Add Food"}</Text>
            </TouchableOpacity>
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