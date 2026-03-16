import { getUserData } from "@/app/(auth)/authController/authMethods";
import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    addDoc,
    collection,
    doc,
    GeoPoint,
    getDoc,
    serverTimestamp
} from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const paymentMethods = [
    {
        name: "Sampath",
        cardNo: "xxxx8999",
        icon: <FontAwesome6 name="cc-visa" size={32} color="#1A1F71" />,
    },
    {
        name: "Commercial",
        cardNo: "xxxx8779",
        icon: <FontAwesome6 name="cc-mastercard" size={32} color="#EB001B" />,
    },
];

export default function CheckOut() {
    const { shopId, shopName, location, request, city, address } = useLocalSearchParams();

    const {userData, loading: userDataLoading} = getUserData()  

    const parsedRequest = JSON.parse(request) || [];
    const parsedLocation = JSON.parse(location) || [];

    const [paymentMethod, setPaymentMethod] = useState("");
    const [finalRequest, setFinalRequest] = useState({});
    const [loading, setLoading] = useState(false);

    const [isSelected, setIsSelected] = useState("");

    const router = useRouter()

    const handleRequestFood = async () => {
        try {
            setLoading(true);

            const parsedLocation = JSON.parse(location)

            const restaurantRef = doc(db, "restaurant", shopId);
            const restaurantSnap = await getDoc(restaurantRef);

            const restuarantData = restaurantSnap.data()

            console.log("restuarantData", shopId)

            const totalPrice = parsedRequest.reduce((sum, item) => {
                return sum + item.price * item.qty;
            }, 0);

            const requestData = {
                student: {
                    ...userData,
                    location: new GeoPoint(
                        parsedLocation.latitude,
                        parsedLocation.longitude
                    )
                },
                restuarant: {
                    restuarantId: restaurantSnap.id,
                    ...restuarantData
                },
                foodItems: parsedRequest,
                paymentMethod: paymentMethod,
                status: "pending",
                type: "student",
                totalPrice: totalPrice,
                createdAt: serverTimestamp(),
                city: city,
                address: address
            };

            await addDoc(collection(db, "requests"), requestData);

            Alert.alert("Successfuly Requested");
            router.replace("/student/(tabs)/home")
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (userDataLoading) {
        return (
            <ActivityIndicator size={"large"}/>
        )
    }

    return (
        <SafeAreaView style={[globalStyles.container]}>
            <PageTitleWithBackButton heading={"Checkout"} />
            <View style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <Text style={{ fontFamily: fonts.semiBold, fontSize: 20 }}>
                    Order Details
                </Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        backgroundColor: "#EBEBEB",
                        padding: 10,
                        borderRadius: 5,
                    }}
                >
                    {parsedRequest.map((item) => (
                        <View key={item.id}>
                            <View style={globalStyles.spaceBetween}>
                                <Text style={globalStyles.regularText}>
                                    {item.name}
                                </Text>
                                <Text style={globalStyles.regularText}>
                                    {(item.price * item.qty).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <Text style={{ fontFamily: fonts.semiBold, fontSize: 20 }}>
                    Payment Method
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity
                        onPressIn={() => setPaymentMethod("visa")}
                        style={{
                            display: "flex",
                            gap: 5,
                            alignItems: "center",
                            borderColor: Colors.default.primary,
                            borderWidth: 2,
                            width: 120,
                            height: 100,
                            justifyContent: "center",
                            borderRadius: 10,
                            backgroundColor:
                                isSelected == "visa"
                                    ? "rgba(102, 80, 164, 0.20)"
                                    : "transparent",
                        }}
                        onPress={() => setIsSelected("visa")}
                    >
                        <FontAwesome6
                            name="cc-visa"
                            size={32}
                            color="#1A1F71"
                        />
                        <Text style={globalStyles.regularText}>xxx945</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPressIn={() => setPaymentMethod("mastercard")}
                        style={{
                            display: "flex",
                            gap: 5,
                            alignItems: "center",
                            borderColor: Colors.default.primary,
                            borderWidth: 2,
                            width: 120,
                            height: 100,
                            justifyContent: "center",
                            borderRadius: 10,
                            backgroundColor:
                                isSelected === "mc"
                                    ? "rgba(102, 80, 164, 0.20)"
                                    : "transparent",
                        }}
                        onPress={() => setIsSelected("mc")}
                    >
                        <FontAwesome6
                            name="cc-mastercard"
                            size={32}
                            color="#EB001B"
                        />
                        <Text style={globalStyles.regularText}>xxx945</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleRequestFood}
                style={[globalStyles.button, { marginTop: "auto" }]}
            >
                <Text style={globalStyles.buttonText}>
                    {loading ? "Requesting" : "Request Food"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
