import { globalStyles } from "@/constants/globalStyle";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function requestDetails() {

    const { requestId } = useLocalSearchParams()

    return (
        <SafeAreaView>
            <Text style={globalStyles.titleText}></Text>
        </SafeAreaView>
    )
}