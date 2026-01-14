import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function index() {

    const [date, setDate] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [qty, setQty] = useState()
    const [vegOrNonVeg, setVegOrNonVeg] = useState(null)
    const router = useRouter()

    const today = new Date()

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    }

    const requestFood = async (item) => {

        const newRequestRef = doc(collection(db, "requests"))

        await setDoc(newRequestRef, {
            homeID: "uwgh6m1Q510uvx15Vxm8",
            qty: item.qty,
            veg: item.vegOrNonVeg === "veg" ? true : false,
            date: item.date
        })

        console.log("Add Successfully")
        Alert.alert("Request Submitted Successfully")
    }

    
    const handleAddRequest = async () => {
        
        // setLoading(true)
        // const request = {
        //     qty: qty,
        //     vegOrNonVeg: vegOrNonVeg,
        //     date: date
        // }
        // try {
        //     requestFood(request)
        // } catch (error) {
        //     console.log(error)
        // } finally {
        //     setLoading(false)
        // }

        router.navigate("/home/(tabs)/request/(deliveryProgress)/progress5")




    }


    return  (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Request Food</Text>
            <TextInput 
                style={globalStyles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                onChangeText={setQty}
            />
            <View style={globalStyles.dropDownContainer}>
                <Picker onValueChange={(value) => setVegOrNonVeg(value)}>
                    <Picker.Item label="Select Food Type" value="" style={Colors.default.inputText}/>
                    <Picker.Item label="Veg" value="veg" />
                    <Picker.Item label="Non-Veg" value="non-veg" />
                </Picker>
            </View>
            <TouchableOpacity onPress={() => setShow(true)} style={[globalStyles.input, globalStyles.flexDisplay]} >
                <Text style={[globalStyles.regularText, {color: Colors.default.inputText}]}>date</Text>
                <Entypo name="calendar" size={16} />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={date}
                    mode="date" 
                    onChange={onChange}
                    minimumDate={today}
                />
            )}
            
            <TouchableOpacity onPress={handleAddRequest} style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>{loading ? "Processing..." : "Submit Request"}</Text>
            </TouchableOpacity>
        </View>
    )
}