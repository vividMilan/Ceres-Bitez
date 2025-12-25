import Chip from "@/components/Chip";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const requests = [
    {
        name: "A. Milan",
        items: [
            {
                name: "Fish & Curry",
                qty: 1
            },
            {
                name: "Chicken Rice & Curry",
                qty: 2
            }
        ],
        type: "Student",
        price: 350
    },
    {
        name: "V. Jay",
        items: [
            {
                name: "paratta",
                qty: 10
            }, 
            {
                name: "Chicken Curry",
                qty: 1
            }
        ],
        type: "Student",
        price: 350
    },
    {
        name: "Friends Lanka",
        items: [
            {
                name: "Chicken Rice & Curry",
                qty: 30
            },
        ],
        type: "NGO",
        price: 350
    },
    {
        name: "Save the Children",
        items: [
            {
                name: "Rice & Curry",
                qty: 10
            }, 
            {
                name: "Chicken Curry",
                qty: 1
            }
        ],
        type: "NGO",
        price: 350
    }
]

export default function Index() {

    const router = useRouter()

    const renderRequests = ({ item }) => {
        
        return (
            <TouchableOpacity style={styles.requestCard} onPress={() => router.push("/restuarant/home/request")}>
                <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>
                    {item.name}
                </Text>

                {item.items.map((item, index) => (
                    <Text key={index} style={globalStyles.regularText}>
                        {item.name} x {item.qty}
                    </Text>
                ))}

                <Text style={{fontSize: 24, fontFamily: fonts.semiBold, marginTop: 5}}>
                    Rs. {item.price}
                </Text>
            </TouchableOpacity>
        )
        
    }

    const [searchText, setSearchText] = useState("");
    const [selected, setSelected] = useState("All");

    const filteredRequests = requests
        .filter((request) => selected === "All" || request.type === selected)
        .filter((request) => request.name.toLowerCase().includes(searchText.toLowerCase()))

    return (
        <View style={globalStyles.container}>
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
                    options={["All", "NGO", "Student"]}
                    selected={selected}
                    onPress={setSelected}
                />
            </View>
            <View>
                <FlatList
                    data={filteredRequests}
                    renderItem={renderRequests}
                >
                </FlatList>
            </View>
        </View>
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