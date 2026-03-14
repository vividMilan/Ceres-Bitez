import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function index() {
    const [requests, setRequests] = useState([]);

    const router = useRouter();

    // fetch all requests
    useEffect(() => {
        const q = query(
            collection(db, "requests"),
            where("type", "==", "home"),
            where("status", "==", "pending"),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setRequests(data);
        });

        return () => unsubscribe();
    }, []);

    const renderRequest = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.shopCard}
                onPress={() =>
                    router.push({
                        pathname: "/NGO/(tabs)/home/pendingRequest",
                        params: {
                            requestId: item.id,
                            homeId: item.home?.homeID,
                            homeName: item.home?.name,
                            homeLocation: item.home?.location,
                            requestDate: item.date,
                        },
                    })
                }
            >
                <View style={styles.title}>
                    <Text style={styles.shopName}>{item.home?.name}</Text>
                </View>
                <View style={styles.ratingRow}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Entypo name="location-pin" size={16} color="black" />
                        <Text
                            style={{
                                color: "black",
                                fontFamily: fonts.semiBold,
                            }}
                        >
                            {item.home?.city}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Entypo name="calendar" size={16} color="black" />
                        <Text style={{ color: "#565556D" }}>
                            {item.date
                                ? item.date.toDate().toLocaleDateString()
                                : "No Date"}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaProvider style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Pending Queue</Text>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={renderRequest}
            />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    shopCard: {
        backgroundColor: "#D9D9D9",
        flexDirection: "column",
        width: "100%",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    shopName: {
        fontSize: 18,
        fontFamily: fonts.semiBold,
    },
    title: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
});
