import { globalStyles } from "@/constants/globalStyle";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// (deliveryProgress)/index.jsx
export default function ProgressIndex() {
    return (
        <SafeAreaProvider style={globalStyles.container}>
            <ActivityIndicator size="large" color="#6200EE" />
            <Text style={{textAlign: 'center', marginTop: 10}}>Syncing status...</Text>
        </SafeAreaProvider>
    );
}