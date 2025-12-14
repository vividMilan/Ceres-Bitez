import { globalStyles } from '@/constants/globalStyle';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import OrderItem from './OrderItem';

export default function Accordian({shopName, orders}) {
    const [expanded, setExpanded] = useState(false)
    

    return (
        <View style={{marginTop: 10}}>
            <TouchableOpacity style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}} onPress={() => setExpanded(!expanded)}>
                <Text style={[globalStyles.subTitleText]}>{shopName}</Text>
                {expanded ? ( 
                    <AntDesign name="caret-up" size={24} color="black" />
                ) : (
                    <AntDesign name="caret-down" size={24} color="black" />
                ) }
                
            </TouchableOpacity>


            {expanded && (

                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20}}>

                    {orders.map((item, index) => (

                        <OrderItem
                            key={index} 
                            itemName={item.name}
                            itemQty={item.qty}
                        />

                    ))}
                </View>
            )}
        </View>

    )
}