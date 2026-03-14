import { db } from "@/firebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const statusToScreen = {
    "r-accepted": "progress2",
    "packed": "progress3",
    "v-accepted": "map",
    "picked": "map",
    "delivered": "progress8"
}


export default function deliverProgressLayout() {

    const {requestId} = useLocalSearchParams()

    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "requests", requestId),
            (snapshot) => {
                if (!snapshot.exists()) return

                const currentStatus = snapshot.data().status

                const screen = statusToScreen[currentStatus]

                if (screen) {
                    router.replace({
                        pathname: `/restuarant/(deliveryProgressStudent)/${screen}`,
                        params: {
                            requestId: requestId
                        }
                    })
                } 
            }
        )

        return () => unsubscribe()


    }, [requestId])

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="progress2" />
            <Stack.Screen name="progress3" />
            <Stack.Screen name="progress8" />
            <Stack.Screen name="map" />
        </Stack>
    )

}