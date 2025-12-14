import Accordian from '@/components/Accordian';
import { fonts } from '@/constants/fonts';
import { globalStyles } from '@/constants/globalStyle';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const orderDetail = [
    {
        shopName: "Spicy Hut",
        order: [
            {
                name: "Rice & Curry",
                qty: 5
            }
        ]
    },
    {
        shopName: "Sweet Cones",
        order: [
            {
                name: "Vanilla Ice Cream",
                qty: 1
            }
        ]
    }
]

export default function OderSummery() {
    return (
        <ScrollView stickyHeaderIndices={[0]} style={globalStyles.container}>
            <View style={{flexDirection: "row", width:"100%", backgroundColor: "transperant"}}>
                <Ionicons name="arrow-back-outline" size={40} color="black" style={{marginRight: 10}}/>
                <Text style={[globalStyles.titleText]}>Order Summery</Text>
            </View>
            <View>
                <View style={{marginBottom: 20}}>
                    <Text style={[globalStyles.subTitleText]}>Address</Text>
                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                            <FontAwesome6 name="location-dot" size={36} color="black" />
                            <View>
                                <Text style={{fontFamily: fonts.regular}}>5/3, Kirimandala Mw</Text>
                                <Text style={{fontFamily: fonts.regular}}>Narahenpita</Text>
                            </View>
                        </View>

                        <MaterialIcons name="navigate-next" size={44} color="black" />
                    </TouchableOpacity>
                </View>
                <View>
                    {orderDetail.map((orderDetail, index) => (
                        <Accordian 
                            key={index}
                            shopName={orderDetail.shopName}
                            orders={orderDetail.order}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}