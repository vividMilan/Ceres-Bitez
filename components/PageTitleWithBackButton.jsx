import { globalStyles } from '@/constants/globalStyle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from "react-native";

export default function({heading}) {
    return (
        <View style={{flexDirection: "row", width:"100%", backgroundColor: "transperant"}}>
            <Ionicons name="arrow-back-outline" size={40} color="black" style={{marginRight: 10}}/>
            <Text style={[globalStyles.titleText]}>{heading}</Text>
        </View>
    )
}