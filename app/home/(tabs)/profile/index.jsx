import { globalStyles } from "@/constants/globalStyle";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function index() {
    return (
        <SafeAreaProvider style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Profile</Text>
        </SafeAreaProvider>
    );
}
