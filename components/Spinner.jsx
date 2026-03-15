import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Spinner({ text = "Loading..." }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.default.primary} />
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },
    text: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: "gray"
    }
});