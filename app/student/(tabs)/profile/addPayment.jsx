import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { globalStyles } from "@/constants/globalStyle";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
    const [cardNum, setCardNum] = useState("");
    const [accountName, setAccountName] = useState("");
    const [expDate, setExpDate] = useState("");
    const [cvv, setCvv] = useState("");

    return (
        <SafeAreaView style={globalStyles.container}>
            <PageTitleWithBackButton heading={"Add Payment Method"} />

            <View>
                <Text style={[globalStyles.regularText, { fontSize: 20 }]}>
                    Card Number
                </Text>
                <TextInput
                    style={globalStyles.input}
                    value={cardNum}
                    onChangeText={setCardNum}
                    keyboardType="number-pad"
                />
            </View>
            <View>
                <Text style={[globalStyles.regularText, { fontSize: 20 }]}>
                    Account Holder Name
                </Text>
                <TextInput
                    value={accountName}
                    onChange={setAccountName}
                    style={globalStyles.input}
                />
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={[globalStyles.regularText, { fontSize: 20 }]}>
                        Exp Date
                    </Text>
                    <TextInput
                        style={globalStyles.input}
                        value={expDate}
                        onChange={setExpDate}
                        keyboardType="number-pad"
                        placeholder="MM/YY"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[globalStyles.regularText, { fontSize: 20 }]}>
                        CVV
                    </Text>
                    <TextInput
                        style={globalStyles.input}
                        value={cvv}
                        onChange={setCvv}
                        keyboardType="number-pad"
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[globalStyles.button, { marginTop: "auto" }]}
            >
                <Text style={globalStyles.buttonText}>Add Payment Method</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
