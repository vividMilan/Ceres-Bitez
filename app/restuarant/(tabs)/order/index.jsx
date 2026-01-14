import { globalStyles } from "@/constants/globalStyle";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
    const router = useRouter();
    // Progress 1
    return (
        <View style={globalStyles.container}>
            <Text>
                Accespted Orders
            </Text>

            <TouchableOpacity style={[globalStyles.button, {marginTop: "auto"}]}
                onPress={() => router.navigate("restuarant/(tabs)/order/(deliveryProgress)/progress4")}>
                <Text style={globalStyles.buttonText}>Go to Progress</Text>
            </TouchableOpacity>
        </View>
    )
}