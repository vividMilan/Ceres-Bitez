import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function index() {

    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true)
    const [requests, setRequests] = useState([])

    const NGOImage = require("../../assets/images/NGO/image.png")


useEffect(() => {
    const fetchRequests = async () => {
        try {
            setLoading(true)
            const querySnapshot = await getDocs(collection(db, "requests"));
            const homeListsSnapshot = await getDocs(collection(db, "home"));

            const homeLists = [];
            homeListsSnapshot.forEach((doc) => {
                homeLists.push({ id: doc.id, ...doc.data() });
            });

            const requestsData = [];
            querySnapshot.forEach((doc) => {
                requestsData.push(
                    { 
                        id: doc.id,
                        homeData: homeLists.find(home => home.id === doc.data().homeID), 
                        ...doc.data()
                    }
                );
            });

            setRequests(requestsData);

            console.log("Fetched Requests: ", requestsData);

        } catch (error) {
            console.log("Error fetching requests: ", error);
        } finally {
            setLoading(false);
        }
    };

    fetchRequests();
}, []);

    const renderRequest = ({ item }) => {
        return (
                <TouchableOpacity 
                    style={styles.shopCard}
                    key={item.id}
                >

                    <Image source={{uri: item.homeData?.image}} style={{width:"100%", height: 200, borderRadius: 5}}/>

                    <View style={styles.title}>
                        <Text style={styles.shopName}>{item.homeData?.name}</Text>
                    </View>
                    <View style={styles.ratingRow}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                            <Entypo name="location-pin" size={16} color="black" />
                            <Text style={{color: "black", fontFamily: fonts.semiBold}}>{item.homeData?.location}</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                            <Entypo name="calendar" size={16} color="black" />
                            <Text style={{color: "#565556D"}}>{item.date}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
        )
    }

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.searchBoxRow}>
                <FontAwesome name="search" size={24} color="black" />
                <TextInput 
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{color: "grey", width: "100%"}}
                    placeholder="Seach Requests"
                />
            </View>
            <Text style={globalStyles.titleText}>
                Food Requests Queue
            </Text>

            <FlatList 
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={renderRequest}
            />

        </View>
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
        marginBottom: 20
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
    }
});