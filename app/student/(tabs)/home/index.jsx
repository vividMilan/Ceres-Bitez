import Chip from "@/components/Chip";
import ShopCard from "@/components/shopCard";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";

export default function Index() {

    const [selected, setSelected] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [shopData, setShopData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchShops = async () => {
            try {
                setLoading(true)
                const querySnapshop = await getDocs(collection(db, "restaurants"))

                const shops = []
                querySnapshop.forEach((doc) => {
                    shops.push(
                        { 
                            id: doc.id, 
                            deliveryTime: "30-40 mins",
                            priceRange: "200-500",
                            rating: 4.5,
                            ...doc.data() 
                        }
                    )
                })

                setShopData(shops)
                console.log(shops)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchShops()
    }, [])

    const filteredShops = shopData
        .filter((shop) => selected === "All" || shop.type === selected)
        .filter((shop) => (shop.name ?? "").toLowerCase().includes(searchText.toLowerCase()));  

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
            
            <View>
                <Chip 
                    options={["All", "Non Veg", "Veg"]}
                    selected={selected}
                    onPress={setSelected}
                />
            </View>
            <Text style={globalStyles.titleText}>Available Restuatants</Text>
            

            <FlatList 
                data={filteredShops}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <ShopCard 
                        id={item.id}
                        image={item.imageUrl}
                        shopName={item.name}
                        rating={item.rating}
                        deliveryTime={item.deliveryTime ?? "30 mins"}
                        priceRange={item.priceRange ?? "100-300"}
                    />
                )}
            />
        </View>
    )
}