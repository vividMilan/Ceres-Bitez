import Chip from "@/components/Chip";
import ShopCard from "@/components/shopCard";
import { globalStyles } from "@/constants/globalStyle";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const shopsData = [
  {
    id: "1",
    image: require("../../../../assets/images/shops/shop1.png"),
    shopName: "Foodie's Hub",
    rating: 4.5,
    deliveryTime: "30-40 mins",
    priceRange: "200-500",
    type: "Available",
  },
  {
    id: "2",
    image: require("../../../../assets/images/shops/shop2.png"),
    shopName: "Hopper Spot",
    rating: 4.5,
    deliveryTime: "20 mins",
    priceRange: "100-200",
    type: "Veg",
  },
  {
    id: "3",
    image: require("../../../../assets/images/shops/shop3.png"),
    shopName: "Spicy Bite",
    rating: 4.2,
    deliveryTime: "25 mins",
    priceRange: "150-250",
    type: "Non Veg",
  },
];

export default function Index() {

    const [selected, setSelected] = useState("All");
    const [searchText, setSearchText] = useState("");

    const filteredShops = shopsData
        .filter((shop) => selected === "All" || shop.type === selected)
        .filter((shop) => shop.shopName.toLowerCase().includes(searchText.toLowerCase()));  
    return (
        <View style={globalStyles.container}>
            <View style={styles.searchBoxRow}>
                <FontAwesome name="search" size={24} color="black" />
                <TextInput 
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{color: "grey"}}
                    placeholder="Search for shops or food"
                />
            </View>
            
            <View>
                <Chip 
                    options={["All", "Non Veg", "Veg"]}
                    selected={selected}
                    onPress={setSelected}
                />
            </View>
            <Text style={globalStyles.titleText}>Avalilable Restuatants</Text>
            

            <FlatList 
                data={filteredShops}
                key={(item) => item.id}
                renderItem={({item}) => (
                    <ShopCard 
                        image={item.image}
                        shopName={item.shopName}
                        rating={item.rating}
                        deliveryTIme={item.deliveryTime}
                        priceRange={item.priceRange}  
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBoxRow: {
        flexDirection: "row",
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 50,
        gap: 10,
        marginBottom: 20,
        alignItems: "center",
    }
})
