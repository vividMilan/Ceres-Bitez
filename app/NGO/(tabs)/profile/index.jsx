import { globalStyles } from "@/constants/globalStyle";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { getUserData } from "@/app/(auth)/authController/authMethods";
import { Colors } from "@/constants/theme";

export default function() {
    const [ngoData, setNgoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userData, loading: userDataLoading } = getUserData();

    if (userDataLoading) {
        return (
            <SafeAreaProvider style={[globalStyles.container, { justifyContent: "center", alignItems: "center" } ]}>
                <ActivityIndicator size={50} color={Colors.default.primary} />
            </SafeAreaProvider>
        );
    }

    if (error) {
        return (
            <SafeAreaProvider style={globalStyles.container}>
                <Text style={{ color: "red" }}>Error: {error}</Text>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider style={globalStyles.container}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                    {userData?.ngoName || "NGO Name"}
                </Text>
                <Text style={{ fontSize: 16, color: "#666" }}>
                    {userData?.email || "Email not found"}
                </Text>
            </View>
        </SafeAreaProvider>
    );
}