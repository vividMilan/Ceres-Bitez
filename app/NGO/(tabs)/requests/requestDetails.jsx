import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function equestDetails() {

    const router = useRouter()

    const {
        requestId,
        homeName,
        homeImage,
        requestDate
    } = useLocalSearchParams();

    useEffect(() => {
        const checkStatus = async () => {
            const requestSnap = await getDoc(doc(db, "requests", requestId))

            const requestStatus = requestSnap.data().status

            if (requestStatus !== "n-accepted") {
                router.replace({
                    pathname: "/NGO/(deliveryProgress)",
                    params: {
                        requestId
                    }
                })
            }
        }

        checkStatus()
    }, [requestId])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Top Section */}
                <View>
                    <Image 
                        source={{ uri: homeImage }} 
                        style={{ width: "100%", height: 200 }} 
                    />
                    <Text style={[globalStyles.titleText, { textAlign: "center" }]}>
                        {homeName}
                    </Text>
                </View>

                {/* Middle + Bottom Section */}
                <View style={[globalStyles.container, { flex: 1, justifyContent: "space-between" }]}>
                    
                    <View>
                        <Text>
                            Date: {requestDate ? new Date(requestDate).toLocaleDateString() : "No Date"}
                        </Text>
                        <Text>Item: 30 Rice and Curry</Text>
                    </View>

                    <TouchableOpacity 
                        style={globalStyles.button}
                        onPress={() => router.push({
                            pathname: "/NGO/(tabs)/requests/availableRestuarants",
                            params: {
                                requestId: requestId
                            }
                        })}
                    >
                        <Text style={globalStyles.buttonText}>
                            Show Available Restaurants
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        </SafeAreaView>
    )
}