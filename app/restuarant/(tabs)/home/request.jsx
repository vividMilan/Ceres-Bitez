import PageTitleWithBackButton from "@/components/PageTitleWithBackButton";
import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function request() {

    const student_pic = require("../../../../assets/images/student_pic.png")

    return (
        <View style={globalStyles.container}>
            <PageTitleWithBackButton 
                heading={"Back"}
            />

            <View style={[globalStyles.flexDisplay, {marginBottom: 20}]}>
                <Image 
                    source={student_pic}
                    style={{width: 60, height: 60, borderRadius: 50}}
                />
                <Text style={[{fontSize: 20, fontFamily: fonts.semiBold}]}>
                    D. Dilshan
                </Text>
            </View>
            <Text style={{fontSize: 20, fontFamily: fonts.semiBold}}>
                Order Details
            </Text>
            <View style={{backgroundColor: Colors.default.greyBackground, paddingVertical: 15, paddingHorizontal: 10, gap: 10, borderRadius: 10, marginBottom: 10}}>
                <View style={[globalStyles.spaceBetween]}>
                    <Text style={globalStyles.regularText}>Fish Rice & Curry</Text>
                    <Text style={globalStyles.regularText}>150.00</Text>
                </View>
                <View style={[globalStyles.spaceBetween]}>
                    <Text style={globalStyles.regularText}>Chicken Rice & Curry</Text>
                    <Text style={globalStyles.regularText}>200.00</Text>
                </View>
                <View style={[globalStyles.spaceBetween]}>
                    <Text style={[globalStyles.regularText, {fontFamily: fonts.semiBold}]}>Total</Text>
                    <Text style={[globalStyles.regularText, {fontFamily: fonts.semiBold}]}>150.00</Text>
                </View>
            </View>
    
            <View style={globalStyles.spaceBetween}>
                <Text style={{fontFamily: fonts.semiBold}}>Location (20 mins)</Text>
                <View>
                    <Text style={{fontFamily: fonts.semiBold}}>
                        Nawala
                    </Text>
                </View>
            </View>
            
            <TouchableOpacity style={[globalStyles.button, {marginTop: "auto"}]}>
                <Text style={globalStyles.buttonText}>Accept</Text>
            </TouchableOpacity>
        </View>
    )
}