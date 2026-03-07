    import Chip from "@/components/Chip";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
                where("status", "==", "pending")
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
            }, (error) => {
                console.log(error.message)
            })

            return () => unsubscribe()
        }, [])

        const filteredRequests = requests
            .filter(r => selected === "All" || r.type === selected.toLowerCase())
            .filter(r => {
                const nameToSearch = r.student?.studentName ?
                    r.ngoName : "";
                return nameToSearch.toLowerCase().includes(searchText.toLowerCase());
            });

        const renderRequests = ({ item }) => {

            const isStudent = item.status === "student"

            if (isStudent) {
                return (
                    <TouchableOpacity 
                        style={styles.requestCard} 
                        onPress={() => 
                            router.push({
                                pathname: "/restuarant/home/request",
                                params: { 
                                    requestId: item.id,
                                    foods: JSON.stringify(item.foodItems),
                                    studentName: item.student?.studentName,
                                    totalPrice: item.totalPrice
                                }
                            })
                        }
                    >
                        <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>
                            {item.student?.studentName || "Unknown Student"}
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
                    >
                        <Image source={{uri: item.NGO?.imageUrl}}  />
                        <Text tyle={{fontSize: 20, fontFamily: fonts.semiBold}}>
                            {item.NGO?.name || "Unkown NGO"}
                        </Text>
                    </TouchableOpacity>
                )

            }
            
        };
        
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
                    <FlatList
                        data={requests}
                        renderItem={renderRequests}
                        keyExtractor={(item) => item.requestId}
                    >
                    </FlatList>
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
            marginBottom: 10
        }
    })