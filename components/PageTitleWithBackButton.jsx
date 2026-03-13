import { globalStyles } from '@/constants/globalStyle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Text, View } from "react-native";

export default function({heading, navigate}) {

    const router = useRouter()

    

    return (
        <View style={{flexDirection: "row", width:"100%", backgroundColor: "transperant", alignItems: "center", marginBottom: 24}}>
            <Ionicons onPress={() => router.replace(navigate)} name="arrow-back-outline" size={36} color="black" style={{marginRight: 10}}/>
            <Text style={[globalStyles.titleText, {marginBottom: 0}]}>{heading}</Text>
        </View>
    )
}