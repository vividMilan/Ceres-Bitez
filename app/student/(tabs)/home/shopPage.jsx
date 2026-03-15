import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShopPage() {
    const { shopId, shopName, image } = useLocalSearchParams();
    const router = useRouter();

    const [menu, setMenu] = useState([]);
    const [qtyMap, setQtyMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shopId) return;

        const fetchFoods = async () => {
            try {
                const foodsSnap = await getDocs(
                    query(
                        collection(db, "foods"),
                        where("restuarantId", "==", shopId),
                        where("notSuitableAt", ">", new Date())
                    ),
                );

                const foodList = foodsSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMenu(foodList);
                setLoading(false);
                console.log("Fetched menu:", foodList);
            } catch (error) {
                console.error("Error fetching foods:", error);
            }
        };

        fetchFoods();
    }, [shopId]);

    const increaseQty = (id) => {
        setQtyMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const decreaseQty = (id) => {
        setQtyMap((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
    };

    const selectedItems = menu
        .filter((item) => (qtyMap[item.id] || 0) > 0)
        .map((item) => ({
            id: item.id,
            name: item.name,
            price: item.unitPrice,
            qty: qtyMap[item.id],
        }));

    const hasItems = selectedItems.length > 0;

    if (loading)
        return (
            <Text style={{ textAlign: "center", marginTop: 50 }}>
                Loading menu...
            </Text>
        );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: 200 }}
                />
                <Text style={[globalStyles.titleText, { textAlign: "center" }]}>
                    {shopName}
                </Text>
            </View>

            <View style={[globalStyles.container, { flex: 1 }]}>
                <Text style={globalStyles.subTitleText}>Menu</Text>
                <ScrollView>
                    {menu.map((item) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                borderBottomWidth: 1,
                                paddingVertical: 10,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontFamily: fonts.semiBold,
                                        fontSize: 20,
                                    }}
                                >
                                    {item.name}
                                </Text>
                                <Text>Rs. {item.unitPrice}</Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <FontAwesome
                                    name="minus-circle"
                                    size={32}
                                    onPress={() => decreaseQty(item.id)}
                                />
                                <Text style={{ fontSize: 20 }}>
                                    {qtyMap[item.id] || 0}
                                </Text>
                                <FontAwesome
                                    name="plus-circle"
                                    size={32}
                                    onPress={() => increaseQty(item.id)}
                                />
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    disabled={!hasItems}
                    style={[
                        globalStyles.button,
                        { opacity: hasItems ? 1 : 0.5 },
                    ]}
                    onPress={() =>
                        router.push({
                            pathname: "/student/home/OrderSummery",
                            params: {
                                shopId,
                                shopName,
                                selectedItems: JSON.stringify(selectedItems),
                            },
                        })
                    }
                >
                    <Text style={globalStyles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
