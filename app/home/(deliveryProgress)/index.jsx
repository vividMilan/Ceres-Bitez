import { globalStyles } from "@/constants/globalStyle";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// (deliveryProgress)/index.jsx
export default function index() {
    return (
        <SafeAreaProvider style={globalStyles.container}>
            <ActivityIndicator size="large" color="#26a04fff" />
            <Text style={{textAlign: 'center', marginTop: 10}}>Syncing status...</Text>
            {console.log("HEllo Hello Hello")}
        </SafeAreaProvider>
    );
}