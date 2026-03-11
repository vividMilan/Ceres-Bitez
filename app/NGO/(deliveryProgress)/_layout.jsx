import { db } from "@/firebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const statusToScreen = {
    "n-requested": "progress1",
    "r-accepted": "progress2",
    "packed": "progress3",
    "rv-accepted": "progress4",
    "r-picked-up": "progress4",
    "checking": "progress5",
    "prepared": "progress3_2",
    "nv-accepted": "progress4",
    "delivered": "progress8",
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
                        pathname: `/NGO/(deliveryProgress)/${screen}`,
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
            <Stack.Screen name="progress1" />
            <Stack.Screen name="progress2" />
            <Stack.Screen name="progress3" />
            <Stack.Screen name="progress4" />
            <Stack.Screen name="progress5" />
            <Stack.Screen name="progress8" />
        </Stack>
    );
}
