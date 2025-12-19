import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { globalStyles } from "@/constants/globalStyle";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function() {

    const [cardNum, setCardNum] = useState()
    const [accountName, setAccountName] = useState()
    const [expDate, setExpDate] = useState()
    const [cvv, setCvv] = useState()

    return (
        <View style={globalStyles.container}>
            <PageTitleWithBackButton 
                heading={"Add Payment Method"}
            />
            
            <View>
                <Text style={[globalStyles.regularText, {fontSize: 20}]}>Card Number</Text>
                <TextInput style={globalStyles.input} />
            </View>
            <View>
                <Text style={[globalStyles.regularText, {fontSize: 20}]}>Account Holder Name</Text>
                <TextInput style={globalStyles.input} />
            </View>

            <View style={{flexDirection: "row", justifyContent: "between", gap: 10}}>
                <View style={{flex: 1}}>
                    <Text style={[globalStyles.regularText, {fontSize: 20}]}>Exp Date</Text>
                    <TextInput style={globalStyles.input} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={[globalStyles.regularText, {fontSize: 20}]}>CVV</Text>
                    <TextInput style={globalStyles.input} />
                </View>
            </View>

            <TouchableOpacity style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>Add Payment Method</Text>
            </TouchableOpacity>
        </View>
    )
}