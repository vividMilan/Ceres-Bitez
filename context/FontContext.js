import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts
} from "@expo-google-fonts/poppins";
import { createContext, useContext } from "react";

const FontContext = createContext()

export const FontProvider = ({ children }) => {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold
    });

    if (!fontsLoaded) {
        return null;
    }

    const fonts = {
        regular: "Poppins_400Regular",
        medium: "Poppins_500Medium",
        semibold: "Poppins_600SemiBold",
        bold: "Poppins_700Bold",
    };

    return (
        <FontContext.Provider value={fonts}>
            {children}
        </FontContext.Provider>
    )
}

export const useFont = () => useContext(FontContext);