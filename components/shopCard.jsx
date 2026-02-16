import { fonts } from "@/constants/fonts";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ShopCard({ shopId, image, shopName }) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.shopCard}
            onPress={() =>
                router.push({
                    pathname: "/student/home/shopPage",
                    params: {
                        shopId,
                        shopName,
                        image,
                    },
                })
            }
        >
            <Image
                source={{ uri: image }}
                style={{ width: "100%", height: 200, borderRadius: 5 }}
            />

            <View style={styles.title}>
                <Text style={styles.shopName}>{shopName}</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <FontAwesome name="circle" size={16} color="green" />
                    <FontAwesome name="circle" size={16} color="red" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    shopCard: {
        backgroundColor: "#D9D9D9",
        flexDirection: "column",
        width: "100%",
        height: "fit-content",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
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
    },
});
