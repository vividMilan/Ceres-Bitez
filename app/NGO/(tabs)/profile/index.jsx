import { globalStyles } from "@/constants/globalStyle";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function() {
    return (
        <SafeAreaProvider style={globalStyles.container}>
            <Text>Hello Wolrd</Text>
        </SafeAreaProvider>
        
    )
}