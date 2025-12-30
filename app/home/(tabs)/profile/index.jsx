import { globalStyles } from "@/constants/globalStyle";
import { Text, View } from "react-native";

export default function index() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Profile</Text>
        </View>
    )
}