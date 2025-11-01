import { fonts, fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {

    return (
        <View style={globalStyles.container}>
            <Text style={styles.title}>Hello World</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily:fonts.regular,
        fontSize: fontSizes.title
    },
    text: {
        fontFamily: fonts.regular,
        fontSize: fontSizes.regular
    }
})