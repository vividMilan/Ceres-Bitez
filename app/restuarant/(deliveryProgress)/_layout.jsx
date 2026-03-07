import { db } from "@/firebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const statusToScreen = {
    "r-accepted": "progress2",
    "packed": "progress3",
    "rv-accepted": "map",
    "r-picked-up": "progress8",
};

export default function deliveryProgressLayout() {
    const { requestId } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!requestId) return;

        const unsubscribe = onSnapshot(
            doc(db, "requests", requestId),
            (docSnap) => {
                if (!docSnap.exists()) return;

                const currentStatus = docSnap.data().status;

                const screen = statusToScreen[currentStatus];

                if (screen) {
                    router.replace({
                        pathname: `/restuarant/(deliveryProgress)/${screen}`,
                        params: {
                            requestId: requestId,
                        },
                    });
                }
            },
        );

        return () => unsubscribe();
    }, [requestId]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="progress2" />
            <Stack.Screen name="progress3" />
            <Stack.Screen name="map" />
        </Stack>
    );
}
