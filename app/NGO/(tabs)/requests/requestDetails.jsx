import Spinner from "@/components/Spinner";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function equestDetails() {

    const router = useRouter()

    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        const fetchRequest = async () => {

            if (!requestId) return

            try {
                const requestSnap = await getDoc(doc(db, "requests", requestId))

                const data = {
                    requestId: requestSnap.id,
                    ...requestSnap.data()
                }

                setRequest(data)
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRequest()
    }, [requestId])

    if (loading) {
        return (
            <Spinner />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Top Section */}
                <View>
                    <Text style={[globalStyles.titleText, { textAlign: "left" }]}>
                        {homeName}
                    </Text>
                </View>

                {/* Middle + Bottom Section */}
                <View style={[globalStyles.container, { flex: 1, justifyContent: "space-between" }]}>
                    
                    <View>
                        <View style={{gap: 16}}>
                            <View style={globalStyles.flexDisplay}>
                                <FontAwesome name="home" size={24} color="black" />
                                <Text style={[fonts.regular, {fontSize: 20}]}>{request?.home?.name}</Text>
                            </View>
                            <View style={globalStyles.flexDisplay}>
                                <FontAwesome name="calendar" size={24} color="black" />
                                <Text style={[fonts.regular, {fontSize: 20}]}>
                                    {request?.date?.toDate
                                        ? request.date.toDate().toLocaleDateString()
                                        : "No date"
                                    }
                                </Text>
                            </View>
                            <View style={globalStyles.flexDisplay}>
                                <FontAwesome6 name="location-dot" size={24} color="black" />
                                <Text style={[fonts.regular, {fontSize: 20}]}>{request?.home?.city}</Text>
                            </View>
                            <View style={globalStyles.flexDisplay}>
                                <FontAwesome5 name="pen" size={24} color="black" />
                                <Text style={[fonts.regular, {fontSize: 20}]}>{request?.description}</Text>
                            </View>
                        </View>
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