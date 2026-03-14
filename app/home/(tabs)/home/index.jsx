import Chip from "@/components/Chip";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const requestStatus = ["Ongoing", "Pending"];

const homeDetails = {
    name: "Suhhinda Elders Home",
    address: "123, Main Street, City",
    location: "Mirihana",
};

const ongoingStatuses = [
    "n-accepted",
    "r-accepted",
    "packed", 
    "rv-accepted",
    "r-picked-up",
    "checking",
    "prepared", 
    "nv-accepted",
    "delivered"
];

export default function index() {
    const router = useRouter()
    const [selected, setSelected] = useState("Ongoing");
    const [requests, setRequests] = useState([]);

    const renderRequest = ({ item }) => {
        // Safely convert Firestore timestamp to JS Date
        
        const requestDate = item.date?.toDate ? item.date.toDate() : new Date(item.date);

        const isPending = item.status === "pending"

        if (isPending) {

            return (
                <TouchableOpacity
                    style={styles.shopCard}
                >
                    <View style={styles.ratingRow}>
                        <AntDesign name="hourglass" size={16} color="black" />
                        <Text>Pending Request</Text>
                    </View>
                    <View style={styles.ratingRow}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                            <MaterialIcons name="group" size={16} color="black" />
                            <Text style={{ color: "black", fontFamily: fonts.semiBold }}>{item.qty || 0}</Text>
                        </View>
    
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                            <Entypo name="calendar" size={16} color="black" />
                            <Text style={{ color: "#565556D" }}>
                                {requestDate.toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                </TouchableOpacity>
            )

        } else {
            return (
                <TouchableOpacity 
                    style={styles.shopCard}
                    onPress={() => handleRequestClick(item)}
                >
                    <Image 
                        source={{ uri: item.image || "https://via.placeholder.com/400x200" }} 
                        style={{ width: "100%", height: 200, borderRadius: 5 }} 
                    />
    
                    <View style={styles.title}>
                        <Text style={styles.shopName}>{item.ngo || "Unknown NGO"}</Text>
                    </View>
    
                    <View style={styles.ratingRow}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                            <MaterialIcons name="group" size={16} color="black" />
                            <Text style={{ color: "black", fontFamily: fonts.semiBold }}>{item.qty || 0}</Text>
                        </View>
    
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                            <Entypo name="calendar" size={16} color="black" />
                            <Text style={{ color: "#565556D" }}>
                                {requestDate.toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

    };


    useEffect(() => {

        let q;

        if (selected === "Ongoing") {
            q = query(
                collection(db, "requests"),
                where("type", "==", "home"),
                where("status", "in", ongoingStatuses),
                orderBy("createdAt", "desc")
            );
        } else {
            q = query(
                collection(db, "requests"),
                where("type", "==", "home"),
                where("status", "==", selected.toLocaleLowerCase()), // for other sections
                orderBy("createdAt", "desc")
            );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log(fetchedRequests)

            setRequests(fetchedRequests);
        });

        return () => unsubscribe();
    }, [selected]);


   const handleRequestClick = (request) => {
        if (request.status === "pending") {
            console.log("This request is pending");
        } else if (request.status === "assigned") {
            console.log("This request is assigned");
        } else if (ongoingStatuses.includes(request.status)) {
            router.push({
                pathname: "/home/(deliveryProgress)",
                params: {status: request.status, requestId: request.id}
            })
        } else {
            console.log(`Unknown status: ${request.status}`);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>{homeDetails.name}</Text>
            <Text style={globalStyles.subTitleText}>{selected} Orders</Text>
            <View>
                <Chip
                    options={requestStatus}
                    selected={selected}
                    onPress={setSelected}
                />
            </View>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={renderRequest}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    shopCard: {
        backgroundColor: "#D9D9D9",
        flexDirection: "column",
        width: "100%",
        height: "fit-content",
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
