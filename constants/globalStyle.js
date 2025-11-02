import { StyleSheet } from "react-native";
import { fonts, fontSizes } from "./fonts";
import { Colors } from "./theme";

export const globalStyles = StyleSheet.create({
    titleText: {
        fontFamily: fonts.semiBold,
        fontSize: fontSizes.title,
        marginBottom: 20
    },
    regularText: {
        fontFamily: fonts.regular,
    },
    container: {
        paddingHorizontal: 20,
        padding: 30,
        marginTop: 25,
        flex: 1,
        flexDirection: "column"
    },
    button: {
        width: "100%",
        backgroundColor: Colors.default.primary,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        borderRadius: 5,
        marginBottom: 50
    },
    buttonText: {
        color: Colors.default.background,
        fontFamily: fonts.medium
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
    }
})