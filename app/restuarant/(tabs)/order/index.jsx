import Chip from "@/components/Chip";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";

const progressStatus = [
    "r-accepted",
    "packed",
    "rv-accepted",
]

export default function Index() {

    const router = useRouter()

    const [requests, setRequests] = useState([])
    const [selected, setSelected] = useState("ngo")

    const filteredRequests = requests
        .filter(r => r.type === selected)

    useEffect(() => {
        const q = query(
            collection(db, "requests"),
            where("status", "in", progressStatus),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(q, (snapShot) => {
            const data = []

            snapShot.forEach((doc) => {
                data.push({
                    requestId: doc.id,
                    ...doc.data()
                })
            })

            setRequests(data)
        }, (error) => {
            console.log(error.message)
        })

        return () => unsubscribe()
    }, [])

    const renderRequest = ({item}) => {

        const isStudent =  item.type === "student"

        if (isStudent) {
            return (
                <TouchableOpacity 
                        style={styles.requestCard} 
                        onPress={() => 
                            router.push({
                                pathname: "/restuarant/(deliveryProgressStudent)/",
                                params: { 
                                    requestId: item.requestId
                                }
                            })
                        }
                    >
                        <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>
                            {item.student?.name || "Unknown Student"}
                        </Text>
    
                        {item.foodItems?.map((food, index) => (
                            <Text key={index} style={globalStyles.regularText}>
                                {food.name} x {food.qty}
                            </Text>
                        ))}
    
                        <Text style={{fontSize: 24, fontFamily: fonts.semiBold, marginTop: 5}}>
                            Rs. {item.totalPrice || 0}
                        </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => {
                        router.push({
                            pathname: "/restuarant/(deliveryProgress)/",
                            params: {
                                requestId: item.requestId,
                            }
                        })
                    }}
    
                    style={{
                        width: "100%",
                        backgroundColor: "#d9c7f2",
                        padding: 24,
                        borderRadius: 34
                    }}
                >
                    <Image source={{uri: item.NGO?.imageUrl}} style={{width: "100%", height: 150, marginBottom: 10, borderRadius: 20}}  />
                    <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>
                        {item.NGO?.name || "Unkown NGO"}
                    </Text>
                </TouchableOpacity>
            )
        }

    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.titleText}>
                Ongoing Requests
            </Text>
            <Chip 
                options={["NGO", "Student"]}
                selected={selected === "ngo" ? "NGO" : "Student"}
                onPress={(value) => setSelected(value.toLowerCase())}
            />

            {
                filteredRequests.length === 0 ? (

                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No Ongoing {selected} Requests
                        </Text>
                    </View>

                ) : (
                    <FlatList 
                        data={filteredRequests}
                        keyExtractor={(item) => item.requestId}
                        renderItem={renderRequest}
                    />
                )
            }

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    requestCard: {
        display: "flex",
        gap: 2,
        backgroundColor: Colors.default.greyBackground,
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        gap: 10,
    },

    emptyText: {
        fontSize: 18,
        color: "gray",
        fontFamily: fonts.regular,
    },
})