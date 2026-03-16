import Chip from "@/components/Chip";
import ShopCard from "@/components/shopCard";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
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
            // const now = new Date();
            // const foodSnapShot = await getDocs(
            //     query(
            //         collection(db, "foods"),
            //         where("notSuitableAt", ">", now),
            //     )
            // );

            // const validFoods = foodSnapShot.docs.map((doc) => ({
            //     id: doc.id,
            //     ...doc.data(),
            // }));

            // // Filter by Veg/Non-Veg if selected
            // const filteredFoods =
            //     selected === "All"
            //         ? validFoods
            //         : validFoods.filter(
            //               (f) =>
            //                   f.vegNonVeg.toLowerCase() ===
            //                   selected.toLowerCase()
            //           );

            // // Get unique restaurant IDs
            // const restuarantIds = [
            //     ...new Set(filteredFoods.map((f) => f.restuarantId)),
            // ];

            // // Fetch restaurants
            // const restuarantsSnapShot = await getDocs(
            //     collection(db, "restaurants")
            // );

            // const restuarantData = restuarantsSnapShot.docs
            //     .map((doc) => ({ id: doc.id, ...doc.data() }))
            //     .filter((restuarant) => restuarantIds.includes(restuarant.uid));

            // setRestuarantData(restuarantData);

            const now = Timestamp.now()

            const foodQuery = query(
                collection(db, "foods"),
                where("notSuitableAt", ">", now)
            )

            const foodSnap = await getDocs(foodQuery)

            const validFoods = foodSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))

            const filteredFoods = 
                selected === "All"
                    ? validFoods
                    : validFoods.filter(
                        (f) => 
                            f.vegNonVeg.toLowerCase() === selected.toLowerCase()
                    )

            const restaurantIds = [
                ...new Set(filteredFoods.map((f) => f.restuarantId))
            ]

            if (restaurantIds.length === 0) {
                setRestuarantData([])
                return
            }

            const q = query(
                collection(db, "restaurant"),
                where("uid", "in", restaurantIds)
            )

            const restuarantSnap = await getDocs(q)

            const restaurantData = restuarantSnap.docs.map((doc) => ({
                uid: doc.id,
                ...doc.data()
            }))


            setRestuarantData(restaurantData)

            
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchShopsWithValidFoods();
}, [selected]); 

    const filteredShops = restuarantData.filter((shop) =>
        (shop.restaurantName ?? "").toLowerCase().includes(searchText.toLowerCase())
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
                keyExtractor={(item) => item.uid}
                renderItem={({ item, index }) => (
                    <ShopCard
                        index={index}
                        shopId={item.uid}
                        image={item.image}
                        shopName={item.restaurantName}
                        rating={item.rating}
                    />
                )}
            />
        </SafeAreaView>
    );
}
