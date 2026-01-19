import { globalStyles } from "@/constants/globalStyle";
import { useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestDetails() {
    const { requestId, homeName, homeImage, requestDate } =
        useLocalSearchParams();

    return (
        <SafeAreaView>
            <View>
                <Image
                    source={{ uri: homeImage }}
                    style={{ width: "100%", height: 200 }}
                />
                <Text style={[globalStyles.titleText, { textAlign: "center" }]}>
                    {homeName}
                </Text>
            </View>
            <Text>Date: {requestDate}</Text>
            <Text>Item: 30 Rice and Curry</Text>
        </SafeAreaView>
    );
}
