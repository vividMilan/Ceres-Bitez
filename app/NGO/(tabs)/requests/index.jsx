import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ongoingStatuses = [
    "n-accepted",
    "n-requested",
    "r-accepted",
    "packed",
    "rv-accepted",
    "r-picked-up",
    "checking",
    "prepared", 
    "nv-accepted"
];


export default function index() {
    const [requests, setRequests] = useState([])
    const [search, setSearch] = useState("")

    const router = useRouter()

    const filteredRequests = requests.filter((item) => 
        (item.home?.name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    // fetch all requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const q = query(
                    collection(db, "requests"),
                    where("type", "==", "home"),
                    where("status", "in", ongoingStatuses)
                )

                const snapshot = await getDocs(q)

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setRequests(data)
            } catch (error) {
                console.log("Error while fetching requests: ", error)
            }
        }

        fetchRequests()
    }, [])

    const renderRequest = ({ item }) => {
        return (
                <TouchableOpacity 
                    style={styles.shopCard}
                    key={item.id}
                    onPress={() => router.push({
                        pathname: "/NGO/(tabs)/requests/requestDetails",
                        params: {
                            requestId: item.id,
                            homeId: item.home?.homeID,
                            homeName: item.home?.name,
                            homeImage: item.home?.image,
                            homeLocation: item.homeData?.location,
                            requestDate: item.date
                        }
                    })}
                >
                    <View style={styles.title}>
                        <Text style={styles.shopName}>{item.home?.name}</Text>
                    </View>
                    <View style={styles.ratingRow}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                            <Entypo name="location-pin" size={16} color="black" />
                            <Text style={{color: "black", fontFamily: fonts.semiBold}}>{item?.home?.city}</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                            <Entypo name="calendar" size={16} color="black" />
                            <Text style={{ color: "#565556D" }}>
                                {item.date ? item.date.toDate().toLocaleDateString() : "No Date"}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.searchBoxRow}>
                <Entypo name="magnifying-glass" size={30} color="#777" />
                <TextInput
                    placeholder="Search home..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <Text style={globalStyles.titleText}>Accepted Queue</Text>

            {
                filteredRequests.length === 0  ? (
                    
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {search ? "No Homes match your search" : "No Accepted Requests"}
                        </Text>
                    </View>

                ) : (
                    <FlatList 
                        data={filteredRequests}
                        keyExtractor={(item) => item.id}
                        renderItem={renderRequest}
                    />
                )
            
            }

        </SafeAreaView>
        
    )
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
    emptyContainer: {
        marginTop: 60,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    emptyText: {
        fontSize: 16,
        color: "#777",
        fontFamily: fonts.regular,
    },
});
