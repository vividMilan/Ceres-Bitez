import Chip from "@/components/Chip";
import Spinner from "@/components/Spinner";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {

        const router = useRouter()
        const [loading, setLoading] = useState(false)
        const [searchText, setSearchText] = useState("");
        const [selected, setSelected] = useState("NGO");
        const [requests, setRequests] = useState([])

        useEffect(() => {
            const q = query(
                collection(db, "requests"),
                where("status", "in", ["n-requested", "pending"])
            )

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = []

                snapshot.forEach((doc) => {
                    data.push({
                        requestId: doc.id,
                        ...doc.data()
                    })
                })

                setRequests(data)

                console.log("aerawerlwekjlk: ", data)
                setLoading(false)
            }, (error) => {
                console.log(error.message)
                setLoading(false)
            }
        )

            return () => unsubscribe()
        }, [])

        const filteredRequests = requests
            .filter(r => (selected === "NGO" ? r.NGO : r.type === "student"))
            .filter(r => {
                const nameToSearch = 
                    r.type === "student"
                        ? r.student?.name || ""
                        : r.NGO?.name || ""
                return nameToSearch.toLowerCase().includes(searchText.toLowerCase())
        });

        const renderRequests = ({ item }) => {

            const isStudent = item.type === "student"

            if (isStudent) {
                return (
                    <TouchableOpacity 
                        style={styles.requestCard} 
                        onPress={() => 
                            router.push({
                                pathname: "/restuarant/home/studentRequest",
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
                );
            } else {

                return (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: "/restuarant/(tabs)/home/ngoRequest",
                                params: {
                                    requestId: item.requestId,
                                    name: item.NGO.name,
                                    imageUrl: item.NGO.imageUrl,
                                    date: JSON.stringify(item.date),
                                    quantity: item.qty,
                                    isVeg: item.veg,
                                    selectedFood: JSON.stringify(item.selectedFood),
                                    home: JSON.stringify(item.home)
                                }
                            })
                        }}

                        style={styles.requestCard}
                    >
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Text tyle={{fontSize: 20, fontFamily: fonts.semiBold}}>
                                {item.home?.name || "Unkown NGO"}
                            </Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Text tyle={{fontSize: 20, fontFamily: fonts.semiBold}}>
                                {item.home?.name || "Unkown NGO"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )

            }
            
        };

        if (loading) {
            return (
                <Spinner text="Loading Requests" />
            )
        }
        
        return (
            <SafeAreaView style={globalStyles.container}>
                <Text style={globalStyles.titleText}>
                    Pending Requests
                </Text>
                <View style={globalStyles.searchBoxRow}>
                    <FontAwesome name="search" size={24} color="black" />
                    <TextInput 
                        value={searchText}
                        onChangeText={setSearchText}
                        style={{color: "grey", width: "100%"}}
                        placeholder="Search for shops or food"
                    />
                </View>
                <View style={{width: "100%"}}>
                    <Chip 
                        options={["NGO", "Student"]}
                        selected={selected}
                        onPress={setSelected}
                    />
                </View>
                <View>

                    {
                        filteredRequests.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No {selected} Requests Yet
                                </Text>
                            </View>
                        ) : (

                            <FlatList
                                data={filteredRequests}
                                renderItem={renderRequests}
                                keyExtractor={(item) => item.requestId}
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>
                                            No {selected} Requests Yet
                                        </Text>
                                    </View>
                                }   
                            />
                        )
                
                    }

                </View>
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
});
    