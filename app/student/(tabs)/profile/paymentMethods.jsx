import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { globalStyles } from "@/constants/globalStyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const paymentMethods = [
    {
        name: "Sampath",
        cardNo: "xxxx8999",
        icon: <FontAwesome6 name="cc-visa" size={32} color="#1A1F71" />,
    },
    {
        name: "Commercial",
        cardNo: "xxxx8779",
        icon: <FontAwesome6 name="cc-mastercard" size={32} color="#EB001B" />,
    },
];

export default function () {
    const router = useRouter();

    return (
        <SafeAreaView style={globalStyles.container}>
            <PageTitleWithBackButton heading={"Payment Methods"} />

            {paymentMethods.map((paymentMethod) => (
                <View
                    key={paymentMethod.name}
                    style={[globalStyles.spaceBetween, styles.paymentRow]}
                >
                    <View style={styles.paymentNameRow}>
                        {paymentMethod.icon}
                        <Text style={{ fontSize: 20 }}>
                            {paymentMethod.name} {paymentMethod.cardNo}
                        </Text>
                    </View>
                    <MaterialIcons
                        name="navigate-next"
                        size={24}
                        color="black"
                    />
                </View>
            ))}

            <TouchableOpacity
                style={[
                    globalStyles.button,
                    {
                        borderRadius: 25,
                        flexDirection: "row",
                        gap: 10,
                        marginTop: "auto",
                    },
                ]}
                onPress={() =>
                    router.navigate("/student/(tabs)/profile/addPayment")
                }
            >
                <AntDesign name="plus" size={24} color="white" />
                <Text style={[globalStyles.buttonText]}>
                    Add New Payment Method
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    paymentRow: {
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    paymentNameRow: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
});
