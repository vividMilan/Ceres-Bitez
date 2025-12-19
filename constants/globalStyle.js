import { StyleSheet } from "react-native";
import { fonts, fontSizes } from "./fonts";
import { Colors } from "./theme";

export const globalStyles = StyleSheet.create({
    headingText: {
        fontFamily: fonts.semiBold,
        fontSize: fontSizes.heading,
        marginBottom: 12
    },
    titleText: {
        fontFamily: fonts.semiBold,
        fontSize: fontSizes.title,
        marginBottom: 20
    },
    subTitleText: {
        fontFamily: fonts.semiBold,
        fontSize: fontSizes.subTitle,
        marginBottom: 10
    },
    regularText: {
        fontFamily: fonts.regular
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 25,
        flex: 1,
        flexDirection: "column"
    },
    button: {
        width: "100%",
        backgroundColor: Colors.default.primary,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20, 
    },
    buttonText: {
        color: Colors.default.background,
        fontFamily: fonts.semiBold,
        fontSize: fontSizes.regular
    },
    input: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontFamily: fonts.regular,
        marginBottom: 20,
        borderRadius: 100,
        backgroundColor: Colors.default.greyBackground,
        color: Colors.default.text
    },
    outlineButton: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        borderRadius: 5,
        borderColor: Colors.default.primary,
        borderWidth: 3,
        backgroundColor: "transparent",
    },
    spaceBetween: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})