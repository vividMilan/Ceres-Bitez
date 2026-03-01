import { db } from "@/firebaseConfig";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const statusToScreen = {
    "n-accepted": "waitingForRestuarant",
    "r-accepted": "beingPacked",
    "packed": "waitingForVolunteer", 
    "rv-accepted": "map",
    "r-picked-up": "map",
    "checking" : "beingChecked",
    "prepared" : "waitingForVolunteer2", 
    "nv-accepted": "map",
    "delivered": "delivered"
};

export default function ProgressLayout() {
    const { requestId } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!requestId) return;

        const unsubscribe = onSnapshot(doc(db, "requests", requestId), (docSnap) => {
            if (!docSnap.exists()) return;

            const currentStatus = docSnap.data().status;
            const screen = statusToScreen[currentStatus];

            if (screen) {
                // replace ensures the user can't "go back" to an old status
                router.replace(`/home/(deliveryProgress)/${screen}?requestId=${requestId}`);
            }
        });

        return () => unsubscribe();
    }, [requestId]);

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="waitingForRestuarant" />
            <Stack.Screen name="beingPacked" />
            <Stack.Screen name="onWayToRestuarant" />
            <Stack.Screen name="checkingFood" />
        </Stack>
    );
}