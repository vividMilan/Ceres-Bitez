import Accordian from '@/components/Accordian';
import PageTitleWithBackButton from '@/components/PageTitleWithBackButton';
import { fonts } from '@/constants/fonts';
import { globalStyles } from '@/constants/globalStyle';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
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

    const router = useRouter()

    return (
        <ScrollView stickyHeaderIndices={[0]} style={globalStyles.container}>
            <PageTitleWithBackButton 
                heading={"Summery"}
            />
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
                <View style={{marginBottom: 20}}>
                    <Text style={[globalStyles.subTitleText]}>Price</Text>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: 20, fontFamily: fonts.regular}}>Fish Rice & Curry</Text>
                        <Text style={{fontSize: 20, fontFamily: fonts.regular}}>150.00</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: 20, fontFamily: fonts.regular}}>Egg Hoppers</Text>
                        <Text style={{fontSize: 20, fontFamily: fonts.regular}}>200.00</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>Total</Text>
                        <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>150.00</Text>
                    </View>
                </View>

                <TouchableOpacity style={[globalStyles.button, {marginTop: "auto"}]} onPress={() => router.navigate("/student/(tabs)/home/checkout")}>
                    <Text style={globalStyles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}