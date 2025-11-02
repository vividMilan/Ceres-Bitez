import { fonts, fontSizes } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {

    useEffect(() => {
        setTimeout(() => {
        router.replace("/(auth)/(student)/login");
        }, 0);
    }, []);
    
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