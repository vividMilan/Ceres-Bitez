import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ShopPage() {

    const {shopId, shopName, image, menu} = useLocalSearchParams()
    const [loading, setLoading] = useState(true)

    const [qtyMap, setQtyMap] = useState({});

    const parsedMenu = JSON.parse(menu) || []

    const increaseQty = (id) => {

        setQtyMap((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }))
    }

    const decreaseQty = (id) => {
        setQtyMap(prev => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0)
        }));
    };
    
    const router = useRouter()

    const selectedItems = parsedMenu
        .filter(item => (qtyMap[item.id] || 0) > 0)
        .map(item => ({
            id: item.id,
            name: item.name,
            price: item.unitPrice,
            qty: qtyMap[item.id]
        }))

    return (

        <>
            <View>
                <Image source={{uri: image}} style={{width: "100%", height: 200}} />
                <Text style={[globalStyles.titleText, {textAlign: "center"}]}>{shopName}</Text>
            </View>
            <View style={globalStyles.container}>
                <Text
                    style={globalStyles.subTitleText}
                >
                    Menu
                </Text>

                {parsedMenu.map((item) => (
                    <View key={item.id} style={{flexDirection: "row", justifyContent: "space-between", alignContent: "center", borderBottomColor: "black", borderBottomWidth: 1, marginBottom: 2, paddingVertical: 10}}>
                        <View style={{display: "flex"}}>
                            <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>{item.name}</Text>
                            <Text>Rs. {item.unitPrice}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8}}>
                            <FontAwesome name="minus-circle" size={32} color="black" onPress={() => decreaseQty(item.id)} />
                            <Text style={{fontSize: 20}}>{qtyMap[item.id] || 0}</Text>
                            <FontAwesome name="plus-circle" size={32} color="black" onPress={() => increaseQty(item.id)}/>
                        </View>
                    </View>
                ))}

                


                <TouchableOpacity 
                    style={[globalStyles.button, {marginTop: "auto"}]} 
                    onPress={() => 
                        router.push({
                            pathname: "/student/home/OrderSummery",
                            params: {
                                shopId,
                                shopName,
                                selectedItems: JSON.stringify(selectedItems)
                            }
                        })
                    }
                >
                    <Text style={globalStyles.buttonText}>Next</Text>
                </TouchableOpacity>
                

            </View>       
        </>
        
    )
}