import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Chip({options, selected, onPress}) {
    return (
        <View style={{flexDirection: "row", marginBottom: 10}}>
            {options.map((option) => {
                return (
                    <TouchableOpacity
                        key={option}
                        style={[styles.chip, selected === option && {backgroundColor: Colors.default.primary}]}
                        onPress={() => onPress(option)}
                    >
                        <Text style={[styles.chipText, selected === option && {color: "white"}]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                )
                
            })}
        </View>
        
    )
}

const styles = StyleSheet.create({
    chip: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: "#D9D9D9",
        borderRadius: 20,
        marginRight: 10,
        fontFamily: fonts.semiBold,
        flex: 1
    },
    chipText: {
        fontFamily: fonts.semiBold,
    }
})