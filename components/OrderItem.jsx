import { fontSizes } from "@/constants/fonts"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useState } from "react"
import { Text, View } from "react-native"

export default function OrderItem({itemName, itemQty}) {
    const [qty, setQty] = useState(itemQty)

    const increaseQty = () => {
        if (qty <= 10) {
            setQty(ItemQty + 1)
        }
    }

    const decreaseQty = () => {
        if (qty > 0) {
            setQty(ItemQty - 1)
        }
    }

    return (
        <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10}}>
            <Text style={{fontSize: fontSizes.regular}}>{itemName}</Text>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8}}>
                <FontAwesome name="minus-circle" size={28} color="black" onPress={() => decreaseQty()} />
                <Text style={{fontSize: 20}}>{qty}</Text>
                <FontAwesome name="plus-circle" size={28} color="black" onPress={() => increaseQty(qty + 1)}/>
            </View>
        </View>
    )

}