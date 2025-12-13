import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";

export default function HomeIndex() {
    return (
        <View style={globalStyles.container}>
            <Text style={{color: Colors.default.primary}}>Home Page</Text>
        </View>
    )
}