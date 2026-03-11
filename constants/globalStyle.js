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
        marginBottom: 4
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
        paddingVertical: 0,
        marginTop: 25,
        flex: 1,
        flexDirection: "column",
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
    },
    flexDisplay: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    searchBoxRow: {
        flexDirection: "row",
        backgroundColor: "#D9D9D9",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 50,
        gap: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    cameraClick: {
        height: 300,
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 50,
        marginBottom: 20
    },
    dropDownContainer: {
        width: "100%",
        backgroundColor: Colors.default.greyBackground,
        borderRadius: 50,
        marginBottom: 20,
        paddingInline: 10
    },
    marginBottom: {
        marginBottom: 10
    }
})