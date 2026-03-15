import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Text, View } from "react-native";
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

                <Text style={globalStyles.titleText}>Please Wait....</Text>

            </View>
        </SafeAreaView>
    )
}