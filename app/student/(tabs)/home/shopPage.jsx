import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ShopPage() {

    const [qty, setQty] = useState(0)

    const increaseQty = () => {
        if (qty <= 10) {
            setQty(qty + 1)
        }
    }

    const decreaseQty = () => {
        if (qty > 0) {
            setQty(qty - 1)
        }
    }

    const router = useRouter()

    return (

        <>
            <View>
                <Image source={require("../../../../assets/images/shops/shop1.png")} style={{width: "100%", height: 200}} />
                <Text style={[globalStyles.titleText, {textAlign: "center"}]}>Spicy Hut</Text>
            </View>
            <View style={globalStyles.container}>
                <Text
                    style={globalStyles.subTitleText}
                >
                    Rice & Curry
                </Text>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignContent: "center", borderBottomColor: "black", borderBottomWidth: 1, marginBottom: 2, paddingVertical: 10}}>
                    <View style={{display: "flex"}}>
                        <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>Fish Rice & Curry</Text>
                        <Text>Rs. 150</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8}}>
                        <FontAwesome name="minus-circle" size={32} color="black" onPress={() => decreaseQty()} />
                        <Text style={{fontSize: 20}}>{qty}</Text>
                        <FontAwesome name="plus-circle" size={32} color="black" onPress={() => increaseQty(qty + 1)}/>
                    </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignContent: "center", borderBottomColor: "black", borderBottomWidth: 1, marginBottom: 2, paddingVertical: 10}}>
                    <View style={{display: "flex"}}>
                        <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>Fish Rice & Curry</Text>
                        <Text>Rs. 150</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8}}>
                        <FontAwesome name="minus-circle" size={32} color="black" onPress={() => decreaseQty()} />
                        <Text style={{fontSize: 20}}>{qty}</Text>
                        <FontAwesome name="plus-circle" size={32} color="black" onPress={() => increaseQty(qty + 1)}/>
                    </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignContent: "center", borderBottomColor: "black", borderBottomWidth: 1, marginBottom: 2, paddingVertical: 10}}>
                    <View style={{display: "flex"}}>
                        <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>Fish Rice & Curry</Text>
                        <Text>Rs. 150</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8}}>
                        <FontAwesome name="minus-circle" size={32} color="black" onPress={() => decreaseQty()} />
                        <Text style={{fontSize: 20}}>{qty}</Text>
                        <FontAwesome name="plus-circle" size={32} color="black" onPress={() => increaseQty(qty + 1)}/>
                    </View>
                </View>

                <TouchableOpacity style={globalStyles.button} onPress={() => router.navigate("/student/home/OrderSummery")}>
                    <Text style={globalStyles.buttonText}>Next</Text>
                </TouchableOpacity>
                

            </View>       
        </>
        
    )
}