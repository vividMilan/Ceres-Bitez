import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function CheckOut() {

    const [isSelected, setIsSelected] = useState("")

    return (
        <View style={[globalStyles.container]}>
            <PageTitleWithBackButton 
                heading={"Checkout"}
            />
            <View style={{display: "flex", gap: 10, marginBottom: 10}}>
                <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>
                    Order Details
                </Text>
                <View style={{display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#EBEBEB", padding: 10, borderRadius: 5}}>    
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={globalStyles.regularText}>Fish Rice & Curry</Text>
                            <Text style={globalStyles.regularText}>150.00</Text>
                        </View>
                    </View>
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={globalStyles.regularText}>Egg Hoppers</Text>
                            <Text style={globalStyles.regularText}>200.00</Text>
                        </View>
                    </View>
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={globalStyles.regularText}>Sub Total</Text>
                            <Text style={globalStyles.regularText}>150.00</Text>
                        </View>
                    </View>
                    <View>
                        <View style={globalStyles.spaceBetween}>
                            <Text style={{fontFamily: fonts.semiBold}}>Total</Text>
                            <Text style={{fontFamily: fonts.semiBold}}>150.00</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{display: "flex", gap: 10, marginBottom: 10}}>
                <Text style={{fontFamily: fonts.semiBold, fontSize: 20}}>
                    Payment Method
                </Text>
                <View style={{flexDirection: "row", gap: 10}}>
                    <TouchableOpacity style={{display: "flex", gap: 5, alignItems: "center", borderColor: Colors.default.primary, borderWidth: 2, width: 120, height: 100, justifyContent: "center", borderRadius: 10, backgroundColor: isSelected == "visa" ? "rgba(102, 80, 164, 0.20)" : "transparent" }} onPress={() => setIsSelected("visa")}>
                        <FontAwesome6 name="cc-visa" size={32} color="#1A1F71" />
                        <Text style={globalStyles.regularText}>
                            xxx945
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{display: "flex", gap: 5, alignItems: "center", borderColor: Colors.default.primary, borderWidth: 2, width: 120, height: 100, justifyContent: "center", borderRadius: 10, backgroundColor: isSelected === "mc" ? "rgba(102, 80, 164, 0.20)" : "transparent" }} onPress={() => setIsSelected("mc")}>
                        <FontAwesome6 name="cc-mastercard" size={32} color="#EB001B" />
                        <Text style={globalStyles.regularText}>
                            xxx945
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>Request Food</Text>
            </TouchableOpacity>
        </View>
    )
}