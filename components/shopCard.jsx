import { fonts } from "@/constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ShopCard({image, shopName, rating, deliveryTIme, priceRange}) {
    return (
        <TouchableOpacity style={styles.shopCard}>

            <Image source={image} style={{width:"100%", height: 200, borderRadius: 5}}/>

            <View style={styles.title}>
                <Text style={styles.shopName}>{shopName}</Text>
                <View style={{flexDirection: "row", gap: 5}}>
                    <FontAwesome name="circle" size={16} color="green" />
                    <FontAwesome name="circle" size={16} color="red" />
                </View>
                    
            </View>
            <View style={styles.ratingRow}>
                <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                    <AntDesign name="star" size={16} color="black" />
                    <Text style={{color: "black", fontFamily: fonts.semiBold}}>{rating}</Text>
                </View>
                <View>
                    <Text style={{color: "#565556D"}}>{deliveryTIme}</Text>
                </View>
                </View>
            <Text>Rs. {priceRange}</Text>
        </TouchableOpacity>
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