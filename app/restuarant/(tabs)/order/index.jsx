import { globalStyles } from "@/constants/globalStyle";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    return (
        <SafeAreaView style={globalStyles.container}>
            <Text>Order</Text>
        </SafeAreaView>
    );
}
