import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    doc,
    GeoPoint,
    getDoc,
    onSnapshot,
    updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function studentRequest() {
    const student_pic = require("../../../../assets/images/student_pic.png");
    const [requests, setRequest] = useState(null)
    const [loading, setLoading] = useState(false);
    const { requestId } = useLocalSearchParams()
    const [currentLocation, setCurrentLocation] = useState(null)

    const router = useRouter()
        
    useEffect(() => {
        try {
            const docRef = doc(db, "requests", requestId)


            const unsubscribe = onSnapshot(docRef, (snapshot) => {

                if (!snapshot.exists()) return;

                const data = {
                    requestId: snapshot.id,
                    ...snapshot.data()
                }

                setRequest(data)

                console.log(data)

            })

            return() => unsubscribe()

        } catch (error) {
            console.log(error.message)
        }
    }, [requestId])

    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                const {status} = await Location.getForegroundPermissionsAsync()

                if (status !== "granted") {
                    Alert.alert("Location Permission is required")
                    return
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                })

                const {latitude, longitude} = location.coords

                setCurrentLocation({latitude, longitude})
            } catch (error) {
                console.log(error.message)
            }
        }

        getCurrentLocation()
    }, [])

    const parsedFoods = requests?.foodItems || []
    const totalPrice = requests?.totalPrice || 0

    const handleRequest = async () => {
        try {

            if (!currentLocation) {
                Alert.alert("Location is not ready")
                return
            }
            setLoading(true);

            for (const food of parsedFoods) {
                const foodRef = doc(db, "foods", food.id);
                const foodSnap = await getDoc(foodRef);

                if (foodSnap.exists()) {
                    await updateDoc(foodRef, {
                        quantity: Math.max(
                            0,
                            foodSnap.data().quantity - food.qty,
                        ),
                    });
                }
            }

            if (requestId) {
                const requestRef = doc(db, "requests", requestId);
                await updateDoc(requestRef, {
                    status: "r-accepted",
                    "restuarant.location": new GeoPoint(
                        currentLocation.latitude,
                        currentLocation.longitude
                    )
                });
            }

            Alert.alert("Request Accepted Succefully !!!!");
            router.replace("/restuarant/(tabs)/order")
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!requests) return null

    return (
        <SafeAreaView style={globalStyles.container}>
            <PageTitleWithBackButton heading={"Back"} />

            <View style={[globalStyles.flexDisplay, { marginBottom: 20 }]}>
                <Image
                    source={student_pic}
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                />
                <Text style={[{ fontSize: 20, fontFamily: fonts.semiBold }]}>
                    {requests.student?.name || "Unknown Student"}
                </Text>
            </View>
            <Text style={{ fontSize: 20, fontFamily: fonts.semiBold }}>
                Order Details
            </Text>
            <View
                style={{
                    backgroundColor: Colors.default.greyBackground,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    gap: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                }}
            >
                {parsedFoods.map((food, index) => (
                    <View key={index} style={[globalStyles.spaceBetween]}>
                        <Text style={globalStyles.regularText}>
                            {food.name}
                        </Text>
                        <Text style={globalStyles.regularText}>
                            {food.qty} x {food.price}
                        </Text>
                    </View>
                ))}
                <View style={[globalStyles.spaceBetween]}>
                    <Text
                        style={[
                            globalStyles.regularText,
                            { fontFamily: fonts.semiBold },
                        ]}
                    >
                        Total
                    </Text>
                    <Text
                        style={[
                            globalStyles.regularText,
                            { fontFamily: fonts.semiBold },
                        ]}
                    >
                        {totalPrice}
                    </Text>
                </View>
            </View>

            <View style={globalStyles.spaceBetween}>
                <Text style={{fontFamily: fonts.semiBold}}>Location : </Text>
                <View>
                    <Text style={{fontFamily: fonts.semiBold}}>
                        {requests.address}, {requests.city}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleRequest}
                style={[globalStyles.button, { marginTop: "auto" }]}
            >
                <Text style={globalStyles.buttonText}>
                    {loading ? "Processing..." : "Accept"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    requestCard: {
        display: "flex",
        gap: 2,
        backgroundColor: Colors.default.greyBackground,
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
});
