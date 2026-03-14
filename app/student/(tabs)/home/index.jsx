import Chip from "@/components/Chip";
import ShopCard from "@/components/shopCard";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const [selected, setSelected] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [restuarantData, setRestuarantData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopsWithValidFoods = async () => {
            try {
                setLoading(true);
                const now = new Date();
                const foodSnapShot = await getDocs(
                    query(
                        collection(db, "foods"),
                        where("notSuitableAt", ">", now),
                    ),
                );

                const validFoods = foodSnapShot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const restuarantIds = [
                    ...new Set(validFoods.map((f) => f.restuarantId)),
                ];

                const restuarantsSnapShot = await getDocs(
                    collection(db, "restaurants"),
                );

                const restuarantData = restuarantsSnapShot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((restuarant) =>
                        restuarantIds.includes(restuarant.id),
                    );

                setRestuarantData(restuarantData);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopsWithValidFoods();
    }, []);

    const filteredShops = restuarantData
        .filter((shop) => selected === "All" || shop.type === selected)
        .filter((shop) =>
            (shop.name ?? "").toLowerCase().includes(searchText.toLowerCase()),
        );

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.searchBoxRow}>
                <FontAwesome name="search" size={24} color="black" />
                <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    style={{ color: "grey", width: "100%" }}
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
                renderItem={({ item, index }) => (
                    <ShopCard
                        index={index}
                        shopId={item.id}
                        image={item.imageUrl}
                        shopName={item.name}
                        rating={item.rating}
                    />
                )}
            />
        </SafeAreaView>
    );
}
