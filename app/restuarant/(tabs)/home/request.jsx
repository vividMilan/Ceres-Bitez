import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function request() {
    const student_pic = require("../../../../assets/images/student_pic.png");
    const { studentName, foods, totalPrice, requestId } =
        useLocalSearchParams();

    const parsedFoods = JSON.parse(foods);
    const [loading, setLoading] = useState(false);

    // const reduceQty = async (parsedFoods) => {
    //     try {
    //         parsedFoods
    //     } catch (error) {
    //         throw error
    //     }
    // }

    const handleRequest = async () => {
        try {
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
                const requestRef = doc(db, "studentRequests", requestId);
                await updateDoc(requestRef, {
                    status: "r-accepted",
                });
            }

            Alert.alert("Request Accepted Succefully !!!!");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const summa = async () => {
            const request = await getDocs(
                query(
                    collection(db, "studentRequests"),
                    where("__name__", "==", requestId),
                ),
            );

            console.log(request.docs.map((doc) => doc.data().__name__));
        };

        summa();
    }, []);

    return (
        <SafeAreaView style={globalStyles.container}>
            <PageTitleWithBackButton heading={"Back"} />

            <View style={[globalStyles.flexDisplay, { marginBottom: 20 }]}>
                <Image
                    source={student_pic}
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                />
                <Text style={[{ fontSize: 20, fontFamily: fonts.semiBold }]}>
                    {studentName}
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

            {/* <View style={globalStyles.spaceBetween}>
                <Text style={{fontFamily: fonts.semiBold}}>Location (20 mins)</Text>
                <View>
                    <Text style={{fontFamily: fonts.semiBold}}>
                        Nawala
                    </Text>
                </View>
            </View> */}

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
