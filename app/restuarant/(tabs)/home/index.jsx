import Chip from "@/components/Chip";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selected, setSelected] = useState("All");
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const restuarantId = "7ADL1PRfW0V6deM9bR2UjxdSXS72";

            const studentRequestsSnap = await getDocs(
                query(
                    collection(db, "studentRequests"),
                    where("restuarant.restuarantId", "==", restuarantId),
                    where("status", "==", "pending"),
                ),
            );

            const ngoRequestsSnap = await getDocs(
                query(
                    collection(db, "ngoRequests"),
                    where("restuarantId", "==", restuarantId),
                ),
            );

            const studentRequestsData = studentRequestsSnap.docs.map((doc) => ({
                id: doc.id,
                type: "Student",
                ...doc.data(),
            }));

            const ngoRequestsData = ngoRequestsSnap.docs.map((doc) => ({
                id: doc.id,
                type: "NGO",
                ...doc.data(),
            }));

            console.log(studentRequestsData);

            setRequests([...studentRequestsData]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = requests
        .filter((r) => selected === "All" || r.type === selected)
        .filter((r) => {
            const nameToSearch =
                r.type === "Student" ? r.student?.studentName : r.ngoName || "";
            return nameToSearch
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });

    const renderRequests = ({ item }) => {
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
                            totalPrice: item.totalPrice,
                        },
                    })
                }
            >
                <Text style={{ fontSize: 20, fontFamily: fonts.semiBold }}>
                    {item.student?.studentName || "Unknown Student"}
                </Text>

                {item.foodItems?.map((food, index) => (
                    <Text key={index} style={globalStyles.regularText}>
                        {food.name} x {food.qty}
                    </Text>
                ))}

                <Text
                    style={{
                        fontSize: 24,
                        fontFamily: fonts.semiBold,
                        marginTop: 5,
                    }}
                >
                    Rs. {item.totalPrice || 0}
                </Text>
            </TouchableOpacity>
        );
    };

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
            <View style={{ width: "100%" }}>
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
                    keyExtractor={(item) => item.id}
                ></FlatList>
            </View>
        </SafeAreaView>
    );
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
});
