import { fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import { supabase } from "@/supabaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const preference = [
    "Non-Veg",
    "Veg"
]

export default function Index() {

    

    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState(null)
    const [vegNonVeg, setVegNonVeg] = useState("")
    const [loading, setLoading] = useState(false)
    const [imageUri, setImageUri] = useState(null);
    const [price, setPrice] = useState(null)

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()

        if (status !== "granted") {
            Alert.alert("Camera Permission Requred")
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            allowsEditing: true,
            quality: 0.8
        })

        if (!result.canceled){
            setImageUri(result.assets[0].uri)
        }
    };


    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (status !== "granted") {
            Alert.alert("Gallery Permission Required")
            return
        }

        const results = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8
        })

        if (!results.canceled) {
            setImageUri(results.assets[0].uri)
        }

    }

    const selectImage = () => {
        Alert.alert(
            "Select Image",
            "Choose the source for image",
            [
                {
                    text: "Camera",
                    onPress: openCamera
                },
                {
                    text: "Gallery",setQuantity,
                    onPress: openGallery
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ],
            {cancelable: true}
        )
    }

    const uploadImage = async () => {
        if (!imageUri) {
            return
        }

        const fileExtension = imageUri.split(".").pop()
        const fileName = `food_${Date.now()}.${fileExtension}`
        const filePath = `foods/${fileName}`

        // convert to blob
        const response = await fetch(imageUri)
        const blob = await response.arrayBuffer()

        const { error } = await supabase.storage
            .from("food-images")
            .upload(filePath, blob, {
                contentType: "image/jpeg",
                upsert: true
            })

        if (error) throw error

        // Get public url
        const {data} = supabase.storage
            .from("food-images")
            .getPublicUrl(filePath)

        return data.publicUrl


    }

    const handleAddFood = async () => {
        setLoading(true)
        try {
            const restuarantId = "7ADL1PRfW0V6deM9bR2UjxdSXS72"

            const imageUrl = await uploadImage(imageUri)
            const notSuitableAt = Timestamp.fromMillis(Date.now() + 3 * 60 * 60 * 1000)

            await addDoc(collection(db, "foods"), {
                name,
                quantity: Number(quantity),
                vegNonVeg,
                restuarantId,
                imageUrl,
                createdAt: serverTimestamp(),
                notSuitableAt,
                unitPrice: Number(price)
            })


            Alert.alert("Food Added Sucessfully")

            setName("")
            setQuantity(null)
            setVegNonVeg("")
            setImageUri(null)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
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
                keyboardType="numeric"
            />

            <TextInput 
                style={globalStyles.input}
                placeholder="Set Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            <Pressable style={styles.cameraClick} onPress={selectImage}>

                {imageUri ? 
                
                    <Image
                        source={{uri : imageUri}}
                        resizeMode="cover"
                        style={{width: 100, height: 100}}
                    />
                    :
                    <Entypo name="camera" size={72} color={Colors.default.inputText}/>
                }
                <Text style={{fontSize: fontSizes.regular, color: Colors.default.inputText}}>Upload Food Picture</Text>
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

            <TouchableOpacity onPress={handleAddFood} style={[globalStyles.button, {marginTop: "auto"}]}>
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