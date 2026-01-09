import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";


const paymentMethods = [
    {
        name: "Sampath",
        cardNo: "xxxx8999",
        icon: <FontAwesome6 name="cc-visa" size={32} color="#1A1F71" />
    },
    {
        name: "Commercial",
        cardNo: "xxxx8779",
        icon: <FontAwesome6 name="cc-mastercard" size={32} color="#EB001B" />
    }

]


export default function CheckOut() {

    const { request } = useLocalSearchParams()

    const parsedRequest = JSON.parse(request)

    const [paymentMethod, setPaymentMethod] = useState("")
    const [finalRequest, setFinalRequest] = useState({})
    const [loading, setLoading] = useState(false)

    setFinalRequest(parsedRequest)

    const [isSelected, setIsSelected] = useState("")

    const handleRequestFood = async () => {
        try {
            setLoading(true)

            // const auth = getAuth()
            // const user = auth.currentUser

            const request = {
                ...finalRequest,
                payement: paymentMethod,
                studentID: "asdfasdfasdfasdfasdf"
            }

            await addDoc(collection(db), "requests", request)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[globalStyles.container]}>
            <PageTitleWithBackButton 
                heading={"Checkout"}
            />
            <View style={{display: "flex", gap: 10, marginBottom: 10}}>
                <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>
                    Order Details
                </Text>
                <View style={{display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#EBEBEB", padding: 10, borderRadius: 5}}>    
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={globalStyles.regularText}>Fish Rice & Curry</Text>
                            <Text style={globalStyles.regularText}>150.00</Text>
                        </View>
                    </View>
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={globalStyles.regularText}>Egg Hoppers</Text>
                            <Text style={globalStyles.regularText}>200.00</Text>
                        </View>
                    </View>
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={globalStyles.regularText}>Sub Total</Text>
                            <Text style={globalStyles.regularText}>150.00</Text>
                        </View>
                    </View>
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={{fontFamily: fonts.semiBold}}>Total</Text>
                            <Text style={{fontFamily: fonts.semiBold}}>150.00</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{display: "flex", gap: 10, marginBottom: 10}}>
                <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>
                    Payment Method
                </Text>
                <View style={{flexDirection: "row", gap: 10}}>
                    <TouchableOpacity onPressIn={() => setPaymentMethod("visa")} style={{display: "flex", gap: 5, alignItems: "center", borderColor: Colors.default.primary, borderWidth: 2, width: 120, height: 100, justifyContent: "center", borderRadius: 10, backgroundColor: isSelected == "visa" ? "rgba(102, 80, 164, 0.20)" : "transparent" }} onPress={() => setIsSelected("visa")}>
                        <FontAwesome6 name="cc-visa" size={32} color="#1A1F71" />
                        <Text style={globalStyles.regularText}>
                            xxx945
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={() => setPaymentMethod("mastercard")} style={{display: "flex", gap: 5, alignItems: "center", borderColor: Colors.default.primary, borderWidth: 2, width: 120, height: 100, justifyContent: "center", borderRadius: 10, backgroundColor: isSelected === "mc" ? "rgba(102, 80, 164, 0.20)" : "transparent" }} onPress={() => setIsSelected("mc")}>
                        <FontAwesome6 name="cc-mastercard" size={32} color="#EB001B" />
                        <Text style={globalStyles.regularText}>
                            xxx945
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={handleRequestFood} style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>{loading ? "Requesting" : "Request Food"}</Text>
            </TouchableOpacity>
        </View>
    )
}