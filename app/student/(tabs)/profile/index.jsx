import { globalStyles } from "@/constants/globalStyle";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const router = useRouter();

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.headingText}>Profile</Text>

            <View style={{ gap: 16 }}>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                    onPress={() =>
                        router.navigate("/student/(tabs)/profile/about")
                    }
                >
                    <FontAwesome5 name="info-circle" size={24} color="black" />
                    <Text style={[globalStyles.regularText, { fontSize: 20 }]}>
                        About
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                    onPress={() =>
                        router.navigate(
                            "/student/(tabs)/profile/paymentMethods",
                        )
                    }
                >
                    <MaterialIcons name="payment" size={24} color="black" />
                    <Text style={[globalStyles.regularText, { fontSize: 20 }]}>
                        Payment Method
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
