import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const requests = [
    {
        shopName: "Spicy Hut",
        items: [
            {
                name: "Egg Hoopers",
                qty: 5
            },
            {
                name: "Fish Rice and Curry",
                qty: 2
            }
        ],
        price : 350
    },
    {
        shopName: "Amatchi Foods",
        items: [
            {
                name: "Egg Hoopers",
                qty: 5
            },
            {
                name: "Fish Rice and Curry",
                qty: 2
            }
        ],
        price : 350
    },
]

export default function Index() {


    const renderRequests = ({ item }) => {
        
        return (
            <TouchableOpacity style={styles.requestCard}>
                <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>
                    {item.shopName}
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
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Ongoing Requests</Text>
            
            <FlatList
                data={requests}
                renderItem={renderRequests}
            >
            </FlatList>
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