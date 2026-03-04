import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function pendingRequest() {
    const router = useRouter();

    const { requestId, homeName, homeImage, requestDate } =
        useLocalSearchParams();

    const getNGODetails = async (NGOId) => {
        try {
            const NGOSnap = await getDoc(doc(db, "ngo", NGOId));

            const NGO = NGOSnap.data();

            return NGO;
        } catch (error) {}
    };

    const handleAcceptRequest = async () => {
        try {
            const requestRef = doc(db, "requests", requestId);

            const NGO = await getNGODetails("uwgh6m1Q510uvx15Vxm8");

            await updateDoc(requestRef, {
                status: "n-accepted",
                NGO: NGO,
            });

            router.push({
                pathname: "/NGO/requests/availableRestuarants",
                params: {
                    requestId: requestId,
                },
            });
        } catch (error) {}
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {/* Top Section */}
                <View>
                    <Image
                        source={{ uri: homeImage }}
                        style={{ width: "100%", height: 200 }}
                    />
                    <Text
                        style={[
                            globalStyles.titleText,
                            { textAlign: "center" },
                        ]}
                    >
                        {homeName}
                    </Text>
                </View>
                {/* Middle + Bottom Section */}
                <View
                    style={[
                        globalStyles.container,
                        { flex: 1, justifyContent: "space-between" },
                    ]}
                >
                    <View>
                        <Text>
                            Date:{" "}
                            {requestDate
                                ? new Date(requestDate).toLocaleDateString()
                                : "No Date"}
                        </Text>
                        <Text>Item: 30 Rice and Curry</Text>
                    </View>

                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={handleAcceptRequest}
                    >
                        <Text style={globalStyles.buttonText}>
                            Accept Request
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
